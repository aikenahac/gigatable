import type {
  Cell,
  Column,
  Row,
  Table as TanStackTable,
} from "@tanstack/react-table";
import * as React from "react";
import type { CellCoordinates, Selection } from "./use-cell-selection";

export interface GigatableCellState {
  isSelected: boolean;
  isInRange: boolean;
  isEditable: boolean;
  isFillAnchor: boolean;
  isFillRange: boolean;
  isFillSource: boolean;
  fillPreviewValue: unknown;
  fillHandleMouseDown: (event: React.MouseEvent) => void;
  pasteBackground: string;
  pasteShadow: string;
  pasteTransition: boolean;
  cellRef: (element: HTMLTableCellElement | null) => void;
}

export interface GigatableFeatures {
  cellSelection: boolean;
  rangeSelection: boolean;
  quickEdit: boolean;
  history: boolean;
  paste: boolean;
  fillHandle: boolean;
  fillDirection: "vertical" | "horizontal" | "both";
  columnResizing: boolean;
  clearing: boolean;
}

export type GigatableRowScroller = (
  rowIndex: number,
  behavior: "auto" | "smooth",
  align: "start" | "end" | "auto",
) => void;

export interface GigatableContextValue<TData> {
  table: TanStackTable<TData>;
  rows: Array<Row<TData>>;
  leafColumns: Array<Column<TData>>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  selectedCell: CellCoordinates | null;
  selection: Selection | null;
  allColumnsEditable: boolean;
  allowColumnResizing: boolean;
  tableStyle?: React.CSSProperties;
  features: GigatableFeatures;
  getCellState: (cell: Cell<TData, unknown>) => GigatableCellState;
  registerRowScroller: (scroller: GigatableRowScroller) => () => void;
}

const GigatableContext =
  React.createContext<GigatableContextValue<unknown> | null>(null);

export const GigatableContextProvider = GigatableContext.Provider;

export function useGigatableContext<TData>() {
  const context = React.use(GigatableContext);
  if (!context) {
    throw new Error(
      "useGigatableContext must be used within a <Gigatable> component.",
    );
  }
  return context as GigatableContextValue<TData>;
}
