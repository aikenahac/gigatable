import type { ColumnDef, RowData, TableOptions } from "@tanstack/react-table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useHistoryState } from "./use-history-state";
import type { CellCoordinates } from "./use-cell-selection";
import { parsePasteData } from "./parse-paste-data";
import { useCallback, useEffect, useState } from "react";

export interface CellChange {
  rowIndex: number;
  rowId: string;
  columnId: string;
  columnHeader: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface PasteResult {
  changes: CellChange[];
  totalChanges: number;
}

export interface UseDataTableProps<TData extends RowData, TValue>
  extends Omit<TableOptions<TData>, "getCoreRowModel"> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  history?: boolean;
  maxHistorySize?: number;
}

export function useDataTable<TData extends Record<string, any>, TValue>({
  columns,
  data: initialData,
  history = false,
  maxHistorySize,
  ...props
}: UseDataTableProps<TData, TValue>) {
  const [data, setData] = useState<TData[]>(initialData);

  const { presentState, setPresent, undo, redo, clear, canUndo, canRedo } =
    useHistoryState<TData[]>(initialData, maxHistorySize);

  const handleSetData = useCallback(
    (newData: TData[] | ((prevData: TData[]) => TData[])) => {
      setData((prevData) => {
        const updatedData =
          newData instanceof Function ? newData(prevData) : newData;
        if (history) {
          setPresent(updatedData);
        }
        return updatedData;
      });
    },
    [history, setPresent],
  );

  const updateCellData = useCallback(
    (rowIndex: number, columnId: string, value: unknown) => {
      handleSetData((old) =>
        old.map((row, index) =>
          index === rowIndex ? { ...row, [columnId]: value } : row,
        ),
      );
    },
    [handleSetData],
  );

  const applyFill = useCallback(
    (columnId: string, targetRowIndices: number[], value: unknown) => {
      handleSetData((old) =>
        old.map((row, index) =>
          targetRowIndices.includes(index) ? { ...row, [columnId]: value } : row,
        ),
      );
    },
    [handleSetData],
  );

  const table = useReactTable({
    data: history && presentState ? presentState : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: { updateCellData },
    ...props,
  });

  const handleTablePaste = useCallback(
    (
      selectedCell: CellCoordinates,
      clipboardData: string | undefined,
    ): PasteResult => {
      if (!clipboardData) {
        return { changes: [], totalChanges: 0 };
      }

      const changes: CellChange[] = [];

      handleSetData((oldData) => {
        const parsedData = parsePasteData(clipboardData);
        const newData = oldData.map((row) => ({ ...row }));

        const rows = table.getRowModel().rows;
        const columns = table.getVisibleFlatColumns();
        const startRowIndex = rows.findIndex(
          (row) => row.id === selectedCell.rowId,
        );
        const startColIndex = columns.findIndex(
          (col) => col.id === selectedCell.columnId,
        );

        parsedData.forEach((row, rowIndex) => {
          const targetRowIndex = startRowIndex + rowIndex;
          if (targetRowIndex >= rows.length) return;

          row.forEach((newValue, colIndex) => {
            const targetColIndex = startColIndex + colIndex;
            if (targetColIndex < columns.length) {
              const columnId = columns[targetColIndex].id;
              const oldValue = newData[targetRowIndex][columnId];

              if (oldValue !== newValue) {
                const column = columns[targetColIndex];
                const columnHeader =
                  typeof column.columnDef.header === "string"
                    ? column.columnDef.header
                    : columnId;

                changes.push({
                  rowIndex: targetRowIndex,
                  rowId: rows[targetRowIndex].id,
                  columnId,
                  columnHeader,
                  oldValue,
                  newValue,
                });

                (newData[targetRowIndex] as Record<string, any>)[columnId] =
                  newValue;
              }
            }
          });
        });

        return newData;
      });

      return {
        changes,
        totalChanges: changes.length,
      };
    },
    [table, handleSetData],
  );

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (history && presentState) {
      setData(presentState);
    }
  }, [presentState, history]);

  return {
    table,
    paste: handleTablePaste,
    applyFill,
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
  };
}
