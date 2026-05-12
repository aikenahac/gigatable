import type { ColumnDef, RowData, TableOptions } from "@tanstack/react-table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useHistoryState } from "./use-history-state";
import type { CellCoordinates } from "./use-cell-selection";
import type { CopyBuffer } from "./parse-copy-data";
import { parsePasteData } from "./parse-paste-data";
import { useCallback, useEffect, useState } from "react";

/** A single cell modification — row, column, and before/after values. Appears in {@link PasteResult.changes}. */
export interface CellChange {
  /** Zero-based index of the row in the current data array. */
  rowIndex: number;
  /** Stable row identifier assigned by TanStack Table. */
  rowId: string;
  /** Column accessor key. */
  columnId: string;
  /** Column header label, useful for displaying change summaries. */
  columnHeader: string;
  /** Cell value before the change. */
  oldValue: unknown;
  /** Cell value after the change. */
  newValue: unknown;
}

/** Summary returned by the `paste` handler after a Ctrl/Cmd+V operation. */
export interface PasteResult {
  /** Individual cell changes applied during the paste operation. */
  changes: Array<CellChange>;
  /** Total number of cells changed. Equals `changes.length`. */
  totalChanges: number;
}

/**
 * Configuration for {@link useGigatable}. Extends TanStack `TableOptions` — any option
 * accepted by `useReactTable` can be passed alongside the Gigatable-specific fields.
 */
export interface UseGigatableProps<TData extends RowData, TValue>
  extends Omit<TableOptions<TData>, "getCoreRowModel"> {
  /** TanStack column definitions. Set `meta: { editable: true }` on columns that support editing. */
  columns: Array<ColumnDef<TData, TValue>>;
  /** Initial row data array. Synced to internal state when the reference changes. */
  data: Array<TData>;
  /** Track all data mutations in an undo/redo history stack. Pairs with `allowHistory` on `Gigatable`. */
  history?: boolean;
  /** Maximum number of undo steps to retain. Defaults to 20. */
  maxHistorySize?: number;
}

/**
 * Creates and manages a TanStack Table instance with built-in support for inline cell
 * editing, undo/redo history, clipboard paste (TSV), and fill handle operations.
 *
 * Returns a `table` instance plus handlers (`paste`, `applyFill`, `undo`, `redo`) to
 * wire directly into `<Gigatable>`.
 */
export function useGigatable<TData extends Record<string, unknown>, TValue>({
  columns,
  data: initialData,
  history = false,
  maxHistorySize,
  ...props
}: UseGigatableProps<TData, TValue>) {
  const [data, setData] = useState<Array<TData>>(initialData);

  const { presentState, setPresent, undo, redo, clear, canUndo, canRedo } =
    useHistoryState<Array<TData>>(initialData, maxHistorySize);

  const handleSetData = useCallback(
    (newData: Array<TData> | ((prevData: Array<TData>) => Array<TData>)) => {
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
    (columnId: string, targetRowIndices: Array<number>, value: unknown) => {
      handleSetData((old) =>
        old.map((row, index) =>
          targetRowIndices.includes(index)
            ? { ...row, [columnId]: value }
            : row,
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
      copyBuffer?: CopyBuffer | null,
    ): PasteResult => {
      if (!clipboardData) {
        return { changes: [], totalChanges: 0 };
      }

      const changes: Array<CellChange> = [];

      handleSetData((oldData) => {
        const parsedData = parsePasteData(clipboardData);
        const newData = oldData.map((row) => ({ ...row }));

        const rows = table.getRowModel().rows;
        const columns = table.getVisibleFlatColumns();
        const startRowIndex = rows.findIndex(
          (row) => row.id === selectedCell.rowId,
        );

        const isInternalPaste =
          copyBuffer != null && clipboardData === copyBuffer.text;

        if (isInternalPaste) {
          parsedData.forEach((rowData, rowIndex) => {
            const targetRowIndex = startRowIndex + rowIndex;
            if (targetRowIndex >= rows.length) {
              return;
            }

            copyBuffer.columnIds.forEach((columnId, colIndex) => {
              const column = columns.find((c) => c.id === columnId);
              if (!column) {
                return;
              }

              const newValue = rowData[colIndex];
              if (newValue === undefined) {
                return;
              }

              const oldValue = newData[targetRowIndex][columnId];
              if (oldValue !== newValue) {
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

                (newData[targetRowIndex] as Record<string, unknown>)[columnId] =
                  newValue;
              }
            });
          });
        } else {
          const startColIndex = columns.findIndex(
            (col) => col.id === selectedCell.columnId,
          );

          parsedData.forEach((row, rowIndex) => {
            const targetRowIndex = startRowIndex + rowIndex;
            if (targetRowIndex >= rows.length) {
              return;
            }

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

                  (newData[targetRowIndex] as Record<string, unknown>)[
                    columnId
                  ] = newValue;
                }
              }
            });
          });
        }

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
