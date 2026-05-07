import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
