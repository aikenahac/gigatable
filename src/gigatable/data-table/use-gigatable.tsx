import type {
  Cell,
  ColumnDef,
  RowData,
  Table,
  TableMeta,
  TableOptions,
} from "@tanstack/react-table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useHistoryState } from "./use-history-state";
import type { CellCoordinates } from "./use-cell-selection";
import type { CopyBuffer } from "./parse-copy-data";
import { parsePasteData } from "./parse-paste-data";
import { useCallback, useEffect, useRef, useState } from "react";

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

export function mergeGigatableMeta<TData extends RowData>(
  meta: TableMeta<TData> | undefined,
  updateCellData: NonNullable<TableMeta<TData>["updateCellData"]>,
  clearCellData: NonNullable<TableMeta<TData>["clearCellData"]>,
) {
  return {
    ...meta,
    updateCellData,
    clearCellData,
  } as TableMeta<TData>;
}

export function resolveClearedValue<TData extends RowData>(
  cell: Cell<TData, unknown> | undefined,
) {
  const resolver = cell?.column.columnDef.meta?.getClearedValue;
  return resolver && cell ? resolver(cell) : null;
}

export function parsePastedCellValue<TData extends RowData>(
  value: string,
  cell: Cell<TData, unknown> | undefined,
) {
  const parser = cell?.column.columnDef.meta?.parsePastedValue;
  return parser && cell ? parser(value, cell) : value;
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
  const latestDataRef = useRef<Array<TData>>(initialData);

  const {
    presentState,
    setPresent,
    undo,
    redo,
    clear,
    reset,
    canUndo,
    canRedo,
  } = useHistoryState<Array<TData>>(initialData, maxHistorySize);
  const tableRef = useRef<Table<TData> | null>(null);

  const handleSetData = useCallback(
    (newData: Array<TData> | ((prevData: Array<TData>) => Array<TData>)) => {
      const previousData = latestDataRef.current;
      const updatedData =
        newData instanceof Function ? newData(previousData) : newData;

      if (updatedData === previousData) {
        return;
      }

      latestDataRef.current = updatedData;
      setData(updatedData);

      if (history) {
        setPresent(updatedData);
      }
    },
    [history, setPresent],
  );

  const updateCellData = useCallback(
    (rowIndex: number, columnId: string, value: unknown) => {
      handleSetData((old) => {
        const row = old[rowIndex];

        if (!row || row[columnId] === value) {
          return old;
        }

        return old.map((row, index) =>
          index === rowIndex ? { ...row, [columnId]: value } : row,
        );
      });
    },
    [handleSetData],
  );

  const applyFill = useCallback(
    (columnId: string, targetRowIndices: Array<number>, value: unknown) => {
      handleSetData((old) => {
        let didChange = false;
        const targetRows = new Set(targetRowIndices);
        const updated = old.map((row, index) => {
          if (!targetRows.has(index) || row[columnId] === value) {
            return row;
          }

          didChange = true;
          return { ...row, [columnId]: value };
        });

        return didChange ? updated : old;
      });
    },
    [handleSetData],
  );

  const applyHorizontalFill = useCallback(
    (rowIndex: number, targetColumnIds: Array<string>, value: unknown) => {
      handleSetData((old) => {
        const row = old[rowIndex];
        if (!row) {
          return old;
        }

        let didChange = false;
        const updatedRow = { ...row } as Record<string, unknown>;
        for (const columnId of targetColumnIds) {
          if (updatedRow[columnId] !== value) {
            updatedRow[columnId] = value;
            didChange = true;
          }
        }

        if (!didChange) {
          return old;
        }

        const updated = [...old];
        updated[rowIndex] = updatedRow as TData;
        return updated;
      });
    },
    [handleSetData],
  );

  const clearCells = useCallback(
    (cells: Array<{ rowIndex: number; columnId: string }>) => {
      handleSetData((old) => {
        const cellsByRow = new Map<number, Set<string>>();
        for (const { rowIndex, columnId } of cells) {
          const columnIds = cellsByRow.get(rowIndex) ?? new Set<string>();
          columnIds.add(columnId);
          cellsByRow.set(rowIndex, columnIds);
        }

        const tableRows = tableRef.current?.getRowModel().rows ?? [];
        let didChange = false;
        const updated = old.map((row, rowIndex) => {
          const columnIds = cellsByRow.get(rowIndex);
          if (!columnIds) {
            return row;
          }

          const updatedRow = { ...row } as Record<string, unknown>;
          let didChangeRow = false;
          for (const columnId of columnIds) {
            const cell = tableRows
              .find((tableRow) => tableRow.index === rowIndex)
              ?.getAllCells()
              .find((candidate) => candidate.column.id === columnId) as
              | Cell<TData, unknown>
              | undefined;
            const clearedValue = resolveClearedValue(cell);
            if (updatedRow[columnId] !== clearedValue) {
              updatedRow[columnId] = clearedValue;
              didChangeRow = true;
            }
          }

          if (!didChangeRow) {
            return row;
          }

          didChange = true;
          return updatedRow as TData;
        });

        return didChange ? updated : old;
      });
    },
    [handleSetData],
  );

  const table = useReactTable({
    data: history && presentState ? presentState : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...props,
    meta: mergeGigatableMeta(props.meta, updateCellData, clearCells),
  });
  tableRef.current = table;

  const handleTablePaste = useCallback(
    (
      selectedCell: CellCoordinates,
      clipboardData: string | undefined,
      copyBuffer?: CopyBuffer | null,
      isColumnEditable?: (columnId: string) => boolean,
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
            const targetRow = rows[targetRowIndex];
            const dataRowIndex = targetRow.index;

            copyBuffer.columnIds.forEach((columnId, colIndex) => {
              const column = columns.find((c) => c.id === columnId);
              if (!column || isColumnEditable?.(columnId) === false) {
                return;
              }

              const pastedValue = rowData[colIndex];
              if (pastedValue === undefined) {
                return;
              }

              const targetCell = targetRow
                .getAllCells()
                .find((cell) => cell.column.id === columnId) as
                | Cell<TData, unknown>
                | undefined;
              const newValue = parsePastedCellValue(pastedValue, targetCell);
              const oldValue = newData[dataRowIndex][columnId];
              if (oldValue !== newValue) {
                const columnHeader =
                  typeof column.columnDef.header === "string"
                    ? column.columnDef.header
                    : columnId;

                changes.push({
                  rowIndex: dataRowIndex,
                  rowId: targetRow.id,
                  columnId,
                  columnHeader,
                  oldValue,
                  newValue,
                });

                (newData[dataRowIndex] as Record<string, unknown>)[columnId] =
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
            const targetRow = rows[targetRowIndex];
            const dataRowIndex = targetRow.index;

            row.forEach((pastedValue, colIndex) => {
              const targetColIndex = startColIndex + colIndex;
              if (targetColIndex < columns.length) {
                const columnId = columns[targetColIndex].id;
                if (isColumnEditable?.(columnId) === false) {
                  return;
                }
                const targetCell = targetRow
                  .getAllCells()
                  .find((cell) => cell.column.id === columnId) as
                  | Cell<TData, unknown>
                  | undefined;
                const newValue = parsePastedCellValue(pastedValue, targetCell);
                const oldValue = newData[dataRowIndex][columnId];

                if (oldValue !== newValue) {
                  const column = columns[targetColIndex];
                  const columnHeader =
                    typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : columnId;

                  changes.push({
                    rowIndex: dataRowIndex,
                    rowId: targetRow.id,
                    columnId,
                    columnHeader,
                    oldValue,
                    newValue,
                  });

                  (newData[dataRowIndex] as Record<string, unknown>)[columnId] =
                    newValue;
                }
              }
            });
          });
        }

        return changes.length > 0 ? newData : oldData;
      });

      return {
        changes,
        totalChanges: changes.length,
      };
    },
    [table, handleSetData],
  );

  useEffect(() => {
    latestDataRef.current = initialData;
    setData(initialData);
    if (history) {
      reset(initialData);
    }
  }, [history, initialData, reset]);

  useEffect(() => {
    if (history && presentState) {
      latestDataRef.current = presentState;
      setData(presentState);
    }
  }, [presentState, history]);

  return {
    table,
    paste: handleTablePaste,
    applyFill,
    applyHorizontalFill,
    clearCells,
    undo,
    redo,
    clear,
    reset,
    canUndo,
    canRedo,
  };
}
