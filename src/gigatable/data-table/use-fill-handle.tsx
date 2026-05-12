import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import type { Row } from "@tanstack/react-table";
import type { CellCoordinates, Selection } from "./use-cell-selection";

interface DragState {
  columnId: string;
  selTopIdx: number;
  selBotIdx: number;
  hoverRowIdx: number;
}

export interface UseFillHandleProps {
  selectedCell: CellCoordinates | null;
  selection: Selection | null;
  rows: Array<Row<unknown>>;
  isColumnEditable: (columnId: string) => boolean;
  applyFill: (
    columnId: string,
    targetRowIndices: Array<number>,
    value: unknown,
  ) => void;
  onFillComplete?: (start: CellCoordinates, end: CellCoordinates) => void;
  enabled: boolean;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export interface UseFillHandleReturn {
  isAnchorCell: (rowId: string, columnId: string) => boolean;
  isFillRangeCell: (rowId: string, columnId: string) => boolean;
  isFillSourceCell: (rowId: string, columnId: string) => boolean;
  fillPreviewValue: unknown;
  fillHandleMouseDown: (e: React.MouseEvent) => void;
}

export function useFillHandle({
  selectedCell,
  selection,
  rows,
  isColumnEditable,
  applyFill,
  onFillComplete,
  enabled,
  containerRef,
}: UseFillHandleProps): UseFillHandleReturn {
  const rowIndexMapRef = useRef<Record<string, number>>({});
  const rowsRef = useRef<Array<Row<unknown>>>(rows);

  const rowIndexMap = useMemo(() => {
    const map: Record<string, number> = {};
    rows.forEach((row, i) => {
      map[row.id] = i;
    });
    return map;
  }, [rows]);

  useEffect(() => {
    rowIndexMapRef.current = rowIndexMap;
    rowsRef.current = rows;
  }, [rowIndexMap, rows]);

  const [dragState, setDragState] = useState<DragState | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  // During drag: handle follows hover row. At rest: handle at bottommost row of selection.
  const anchorCellKey = useMemo(() => {
    if (!enabled || !selectedCell || !isColumnEditable(selectedCell.columnId)) {
      return null;
    }

    if (dragState) {
      const hoverRowId = rows[dragState.hoverRowIdx]?.id;
      return hoverRowId ? `${hoverRowId}-${dragState.columnId}` : null;
    }

    if (!selection) {
      return `${selectedCell.rowId}-${selectedCell.columnId}`;
    }
    const startIdx = rowIndexMap[selection.start.rowId] ?? -1;
    const endIdx = rowIndexMap[selection.end.rowId] ?? -1;
    if (startIdx === -1 || endIdx === -1) {
      return `${selectedCell.rowId}-${selectedCell.columnId}`;
    }
    const botIdx = Math.max(startIdx, endIdx);
    const botRowId = rows[botIdx]?.id ?? selectedCell.rowId;
    return `${botRowId}-${selectedCell.columnId}`;
  }, [
    enabled,
    selectedCell,
    selection,
    rows,
    rowIndexMap,
    isColumnEditable,
    dragState,
  ]);

  const isAnchorCell = useCallback(
    (rowId: string, columnId: string) =>
      anchorCellKey === `${rowId}-${columnId}`,
    [anchorCellKey],
  );

  // Computes fill range bounds given current drag state.
  // Drag down (hoverRowIdx > selBotIdx): fill selTopIdx+1 ... hoverRowIdx
  // Drag up   (hoverRowIdx < selBotIdx): fill hoverRowIdx  ... selBotIdx-1
  const getFillBounds = (
    state: DragState,
  ): { min: number; max: number } | null => {
    const { selTopIdx, selBotIdx, hoverRowIdx } = state;
    if (hoverRowIdx > selBotIdx) {
      return { min: selTopIdx + 1, max: hoverRowIdx };
    }
    if (hoverRowIdx < selBotIdx) {
      return { min: hoverRowIdx, max: selBotIdx - 1 };
    }
    return null;
  };

  const isFillRangeCell = useCallback(
    (rowId: string, columnId: string) => {
      if (!dragState || columnId !== dragState.columnId) {
        return false;
      }
      const rowIdx = rowIndexMapRef.current[rowId] ?? -1;
      if (rowIdx === -1) {
        return false;
      }
      const bounds = getFillBounds(dragState);
      return bounds !== null && rowIdx >= bounds.min && rowIdx <= bounds.max;
    },
    [dragState],
  );

  // True for the source cell — it already has the correct value, so no preview overlay needed.
  const isFillSourceCell = useCallback(
    (rowId: string, columnId: string) => {
      if (!dragState || columnId !== dragState.columnId) {
        return false;
      }
      const rowIdx = rowIndexMapRef.current[rowId] ?? -1;
      if (rowIdx === -1) {
        return false;
      }
      const { selTopIdx, selBotIdx, hoverRowIdx } = dragState;
      if (hoverRowIdx > selBotIdx) {
        return rowIdx === selTopIdx;
      }
      if (hoverRowIdx < selBotIdx) {
        return rowIdx === selBotIdx;
      }
      return false;
    },
    [dragState],
  );

  // Value that will be written into fill cells — shown as preview during drag.
  const fillPreviewValue = useMemo(() => {
    if (!dragState) {
      return undefined;
    }
    const { columnId, selTopIdx, selBotIdx, hoverRowIdx } = dragState;
    if (hoverRowIdx > selBotIdx) {
      return (rows[selTopIdx]?.original as Record<string, unknown>)?.[columnId];
    }
    if (hoverRowIdx < selBotIdx) {
      return (rows[selBotIdx]?.original as Record<string, unknown>)?.[columnId];
    }
    return undefined;
  }, [dragState, rows]);

  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    mousePositionRef.current = { x: e.clientX, y: e.clientY };
    const state = dragStateRef.current;
    if (!state) {
      return;
    }
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const td = el?.closest("td[data-row-id]") as HTMLTableCellElement | null;
    if (!td || td.dataset.columnId !== state.columnId) {
      return;
    }
    const rowIdx = rowIndexMapRef.current[td.dataset.rowId!] ?? -1;
    if (rowIdx === -1 || rowIdx === state.hoverRowIdx) {
      return;
    }
    const nextState = { ...state, hoverRowIdx: rowIdx };
    dragStateRef.current = nextState;
    setDragState(nextState);
  }, []);

  const handleGlobalMouseUp = useCallback(() => {
    const state = dragStateRef.current;
    if (!state) {
      return;
    }
    const { columnId, selTopIdx, selBotIdx, hoverRowIdx } = state;
    const currentRows = rowsRef.current;
    const targetIndices: Array<number> = [];
    let sourceValue: unknown;
    let newSelTopIdx = selTopIdx;
    let newSelBotIdx = selBotIdx;

    if (hoverRowIdx > selBotIdx) {
      sourceValue = (
        currentRows[selTopIdx]?.original as Record<string, unknown>
      )?.[columnId];
      for (let i = selTopIdx + 1; i <= hoverRowIdx; i++) {
        targetIndices.push(i);
      }
      newSelBotIdx = hoverRowIdx;
    } else if (hoverRowIdx < selBotIdx) {
      sourceValue = (
        currentRows[selBotIdx]?.original as Record<string, unknown>
      )?.[columnId];
      for (let i = hoverRowIdx; i <= selBotIdx - 1; i++) {
        targetIndices.push(i);
      }
      newSelTopIdx = hoverRowIdx;
    }

    if (targetIndices.length > 0) {
      applyFill(columnId, targetIndices, sourceValue);
      const topRowId = currentRows[newSelTopIdx]?.id;
      const botRowId = currentRows[newSelBotIdx]?.id;
      if (topRowId && botRowId && onFillComplete) {
        onFillComplete(
          { rowId: topRowId, columnId },
          { rowId: botRowId, columnId },
        );
      }
    }

    isDraggingRef.current = false;
    dragStateRef.current = null;
    setDragState(null);
  }, [applyFill, onFillComplete]);

  useEffect(() => {
    if (!dragState) {
      return;
    }
    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [dragState, handleGlobalMouseMove, handleGlobalMouseUp]);

  // Auto-scroll at viewport edges during fill drag
  useEffect(() => {
    if (!dragState || !containerRef?.current) {
      return;
    }
    let animationFrameId: number;
    const autoScroll = () => {
      if (!containerRef.current || !isDraggingRef.current) {
        return;
      }
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const { x: mouseX, y: mouseY } = mousePositionRef.current;
      const edgeThreshold = 80;
      const maxScrollSpeed = 15;
      let scrollY = 0;
      const distBottom = rect.bottom - mouseY;
      const distTop = mouseY - rect.top;
      if (distBottom < edgeThreshold) {
        scrollY =
          maxScrollSpeed * (1 - Math.max(0, distBottom) / edgeThreshold);
      } else if (distTop < edgeThreshold) {
        scrollY = -maxScrollSpeed * (1 - Math.max(0, distTop) / edgeThreshold);
      }
      if (scrollY !== 0) {
        container.scrollTop += scrollY;
        // After scrolling, find the cell now under the clamped edge point and update hover
        const contentBottom = rect.top + container.clientHeight;
        const clampedY = Math.max(
          rect.top + 2,
          Math.min(contentBottom - 2, mouseY),
        );
        const clampedX = Math.max(
          rect.left + 2,
          Math.min(rect.left + container.clientWidth - 2, mouseX),
        );
        const el = document.elementFromPoint(clampedX, clampedY);
        const td = el?.closest(
          "td[data-row-id]",
        ) as HTMLTableCellElement | null;
        const state = dragStateRef.current;
        if (td && state && td.dataset.columnId === state.columnId) {
          const rowIdx = rowIndexMapRef.current[td.dataset.rowId!] ?? -1;
          if (rowIdx !== -1 && rowIdx !== state.hoverRowIdx) {
            const nextState = { ...state, hoverRowIdx: rowIdx };
            dragStateRef.current = nextState;
            setDragState(nextState);
          }
        }
      }
      if (isDraggingRef.current) {
        animationFrameId = requestAnimationFrame(autoScroll);
      }
    };
    animationFrameId = requestAnimationFrame(autoScroll);
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [dragState, containerRef]);

  const fillHandleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (!selectedCell || !enabled) {
        return;
      }

      const map = rowIndexMapRef.current;
      const selectedRowIdx = map[selectedCell.rowId] ?? -1;
      if (selectedRowIdx === -1) {
        return;
      }

      let selTopIdx = selectedRowIdx;
      let selBotIdx = selectedRowIdx;

      if (selection) {
        const startIdx = map[selection.start.rowId] ?? selectedRowIdx;
        const endIdx = map[selection.end.rowId] ?? selectedRowIdx;
        selTopIdx = Math.min(startIdx, endIdx);
        selBotIdx = Math.max(startIdx, endIdx);
      }

      const state: DragState = {
        columnId: selectedCell.columnId,
        selTopIdx,
        selBotIdx,
        hoverRowIdx: selBotIdx,
      };
      isDraggingRef.current = true;
      dragStateRef.current = state;
      setDragState(state);
    },
    [selectedCell, selection, enabled],
  );

  return {
    isAnchorCell,
    isFillRangeCell,
    isFillSourceCell,
    fillPreviewValue,
    fillHandleMouseDown,
  };
}
