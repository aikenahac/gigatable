import "@tanstack/react-table";
import type { Cell, RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    editable?: boolean;
    /** Whether an editable column participates in fill-handle operations. Defaults to true. */
    allowFill?: boolean;
    /** Converts clipboard text before it is stored in a cell. */
    parsePastedValue?: (value: string, cell: Cell<TData, TValue>) => unknown;
    /** Resolves the value written by Delete or Backspace. Defaults to null. */
    getClearedValue?: (cell: Cell<TData, TValue>) => unknown;
    /** Formats the transient value shown while dragging the fill handle. */
    formatFillPreview?: (value: unknown, cell: Cell<TData, TValue>) => string;
    /** Adds a class to the stock or composed Gigatable cell. */
    getCellClassName?: (cell: Cell<TData, TValue>) => string | undefined;
  }

  interface TableMeta<TData extends RowData> {
    updateCellData?: (
      rowIndex: number,
      columnId: string,
      value: unknown,
    ) => void;
    clearCellData?: (
      cells: Array<{ rowIndex: number; columnId: string }>,
    ) => void;
  }
}
