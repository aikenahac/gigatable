import * as React from "react";
import type { Column, Row } from "@tanstack/react-table";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export interface CellCoordinates {
  rowId: string;
  columnId: string;
}

export interface Selection {
  start: CellCoordinates;
  end: CellCoordinates;
}

const isSameCell = (
  cell: CellCoordinates | null,
  nextCell: CellCoordinates,
) => cell?.rowId === nextCell.rowId && cell.columnId === nextCell.columnId;

const isEditableElement = (element: Element | null) =>
  element instanceof HTMLInputElement ||
  element instanceof HTMLTextAreaElement ||
  element instanceof HTMLSelectElement ||
  (element instanceof HTMLElement && element.isContentEditable);

export function useCellSelection<TData>(
  rows: Array<Row<TData>>,
  columns: Array<Column<TData>>,
  containerRef?: React.RefObject<HTMLDivElement | null>,
  scrollToIndex?: (rowIndex: number, colIndex: number, behavior: 'auto' | 'smooth', rowAlign?: 'start' | 'end' | 'auto', colAlign?: 'start' | 'end' | 'auto') => void,
) {
  const [selectedCell, setSelectedCell] = useState<CellCoordinates | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const isSelectingRef = useRef(false);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  // Stores actual DOM elements (not RefObjects)
  const cellRefsMap = useRef<Map<string, HTMLTableCellElement>>(new Map());
  // Stable callback ref cache — same function identity per cell key across renders
  const cellRefCallbacksCache = useRef<Map<string, (el: HTMLTableCellElement | null) => void>>(new Map());
  // Live drag selection — never causes React re-renders
  const liveSelectionRef = useRef<Selection | null>(null);

  // Refs so stable callbacks can always read current index maps
  const rowIndexMapRef = useRef<Record<string, number>>({});
  const columnIndexMapRef = useRef<Record<string, number>>({});
  const rowIdsRef = useRef<Array<string>>([]);
  const columnIdsRef = useRef<Array<string>>([]);
  // Mirrors selectedCell state so stable callbacks can read it without re-creating
  const selectedCellRef = useRef<CellCoordinates | null>(null);

  const columnIndexMap = useMemo(() => {
    const map = columns.reduce((acc: Record<string, number>, column, index) => {
      acc[column.id] = index;
      return acc;
    }, {});
    columnIndexMapRef.current = map;
    columnIdsRef.current = columns.map((c) => c.id);
    return map;
  }, [columns]);

  const rowIndexMap = useMemo(() => {
    const map = rows.reduce((acc: Record<string, number>, row, index) => {
      acc[row.id] = index;
      return acc;
    }, {});
    rowIndexMapRef.current = map;
    rowIdsRef.current = rows.map((r) => r.id);
    return map;
  }, [rows]);

  // Toggles .is-in-range on cells that changed membership between prev and next ranges.
  // Iterates only the union bounding box; skips cells not in the DOM (virtual window).
  const updateSelectionDOM = useCallback(
    (prev: Selection | null, next: Selection | null) => {
      if (!prev && !next) return;

      const rIdx = (s: Selection, k: "start" | "end") =>
        rowIndexMapRef.current[s[k].rowId] ?? -1;
      const cIdx = (s: Selection, k: "start" | "end") =>
        columnIndexMapRef.current[s[k].columnId] ?? -1;

      const prevRMin = prev ? Math.min(rIdx(prev, "start"), rIdx(prev, "end")) : Infinity;
      const prevRMax = prev ? Math.max(rIdx(prev, "start"), rIdx(prev, "end")) : -Infinity;
      const prevCMin = prev ? Math.min(cIdx(prev, "start"), cIdx(prev, "end")) : Infinity;
      const prevCMax = prev ? Math.max(cIdx(prev, "start"), cIdx(prev, "end")) : -Infinity;

      const nextRMin = next ? Math.min(rIdx(next, "start"), rIdx(next, "end")) : -1;
      const nextRMax = next ? Math.max(rIdx(next, "start"), rIdx(next, "end")) : -1;
      const nextCMin = next ? Math.min(cIdx(next, "start"), cIdx(next, "end")) : -1;
      const nextCMax = next ? Math.max(cIdx(next, "start"), cIdx(next, "end")) : -1;

      const minRow = Math.min(prev ? prevRMin : Infinity, next ? nextRMin : Infinity);
      const maxRow = Math.max(prev ? prevRMax : -Infinity, next ? nextRMax : -Infinity);
      const minCol = Math.min(prev ? prevCMin : Infinity, next ? nextCMin : Infinity);
      const maxCol = Math.max(prev ? prevCMax : -Infinity, next ? nextCMax : -Infinity);

      if (minRow > maxRow || minCol > maxCol) return;

      const rowIds = rowIdsRef.current;
      const colIds = columnIdsRef.current;

      for (let r = minRow; r <= maxRow; r++) {
        const rowId = rowIds[r];
        if (!rowId) continue;
        for (let c = minCol; c <= maxCol; c++) {
          const colId = colIds[c];
          if (!colId) continue;
          const el = cellRefsMap.current.get(`${rowId}-${colId}`);
          if (!el) continue;
          const inNext =
            next !== null &&
            r >= nextRMin &&
            r <= nextRMax &&
            c >= nextCMin &&
            c <= nextCMax;
          el.classList.toggle("is-in-range", inNext);
        }
      }
    },
    [], // reads only from refs — truly stable
  );

  // Updates DOM + liveSelectionRef + React state atomically.
  // Use for keyboard navigation and initial mousedown — not during drag mousemove.
  const commitSelection = useCallback(
    (next: Selection | null) => {
      updateSelectionDOM(liveSelectionRef.current, next);
      liveSelectionRef.current = next;
      setSelection(next);
    },
    [updateSelectionDOM],
  );

  // Returns a stable callback ref for a cell.
  // React calls it with the element on mount and null on unmount.
  // On mount: registers element + applies correct .is-in-range from liveSelectionRef.
  const getCellRef = useCallback((rowId: string, columnId: string) => {
    const key = `${rowId}-${columnId}`;
    if (!cellRefCallbacksCache.current.has(key)) {
      cellRefCallbacksCache.current.set(key, (el: HTMLTableCellElement | null) => {
        if (el) {
          cellRefsMap.current.set(key, el);
          // Apply correct class when cell mounts (e.g. scrolled back into virtual window)
          if (liveSelectionRef.current) {
            const sel = liveSelectionRef.current;
            const r = rowIndexMapRef.current[rowId] ?? -1;
            const c = columnIndexMapRef.current[columnId] ?? -1;
            const rMin = Math.min(
              rowIndexMapRef.current[sel.start.rowId] ?? -1,
              rowIndexMapRef.current[sel.end.rowId] ?? -1,
            );
            const rMax = Math.max(
              rowIndexMapRef.current[sel.start.rowId] ?? -1,
              rowIndexMapRef.current[sel.end.rowId] ?? -1,
            );
            const cMin = Math.min(
              columnIndexMapRef.current[sel.start.columnId] ?? -1,
              columnIndexMapRef.current[sel.end.columnId] ?? -1,
            );
            const cMax = Math.max(
              columnIndexMapRef.current[sel.start.columnId] ?? -1,
              columnIndexMapRef.current[sel.end.columnId] ?? -1,
            );
            if (r >= 0 && c >= 0) {
              el.classList.toggle(
                "is-in-range",
                r >= rMin && r <= rMax && c >= cMin && c <= cMax,
              );
            }
          }
          // If this cell is the selected cell and it's mounting (virtualizer just scrolled to it),
          // focus it — handles the case where el.focus() failed in useLayoutEffect because the
          // cell wasn't in the DOM yet.
          const sc = selectedCellRef.current;
          if (sc && `${sc.rowId}-${sc.columnId}` === key) {
            const activeEl = document.activeElement;
            if (!el.contains(activeEl) || !isEditableElement(activeEl)) {
              el.focus();
            }
          }
        } else {
          cellRefsMap.current.delete(key);
          cellRefCallbacksCache.current.delete(key);
        }
      });
    }
    return cellRefCallbacksCache.current.get(key)!;
  }, []); // Truly stable — reads only from refs

  const isCellSelected = useCallback(
    (cellRowId: string, cellColumnId: string) =>
      !!(
        selectedCell &&
        selectedCell.rowId === cellRowId &&
        selectedCell.columnId === cellColumnId
      ),
    [selectedCell],
  );

  const setSelectedCellIfChanged = useCallback((nextCell: CellCoordinates) => {
    setSelectedCell((cell) => (isSameCell(cell, nextCell) ? cell : nextCell));
  }, []);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    rowId: string,
    columnId: string,
  ) => {
    const { key } = e;
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) return;
    e.preventDefault();

    const isCtrl = e.ctrlKey || e.metaKey;
    const edgeRowId = liveSelectionRef.current?.end.rowId ?? rowId;
    const edgeColumnId = liveSelectionRef.current?.end.columnId ?? columnId;
    const rowIndex = rowIndexMap[edgeRowId];
    const colIndex = columnIndexMap[edgeColumnId];

    let nextRowIndex = rowIndex;
    let nextColIndex = colIndex;

    switch (key) {
      case "ArrowUp":
        nextRowIndex = isCtrl ? 0 : Math.max(0, rowIndex - 1);
        break;
      case "ArrowDown":
        nextRowIndex = isCtrl ? rows.length - 1 : Math.min(rows.length - 1, rowIndex + 1);
        break;
      case "ArrowLeft":
        nextColIndex = isCtrl ? 0 : Math.max(0, colIndex - 1);
        break;
      case "ArrowRight":
        nextColIndex = isCtrl ? columns.length - 1 : Math.min(columns.length - 1, colIndex + 1);
        break;
    }

    const nextCoord: CellCoordinates = {
      rowId: rows[nextRowIndex].id,
      columnId: columns[nextColIndex].id,
    };
    const scrollBehavior: 'auto' | 'smooth' = isCtrl ? 'auto' : 'smooth';
    let rowAlign: 'start' | 'end' | 'auto' = 'auto';
    let colAlign: 'start' | 'end' | 'auto' = 'auto';
    if (isCtrl) {
      if (key === 'ArrowDown') rowAlign = 'end';
      else if (key === 'ArrowUp') rowAlign = 'start';
      else if (key === 'ArrowRight') colAlign = 'end';
      else if (key === 'ArrowLeft') colAlign = 'start';
    }

    if (e.shiftKey && selectedCell) {
      const start = liveSelectionRef.current?.start ?? selectedCell;
      commitSelection({ start, end: nextCoord });
      scrollToIndex?.(nextRowIndex, nextColIndex, scrollBehavior, rowAlign, colAlign);
      // selectedCell (the anchor) didn't change, so useLayoutEffect won't fire.
      // After the scroll, the anchor cell may be virtualized off-screen and lose focus.
      // Re-focus the container in the next frame so keyboard events keep working.
      if (containerRef?.current) {
        const container = containerRef.current;
        requestAnimationFrame(() => {
          if (!container.contains(document.activeElement)) {
            container.focus();
          }
        });
      }
    } else {
      setSelectedCellIfChanged(nextCoord);
      commitSelection({ start: nextCoord, end: nextCoord });
      scrollToIndex?.(nextRowIndex, nextColIndex, scrollBehavior, rowAlign, colAlign);
    }
  };

  const handleMouseDown = useCallback(
    (rowId: string, columnId: string, shiftKey?: boolean) => {
      if (shiftKey && selectedCellRef.current) {
        const start = liveSelectionRef.current?.start ?? selectedCellRef.current;
        commitSelection({ start, end: { rowId, columnId } });
      } else {
        setSelectedCellIfChanged({ rowId, columnId });
        commitSelection({ start: { rowId, columnId }, end: { rowId, columnId } });
      }
      isSelectingRef.current = true;
      setIsSelecting(true);
    },
    [commitSelection, setSelectedCellIfChanged],
  );

  // DOM-only during drag — zero React state updates, zero re-renders.
  const handleMouseEnter = useCallback(
    (rowId: string, columnId: string) => {
      if (!isSelectingRef.current) return;
      const prev = liveSelectionRef.current;
      if (!prev) return;
      const next: Selection = { start: prev.start, end: { rowId, columnId } };
      liveSelectionRef.current = next;
      updateSelectionDOM(prev, next);
    },
    [updateSelectionDOM],
  );

  const handleMouseUp = useCallback(() => {
    isSelectingRef.current = false;
    setIsSelecting(false);
    // Commit live selection to React state once (for copy/paste)
    setSelection(liveSelectionRef.current);
  }, []);

  const handleClick = useCallback(
    (rowId: string, columnId: string) => {
      setSelectedCellIfChanged({ rowId, columnId });
    },
    [setSelectedCellIfChanged],
  );

  // Attach global listeners once
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []); // handleMouseUp is stable (no deps)

  // Scroll selected cell into view
  useLayoutEffect(() => {
    selectedCellRef.current = selectedCell;
    if (!selectedCell) return;
    const el = cellRefsMap.current.get(`${selectedCell.rowId}-${selectedCell.columnId}`);
    if (el) {
      const activeElement = document.activeElement;
      if (el.contains(activeElement) && isEditableElement(activeElement)) return;
      el.focus();
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    } else if (containerRef?.current) {
      // Cell is not in the DOM yet (virtualizer hasn't rendered it). Focus the container
      // so keyboard events still bubble to the outer onKeyDown handler while we wait for
      // the virtualizer to mount the cell (getCellRef will focus it on mount).
      containerRef.current.focus();
    }
  }, [selectedCell, containerRef]);

  // Auto-scroll at viewport edges during drag
  useEffect(() => {
    if (!isSelecting || !containerRef?.current) return;
    let animationFrameId: number;
    const autoScroll = () => {
      if (!containerRef.current || !isSelectingRef.current) return;
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const { x: mouseX, y: mouseY } = mousePositionRef.current;
      const edgeThreshold = 80;
      const maxScrollSpeed = 15;
      let scrollX = 0;
      let scrollY = 0;
      const distBottom = rect.bottom - mouseY;
      const distTop = mouseY - rect.top;
      if (distBottom < edgeThreshold && distBottom > 0)
        scrollY = maxScrollSpeed * (1 - distBottom / edgeThreshold);
      else if (distTop < edgeThreshold && distTop > 0)
        scrollY = -maxScrollSpeed * (1 - distTop / edgeThreshold);
      const distRight = rect.right - mouseX;
      const distLeft = mouseX - rect.left;
      if (distRight < edgeThreshold && distRight > 0)
        scrollX = maxScrollSpeed * (1 - distRight / edgeThreshold);
      else if (distLeft < edgeThreshold && distLeft > 0)
        scrollX = -maxScrollSpeed * (1 - distLeft / edgeThreshold);
      if (scrollX !== 0 || scrollY !== 0) {
        container.scrollTop += scrollY;
        container.scrollLeft += scrollX;
      }
      if (isSelectingRef.current) {
        animationFrameId = requestAnimationFrame(autoScroll);
      }
    };
    animationFrameId = requestAnimationFrame(autoScroll);
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isSelecting, containerRef]);

  const setRangeSelection = useCallback(
    (start: CellCoordinates, end: CellCoordinates) => {
      setSelectedCellIfChanged(start);
      commitSelection({ start, end });
    },
    [commitSelection, setSelectedCellIfChanged],
  );

  return {
    selectedCell,
    selection,
    getCellRef,
    isCellSelected,
    isSelectingRef,
    handleClick,
    handleKeyDown,
    handleMouseDown,
    handleMouseEnter,
    setRangeSelection,
  };
}
