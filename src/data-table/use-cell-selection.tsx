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

export function useCellSelection<TData>(
  rows: Row<TData>[],
  columns: Column<TData>[],
  containerRef?: React.RefObject<HTMLDivElement | null>,
) {
  const [selectedCell, setSelectedCell] = useState<CellCoordinates | null>(
    null,
  );
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const isSelectingRef = useRef(false);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);

  const cellRefsMap = useRef<Map<string, React.RefObject<HTMLTableCellElement | null>>>(new Map());

  const columnIndexMap = useMemo(() => {
    return columns.reduce((acc: { [key: string]: number }, column, index) => {
      acc[column.id] = index;
      return acc;
    }, {});
  }, [columns]);

  const rowIndexMap = useMemo(() => {
    return rows.reduce((acc: { [key: string]: number }, row, index) => {
      acc[row.id] = index;
      return acc;
    }, {});
  }, [rows]);

  const getCellRef = useCallback((rowId: string, columnId: string) => {
    const key = `${rowId}-${columnId}`;

    if (!cellRefsMap.current.has(key)) {
      cellRefsMap.current.set(key, { current: null });
    }

    return cellRefsMap.current.get(key)!;
  }, []);

  const isCellSelected = useCallback(
    (cellRowId: string, cellColumnId: string) => {
      return !!(
        selectedCell &&
        selectedCell.rowId === cellRowId &&
        selectedCell.columnId === cellColumnId
      );
    },
    [selectedCell],
  );

  const isCellInRange = useCallback(
    (cellRowId: string, cellColumnId: string) => {
      if (!selection) return false;

      const rowIndex = rowIndexMap[cellRowId];
      const columnIndex = columnIndexMap[cellColumnId];

      const startRowIndex = rowIndexMap[selection.start.rowId];
      const startColumnIndex = columnIndexMap[selection.start.columnId];
      const endRowIndex = rowIndexMap[selection.end.rowId];
      const endColumnIndex = columnIndexMap[selection.end.columnId];

      const isRowInRange =
        rowIndex >= Math.min(startRowIndex, endRowIndex) &&
        rowIndex <= Math.max(startRowIndex, endRowIndex);
      const isColumnInRange =
        columnIndex >= Math.min(startColumnIndex, endColumnIndex) &&
        columnIndex <= Math.max(startColumnIndex, endColumnIndex);

      return isRowInRange && isColumnInRange;
    },
    [selection, columnIndexMap, rowIndexMap],
  );

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    rowId: string,
    columnId: string,
  ) => {
    const { key } = e;

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
      e.preventDefault();

      const edgeRowId = selection ? selection.end.rowId : rowId;
      const edgeColumnId = selection ? selection.end.columnId : columnId;

      const rowIndex = rowIndexMap[edgeRowId];
      const columnIndex = columnIndexMap[edgeColumnId];

      let nextRowId = edgeRowId;
      let nextColumnId = edgeColumnId;

      switch (key) {
        case "ArrowUp":
          if (rowIndex > 0) {
            nextRowId = rows[rowIndex - 1].id;
          }
          break;
        case "ArrowDown":
          if (rowIndex < rows.length - 1) {
            nextRowId = rows[rowIndex + 1].id;
          }
          break;
        case "ArrowLeft":
          if (columnIndex > 0) {
            nextColumnId = columns[columnIndex - 1].id;
          }
          break;
        case "ArrowRight":
          if (columnIndex < columns.length - 1) {
            nextColumnId = columns[columnIndex + 1].id;
          }
          break;
        default:
          return;
      }

      const nextSelectedCell = { rowId: nextRowId, columnId: nextColumnId };

      if (e.shiftKey && selectedCell) {
        setSelection((prev) => {
          const start = prev?.start || selectedCell;
          return { start, end: nextSelectedCell };
        });
      } else {
        if (!e.shiftKey) {
          setSelectedCell(nextSelectedCell);
          setSelection({
            start: nextSelectedCell,
            end: nextSelectedCell,
          });
        }
      }
    }
  };

  const handleMouseDown = useCallback((rowId: string, columnId: string) => {
    setSelectedCell({ rowId, columnId });
    setSelection({
      start: { rowId, columnId },
      end: { rowId, columnId },
    });
    isSelectingRef.current = true;
    setIsSelecting(true);
  }, []);

  const handleMouseEnter = useCallback(
    (rowId: string, columnId: string) => {
      if (isSelectingRef.current) {
        // Cancel any pending RAF
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
        }

        // Schedule state update for next frame
        rafIdRef.current = requestAnimationFrame(() => {
          setSelection((prev) => {
            if (!prev) return null;
            return {
              start: prev.start,
              end: { rowId, columnId },
            };
          });
          rafIdRef.current = null;
        });
      }
    },
    [],
  );

  const handleMouseUp = useCallback(() => {
    isSelectingRef.current = false;
    setIsSelecting(false);
  }, []);

  const handleClick = useCallback((rowId: string, columnId: string) => {
    setSelectedCell({
      rowId,
      columnId,
    });
  }, []);

  // Attach mouse listeners once - check isSelecting inside handler
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
  }, []); // Empty deps - attach once

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Cleanup cell refs for virtualized rows that are no longer visible
  useEffect(() => {
    const currentRowIds = new Set(rows.map(r => r.id));
    const keysToDelete: string[] = [];

    cellRefsMap.current.forEach((_, key) => {
      const rowId = key.split('-')[0];
      if (!currentRowIds.has(rowId)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => cellRefsMap.current.delete(key));
  }, [rows]);

  // Scroll into view when selected cell changes (for single cell selection)
  useLayoutEffect(() => {
    if (selectedCell) {
      const { rowId, columnId } = selectedCell;
      const key = `${rowId}-${columnId}`;
      const cellRef = cellRefsMap.current.get(key);
      if (cellRef && cellRef.current) {
        cellRef.current.focus();

        // Use native scrollIntoView for better performance
        cellRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      }
    }
  }, [selectedCell]);

  // Optimized auto-scroll using mouse position (avoids layout thrashing)
  useEffect(() => {
    if (!isSelecting || !containerRef?.current) {
      return;
    }

    let animationFrameId: number;

    const autoScroll = () => {
      if (!containerRef.current || !isSelecting) {
        return;
      }

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const mouseX = mousePositionRef.current.x;
      const mouseY = mousePositionRef.current.y;

      const edgeThreshold = 80; // Distance from edge to trigger scroll
      const maxScrollSpeed = 15; // Maximum scroll speed per frame

      let scrollX = 0;
      let scrollY = 0;

      // Calculate scroll speed based on distance from edge (closer = faster)
      // Vertical scrolling
      const distanceFromBottom = containerRect.bottom - mouseY;
      const distanceFromTop = mouseY - containerRect.top;

      if (distanceFromBottom < edgeThreshold && distanceFromBottom > 0) {
        scrollY = maxScrollSpeed * (1 - distanceFromBottom / edgeThreshold);
      } else if (distanceFromTop < edgeThreshold && distanceFromTop > 0) {
        scrollY = -maxScrollSpeed * (1 - distanceFromTop / edgeThreshold);
      }

      // Horizontal scrolling
      const distanceFromRight = containerRect.right - mouseX;
      const distanceFromLeft = mouseX - containerRect.left;

      if (distanceFromRight < edgeThreshold && distanceFromRight > 0) {
        scrollX = maxScrollSpeed * (1 - distanceFromRight / edgeThreshold);
      } else if (distanceFromLeft < edgeThreshold && distanceFromLeft > 0) {
        scrollX = -maxScrollSpeed * (1 - distanceFromLeft / edgeThreshold);
      }

      // Apply scroll
      if (scrollX !== 0 || scrollY !== 0) {
        container.scrollTop += scrollY;
        container.scrollLeft += scrollX;
      }

      // Continue loop while selecting
      if (isSelecting) {
        animationFrameId = requestAnimationFrame(autoScroll);
      }
    };

    // Start the animation loop
    animationFrameId = requestAnimationFrame(autoScroll);

    // Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isSelecting, containerRef]);

  return {
    selectedCell,
    selection,
    getCellRef,
    isCellSelected,
    isCellInRange,
    handleClick,
    handleKeyDown,
    handleMouseDown,
    handleMouseEnter,
  };
}
