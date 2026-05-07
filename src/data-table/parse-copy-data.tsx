import type { Selection } from "./use-cell-selection";
import type { Column, Row } from "@tanstack/react-table";

export interface CopyBuffer {
  text: string;
  columnIds: Array<string>;
}

export function parseCopyData<TData>(
  selection: Selection,
  rows: Array<Row<TData>>,
  columns: Array<Column<TData>>,
): CopyBuffer {
  const { start, end } = selection;

  const startRowIndex = rows.findIndex((row) => row.id === start.rowId);
  const endRowIndex = rows.findIndex((row) => row.id === end.rowId);
  const startColIndex = columns.findIndex((col) => col.id === start.columnId);
  const endColIndex = columns.findIndex((col) => col.id === end.columnId);

  const colStart = Math.min(startColIndex, endColIndex);
  const colEnd = Math.max(startColIndex, endColIndex) + 1;

  const columnIds = columns.slice(colStart, colEnd).map((col) => col.id);

  const text = rows
    .slice(
      Math.min(startRowIndex, endRowIndex),
      Math.max(startRowIndex, endRowIndex) + 1,
    )
    .map((row) =>
      row
        .getVisibleCells()
        .slice(colStart, colEnd)
        .map((cell) => cell.getValue())
        .join("\t"),
    )
    .join("\n");

  return { text, columnIds };
}
