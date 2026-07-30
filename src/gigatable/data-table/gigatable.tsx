import { clsx } from "clsx";
import type {
  Cell,
  Row,
  Table as TanStackTableType,
} from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Table } from "../table";
import type { CellCoordinates } from "./use-cell-selection";
import type { PasteResult } from "./use-gigatable";
import {
  isEditableElement,
  isCellWithinSelection,
  useCellSelection,
} from "./use-cell-selection";
import { useCopyToClipboard } from "./use-copy-to-clipboard";
import { useFillHandle } from "./use-fill-handle";
import type { FillDirection } from "./use-fill-handle";
import { parseCopyData } from "./parse-copy-data";
import type { CopyBuffer } from "./parse-copy-data";
import { parsePasteData } from "./parse-paste-data";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { GigatableTheme } from "../theme/types";
import { resolveTheme } from "../theme/utils";
import { EditableCell, QuickEditProvider } from "./editable-cell";
import type { EditableCellInputProps } from "./editable-cell";
import {
  getColumnResizerClassName,
  shouldRenderColumnResizer,
} from "./column-resizing";
export {
  getColumnResizerClassName,
  shouldRenderColumnResizer,
} from "./column-resizing";
import {
  GigatableContextProvider,
  type GigatableCellState,
  type GigatableContextValue,
  type GigatableRowScroller,
} from "./gigatable-context";
import {
  GigatableBody,
  GigatableCell,
  GigatableFeatureGuide,
  GigatableFooter,
  GigatableHeader,
  GigatableTable,
} from "./gigatable-parts";

const DefaultTextInput = ({
  value,
  onChange,
  onBlur,
  onKeyDown,
}: EditableCellInputProps<unknown>) => (
  <input
    autoFocus
    value={String(value ?? "")}
    onChange={onChange}
    onBlur={onBlur}
    onKeyDown={onKeyDown}
  />
);

const PASTE_HIGHLIGHT_TIMEOUT_DURATION = 5000;

const dispatchCellEdit = (cell: HTMLTableCellElement | null) => {
  cell
    ?.querySelector<HTMLElement>("[data-editable-cell-viewing]")
    ?.dispatchEvent(
      new MouseEvent("dblclick", { bubbles: true, cancelable: true }),
    );
};

/** Props for the {@link Gigatable} component. */
export interface GigatableProps<TData> {
  /** TanStack Table instance returned by `useGigatable`. */
  table: TanStackTableType<TData>;
  /** Enable single-cell click selection and arrow key navigation. */
  allowCellSelection?: boolean;
  /** Enable multi-cell range selection via mouse drag or Shift+Arrow. Requires `allowCellSelection`. */
  allowRangeSelection?: boolean;
  /** Enable single-column range selection via mouse drag or Shift+Arrow. Requires `allowCellSelection`. */
  singleColumnCellSelection?: boolean;
  /** Enable Ctrl/Cmd+Z undo and Ctrl/Cmd+Shift+Z redo shortcuts. Requires `undo` and `redo` props. */
  allowHistory?: boolean;
  /** Enable Ctrl/Cmd+V paste from clipboard (TSV format). Requires `paste` prop. */
  allowPaste?: boolean;
  /** Preserve copied column IDs for internal paste. Defaults to true. */
  pasteByColumnId?: boolean;
  /** Enable Alt/Option-click editing and Alt/Option-drag partial-text editing. */
  allowQuickEdit?: boolean;
  /** Enable Excel-style fill handle to drag-fill a value down a column. Requires `applyFill` prop and `meta: { editable: true }` on columns. */
  allowFillHandle?: boolean;
  /** Enable header-border drag handles for TanStack column resizing. Requires `enableColumnResizing` in `useGigatable`. */
  allowColumnResizing?: boolean;
  /** Paste handler from `useGigatable`. Required when `allowPaste` is true. */
  paste?: (
    selectedCell: CellCoordinates,
    clipboardData?: string,
    copyBuffer?: CopyBuffer | null,
  ) => PasteResult;
  /** Called after each paste with a summary of all cell changes. */
  onPasteComplete?: (result: PasteResult) => void;
  /** Fill handler from `useGigatable`. Required when `allowFillHandle` is true. */
  applyFill?: (
    columnId: string,
    targetRowIndices: Array<number>,
    value: unknown,
  ) => void;
  /** Horizontal fill handler from `useGigatable`. */
  applyHorizontalFill?: (
    rowIndex: number,
    targetColumnIds: Array<string>,
    value: unknown,
  ) => void;
  /** Allowed fill axes. Defaults to vertical. */
  fillDirection?: FillDirection;
  /** Undo handler from `useGigatable`. Required when `allowHistory` is true. */
  undo?: () => void;
  /** Redo handler from `useGigatable`. Required when `allowHistory` is true. */
  redo?: () => void;
  /** Customise the visual appearance of the table. Defaults to themes.light when omitted. */
  theme?: GigatableTheme;
  /** When true, every column is treated as editable using a default text input.
   *  Columns with explicit `meta: { editable: true }` keep their own renderInput. */
  allColumnsEditable?: boolean;
  /** Compound table content. Omit to render the default virtualized table. */
  children?: React.ReactNode;
  /** Ref to the scroll container, useful for custom virtualizers. */
  containerRef?: React.RefObject<HTMLDivElement | null>;
  /** Extra styles applied to the table in compound rendering mode. */
  tableStyle?: React.CSSProperties;
}

export function getSelectionCoordinates<TData>(
  selection: NonNullable<
    ReturnType<typeof useCellSelection<TData>>["selection"]
  >,
  rows: Array<Row<TData>>,
  columns: ReturnType<TanStackTableType<TData>["getVisibleLeafColumns"]>,
) {
  const startRowIndex = rows.findIndex(
    (row) => row.id === selection.start.rowId,
  );
  const endRowIndex = rows.findIndex((row) => row.id === selection.end.rowId);
  const startColumnIndex = columns.findIndex(
    (column) => column.id === selection.start.columnId,
  );
  const endColumnIndex = columns.findIndex(
    (column) => column.id === selection.end.columnId,
  );
  if (
    [startRowIndex, endRowIndex, startColumnIndex, endColumnIndex].some(
      (index) => index < 0,
    )
  ) {
    return [];
  }

  const coordinates: Array<{ rowIndex: number; columnId: string }> = [];
  for (
    let rowIndex = Math.min(startRowIndex, endRowIndex);
    rowIndex <= Math.max(startRowIndex, endRowIndex);
    rowIndex += 1
  ) {
    for (
      let columnIndex = Math.min(startColumnIndex, endColumnIndex);
      columnIndex <= Math.max(startColumnIndex, endColumnIndex);
      columnIndex += 1
    ) {
      coordinates.push({
        rowIndex: rows[rowIndex].index,
        columnId: columns[columnIndex].id,
      });
    }
  }
  return coordinates;
}

export function getEditableSelectionCoordinates<TData>(
  selection: NonNullable<
    ReturnType<typeof useCellSelection<TData>>["selection"]
  >,
  rows: Array<Row<TData>>,
  columns: ReturnType<TanStackTableType<TData>["getVisibleLeafColumns"]>,
  isColumnEditable: (columnId: string) => boolean,
) {
  return getSelectionCoordinates(selection, rows, columns).filter((cell) =>
    isColumnEditable(cell.columnId),
  );
}

export function repeatPasteToSelection(
  clipboardData: string,
  selection: {
    start: CellCoordinates;
    end: CellCoordinates;
  } | null,
  rowIds: Array<string>,
  columnIds: Array<string>,
) {
  if (!selection) {
    return clipboardData;
  }
  const parsed = parsePasteData(clipboardData);
  if (!parsed.length || !parsed[0]?.length) {
    return clipboardData;
  }
  const startRow = rowIds.indexOf(selection.start.rowId);
  const endRow = rowIds.indexOf(selection.end.rowId);
  const startColumn = columnIds.indexOf(selection.start.columnId);
  const endColumn = columnIds.indexOf(selection.end.columnId);
  if ([startRow, endRow, startColumn, endColumn].some((index) => index < 0)) {
    return clipboardData;
  }
  const rowCount = Math.abs(endRow - startRow) + 1;
  const columnCount = Math.abs(endColumn - startColumn) + 1;
  if (rowCount <= parsed.length && columnCount <= parsed[0].length) {
    return clipboardData;
  }
  return Array.from({ length: rowCount }, (_, rowIndex) =>
    Array.from(
      { length: columnCount },
      (_, columnIndex) =>
        parsed[rowIndex % parsed.length][
          columnIndex % parsed[rowIndex % parsed.length].length
        ],
    ).join("\t"),
  ).join("\n");
}

interface PasteHighlight {
  rowIds: Array<string>;
  columnIds: Array<string>;
  phase: "active" | "fading";
}

function computePasteCellStyle(
  rowId: string,
  columnId: string,
  highlight: PasteHighlight | null,
): {
  pasteBackground: string;
  pasteShadow: string;
  pasteTransition: boolean;
} {
  if (!highlight) {
    return { pasteBackground: "", pasteShadow: "", pasteTransition: false };
  }

  const rowIdx = highlight.rowIds.indexOf(rowId);
  const colIdx = highlight.columnIds.indexOf(columnId);

  if (rowIdx === -1 || colIdx === -1) {
    return { pasteBackground: "", pasteShadow: "", pasteTransition: false };
  }

  if (highlight.phase === "fading") {
    return {
      pasteBackground: "transparent",
      pasteShadow: "",
      pasteTransition: true,
    };
  }

  const color = "var(--gt-paste-highlight-border)";
  const shadows: Array<string> = [];
  if (rowIdx === 0) {
    shadows.push(`inset 0 1.5px 0 ${color}`);
  }
  if (rowIdx === highlight.rowIds.length - 1) {
    shadows.push(`inset 0 -1.5px 0 ${color}`);
  }
  if (colIdx === 0) {
    shadows.push(`inset 1.5px 0 0 ${color}`);
  }
  if (colIdx === highlight.columnIds.length - 1) {
    shadows.push(`inset -1.5px 0 0 ${color}`);
  }

  return {
    pasteBackground: "var(--gt-paste-highlight-bg)",
    pasteShadow: shadows.join(", "),
    pasteTransition: false,
  };
}

const TableCell = React.memo(
  ({
    cell,
    cellRef,
    isSelected,
    isInRange,
    isEditable,
    isFillAnchor,
    isFillRange,
    isFillSource,
    fillPreviewValue,
    fillHandleMouseDown,
    pasteBackground,
    pasteShadow,
    pasteTransition,
    allColumnsEditable,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TableCell is defined outside Gigatable<TData>, so the generic row type is unavailable here
    cell: Cell<any, unknown>;
    cellRef: (el: HTMLTableCellElement | null) => void;
    isSelected: boolean;
    isInRange: boolean;
    isEditable: boolean;
    isFillAnchor: boolean;
    isFillRange: boolean;
    isFillSource: boolean;
    fillPreviewValue: unknown;
    fillHandleMouseDown: (e: React.MouseEvent) => void;
    pasteBackground: string;
    pasteShadow: string;
    pasteTransition: boolean;
    allColumnsEditable: boolean;
  }) => (
    <Table.Data
      ref={cellRef}
      tabIndex={0}
      style={{
        width: `${cell.column.getSize()}px`,
        backgroundColor:
          pasteBackground ||
          (isFillRange
            ? "var(--gt-fill-preview-bg)"
            : isInRange
              ? "var(--gt-range-bg)"
              : undefined),
        boxShadow: pasteShadow || undefined,
        transition: pasteTransition
          ? "background-color 3000ms ease"
          : undefined,
      }}
      data-row-id={cell.row.id}
      data-column-id={cell.column.id}
      className={clsx(cell.column.columnDef.meta?.getCellClassName?.(cell), {
        "outline-[1.5px] outline-(--gt-selection-outline) -outline-offset-2 rounded-(--border-md) focus-visible:outline focus-visible:outline-(--gt-selection-outline) focus-visible:-outline-offset-2 focus-visible:rounded-(--border-md)":
          isSelected,
        "cursor-text": isEditable,
        relative: isFillAnchor,
        "is-in-range": isInRange,
        "is-fill-range": isFillRange,
      })}
      overlay={
        isFillAnchor ? (
          <span
            aria-hidden="true"
            data-gigatable-fill-handle
            className="absolute bottom-[-5px] right-[-5px] z-30 h-2 w-2 cursor-crosshair rounded-xs border border-(--gt-row-bg) bg-(--gt-selection-outline) shadow-[0_0_0_1px_var(--gt-cell-border-color),0_2px_5px_rgba(15,23,42,0.2)]"
            onMouseDown={fillHandleMouseDown}
          />
        ) : undefined
      }
    >
      {isFillRange && !isFillSource && fillPreviewValue !== undefined ? (
        <span className="text-(--gt-fill-preview-text-color) italic truncate">
          {String(fillPreviewValue)}
        </span>
      ) : allColumnsEditable && !cell.column.columnDef.meta?.editable ? (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <EditableCell
          {...(cell.getContext() as any)}
          renderInput={DefaultTextInput}
        />
      ) : (
        flexRender(cell.column.columnDef.cell, cell.getContext())
      )}
    </Table.Data>
  ),
  (prevProps, nextProps) =>
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isInRange === nextProps.isInRange &&
    prevProps.isFillAnchor === nextProps.isFillAnchor &&
    prevProps.isFillRange === nextProps.isFillRange &&
    prevProps.isFillSource === nextProps.isFillSource &&
    prevProps.fillPreviewValue === nextProps.fillPreviewValue &&
    prevProps.cell.getValue() === nextProps.cell.getValue() &&
    prevProps.cell.row.id === nextProps.cell.row.id &&
    prevProps.cell.column.id === nextProps.cell.column.id &&
    prevProps.pasteBackground === nextProps.pasteBackground &&
    prevProps.pasteShadow === nextProps.pasteShadow &&
    prevProps.pasteTransition === nextProps.pasteTransition &&
    prevProps.allColumnsEditable === nextProps.allColumnsEditable,
);
TableCell.displayName = "TableCell";

/**
 * High-performance, Excel-like data table built on TanStack Table with virtual scrolling.
 * Supports cell selection, range selection, keyboard navigation, undo/redo, clipboard
 * copy/paste (TSV format), fill handle, and full theming.
 *
 * @example
 * ```tsx
 * const { table, paste, applyFill, undo, redo } = useGigatable({ columns, data });
 * <Gigatable table={table} allowCellSelection allowPaste paste={paste} />
 * ```
 */
function GigatableRoot<TData>({
  table,
  allowCellSelection = false,
  allowRangeSelection = false,
  singleColumnCellSelection = false,
  allowHistory = false,
  allowPaste = false,
  pasteByColumnId = true,
  allowQuickEdit = false,
  allowFillHandle = false,
  allowColumnResizing = false,
  paste,
  onPasteComplete,
  applyFill,
  applyHorizontalFill,
  fillDirection = "vertical",
  undo,
  redo,
  theme,
  allColumnsEditable = false,
  children,
  containerRef,
  tableStyle,
}: GigatableProps<TData>) {
  const internalTableContainerRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = containerRef ?? internalTableContainerRef;
  const rowScrollerRef = useRef<GigatableRowScroller | null>(null);
  const rows = table.getRowModel().rows;
  const leafColumns = table.getVisibleLeafColumns();
  const isRangeSelectionEnabled =
    allowRangeSelection || singleColumnCellSelection;
  const lastMouseOverCellRef = useRef<string | null>(null);
  const copyBufferRef = useRef<CopyBuffer | null>(null);
  const resolvedTheme = resolveTheme(theme);
  const rowHeightPx = parseInt(resolvedTheme["--gt-row-height"], 10) || 30;

  const [pasteHighlight, setPasteHighlight] = useState<PasteHighlight | null>(
    null,
  );
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current);
      }
    };
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: children ? 0 : rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => rowHeightPx,
    overscan: 5,
  });

  const columnVirtualizer = useVirtualizer({
    count: children ? 0 : leafColumns.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: (index) => leafColumns[index].getSize(),
    horizontal: true,
    overscan: 3,
  });
  const columnSizing = table.getState().columnSizing;
  const columnSizingInfo = table.getState().columnSizingInfo;

  useEffect(() => {
    columnVirtualizer.measure();
  }, [columnVirtualizer, columnSizing, columnSizingInfo]);

  const scrollToCell = useCallback(
    (
      rowIndex: number,
      colIndex: number,
      behavior: "auto" | "smooth",
      rowAlign: "start" | "end" | "auto" = "auto",
      colAlign: "start" | "end" | "auto" = "auto",
    ) => {
      const container = tableContainerRef.current;
      // Use scrollHeight/scrollWidth for 'end' alignment — virtualizer estimates row heights
      // from a fixed 30px guess, so getOffsetForIndex undershoots for taller actual rows.
      if (rowAlign === "end" && container) {
        container.scrollTop = container.scrollHeight;
      } else if (rowScrollerRef.current) {
        rowScrollerRef.current(rowIndex, behavior, rowAlign);
      } else {
        rowVirtualizer.scrollToIndex(rowIndex, { behavior, align: rowAlign });
      }
      if (colAlign === "end" && container) {
        container.scrollLeft = container.scrollWidth;
      } else {
        columnVirtualizer.scrollToIndex(colIndex, {
          behavior,
          align: colAlign,
        });
      }
    },
    [rowVirtualizer, columnVirtualizer],
  );

  const {
    selectedCell,
    selection: selectedRange,
    getCellRef,
    isCellSelected,
    isSelectingRef,
    handleClick,
    handleKeyDown,
    handleMouseDown,
    handleMouseEnter,
    setRangeSelection,
  } = useCellSelection(
    rows,
    leafColumns,
    tableContainerRef,
    scrollToCell,
    isRangeSelectionEnabled,
    singleColumnCellSelection,
  );
  const selectedRangeRowIds = useMemo(() => rows.map((row) => row.id), [rows]);
  const selectedRangeColumnIds = useMemo(
    () => leafColumns.map((column) => column.id),
    [leafColumns],
  );

  const isColumnEditable = useCallback(
    (columnId: string) => {
      if (allColumnsEditable) {
        return true;
      }
      const col = leafColumns.find((c) => c.id === columnId);
      return col?.columnDef.meta?.editable ?? false;
    },
    [leafColumns, allColumnsEditable],
  );
  const isColumnFillEnabled = useCallback(
    (columnId: string) => {
      const column = leafColumns.find((candidate) => candidate.id === columnId);
      return (
        isColumnEditable(columnId) &&
        column?.columnDef.meta?.allowFill !== false
      );
    },
    [isColumnEditable, leafColumns],
  );

  const {
    isAnchorCell,
    isFillRangeCell,
    isFillSourceCell,
    fillPreviewValue,
    fillHandleMouseDown,
  } = useFillHandle({
    selectedCell,
    selection: selectedRange,
    rows: rows as Array<Row<unknown>>,
    columnIds: leafColumns.map((column) => column.id),
    isColumnEditable: isColumnFillEnabled,
    applyFill: applyFill ?? (() => {}),
    applyHorizontalFill,
    onFillComplete: setRangeSelection,
    enabled: allowFillHandle && !!applyFill,
    fillDirection,
    containerRef: tableContainerRef,
  });

  const [, copy] = useCopyToClipboard();

  // Trigger fade when the user moves selection away after a paste
  const prevSelectedCellKeyRef = useRef<string>("");
  useEffect(() => {
    const key = selectedCell
      ? `${selectedCell.rowId}:${selectedCell.columnId}`
      : "";
    if (
      pasteHighlight?.phase === "active" &&
      key !== prevSelectedCellKeyRef.current
    ) {
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current);
      }
      setPasteHighlight((prev) => (prev ? { ...prev, phase: "fading" } : null));
      fadeTimerRef.current = setTimeout(
        () => setPasteHighlight(null),
        PASTE_HIGHLIGHT_TIMEOUT_DURATION,
      );
    }
    prevSelectedCellKeyRef.current = key;
  }, [selectedCell, pasteHighlight]);

  const handleBodyClick = useCallback(
    (e: React.MouseEvent) => {
      if (!allowCellSelection) {
        return;
      }
      const td = (e.target as Element).closest(
        "td[data-row-id]",
      ) as HTMLTableCellElement | null;
      if (!td) {
        return;
      }
      handleClick(td.dataset.rowId!, td.dataset.columnId!);
      if (
        allowQuickEdit &&
        e.altKey &&
        isColumnEditable(td.dataset.columnId!)
      ) {
        dispatchCellEdit(td);
      }
    },
    [allowCellSelection, allowQuickEdit, handleClick, isColumnEditable],
  );

  const handleBodyMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!allowCellSelection || !isRangeSelectionEnabled) {
        return;
      }
      const td = (e.target as Element).closest(
        "td[data-row-id]",
      ) as HTMLTableCellElement | null;
      if (!td) {
        return;
      }
      lastMouseOverCellRef.current = null;
      handleMouseDown(td.dataset.rowId!, td.dataset.columnId!, e.shiftKey);
    },
    [allowCellSelection, isRangeSelectionEnabled, handleMouseDown],
  );

  const handleBodyMouseOver = useCallback(
    (e: React.MouseEvent) => {
      if (
        !allowCellSelection ||
        !isRangeSelectionEnabled ||
        !isSelectingRef.current
      ) {
        return;
      }
      const td = (e.target as Element).closest(
        "td[data-row-id]",
      ) as HTMLTableCellElement | null;
      if (!td) {
        return;
      }
      const key = `${td.dataset.rowId}-${td.dataset.columnId}`;
      if (key === lastMouseOverCellRef.current) {
        return;
      }
      lastMouseOverCellRef.current = key;
      handleMouseEnter(td.dataset.rowId!, td.dataset.columnId!);
    },
    [
      allowCellSelection,
      isRangeSelectionEnabled,
      isSelectingRef,
      handleMouseEnter,
    ],
  );

  const handleContainerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!allowCellSelection) {
        return;
      }
      const td = (e.target as Element).closest(
        "td[data-row-id]",
      ) as HTMLTableCellElement | null;
      const rowId = td?.dataset.rowId ?? selectedCell?.rowId;
      const columnId = td?.dataset.columnId ?? selectedCell?.columnId;
      if (!rowId || !columnId) {
        return;
      }

      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        !isEditableElement(e.target as Element)
      ) {
        const activeSelection = selectedRange ?? {
          start: { rowId, columnId },
          end: { rowId, columnId },
        };
        const cells = getEditableSelectionCoordinates(
          activeSelection,
          rows,
          leafColumns,
          isColumnEditable,
        );
        if (cells.length) {
          e.preventDefault();
          table.options.meta?.clearCellData?.(cells);
        }
        return;
      }

      const editingElement = isEditableElement(e.target as Element);
      handleKeyDown(e as React.KeyboardEvent<HTMLDivElement>, rowId, columnId);
      if (e.key === "Enter") {
        if (editingElement) {
          const rowIndex = rows.findIndex((row) => row.id === rowId);
          const columnIndex = leafColumns.findIndex(
            (column) => column.id === columnId,
          );
          const nextRow = rows[Math.min(rowIndex + 1, rows.length - 1)];
          if (nextRow && rowIndex >= 0 && columnIndex >= 0) {
            const nextCell = { rowId: nextRow.id, columnId };
            setRangeSelection(nextCell, nextCell);
            scrollToCell(
              Math.min(rowIndex + 1, rows.length - 1),
              columnIndex,
              "smooth",
            );
            if (nextRow.id === rowId) {
              requestAnimationFrame(() => td?.focus({ preventScroll: true }));
            }
          }
        } else {
          dispatchCellEdit(td);
        }
      }
    },
    [
      allowCellSelection,
      handleKeyDown,
      isColumnEditable,
      leafColumns,
      rows,
      scrollToCell,
      selectedCell,
      selectedRange,
      setRangeSelection,
      table.options.meta,
    ],
  );

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "c" &&
        selectedRange
      ) {
        event.preventDefault();
        const copyBuffer = parseCopyData(
          selectedRange,
          table.getRowModel().rows,
          table.getAllColumns(),
        );
        copyBufferRef.current = copyBuffer;
        void copy(copyBuffer.text);
      }
      if (
        allowHistory &&
        (event.ctrlKey || event.metaKey) &&
        event.key === "z"
      ) {
        event.preventDefault();
        if (event.shiftKey) {
          redo?.();
        } else {
          undo?.();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [selectedRange, copy, allowHistory, undo, redo, table]);

  useEffect(() => {
    if (allowPaste && paste && selectedCell) {
      const pasteHandler = (event: ClipboardEvent) => {
        const rawClipboardText = event.clipboardData?.getData("Text");
        const clipboardText = rawClipboardText
          ? repeatPasteToSelection(
              rawClipboardText,
              selectedRange,
              selectedRangeRowIds,
              selectedRangeColumnIds,
            )
          : rawClipboardText;
        event.preventDefault();
        const result = paste(
          selectedCell,
          clipboardText,
          pasteByColumnId ? copyBufferRef.current : null,
        );

        if (clipboardText && result.totalChanges > 0) {
          const highlightRowIds = Array.from(
            new Set(result.changes.map((change) => change.rowId)),
          );
          const highlightColumnIds = Array.from(
            new Set(result.changes.map((change) => change.columnId)),
          );

          if (fadeTimerRef.current) {
            clearTimeout(fadeTimerRef.current);
          }
          setPasteHighlight({
            rowIds: highlightRowIds,
            columnIds: highlightColumnIds,
            phase: "active",
          });
        }

        if (onPasteComplete && result.totalChanges > 0) {
          onPasteComplete(result);
        }
      };
      document.addEventListener("paste", pasteHandler);
      return () => document.removeEventListener("paste", pasteHandler);
    }
    return undefined;
  }, [
    allowPaste,
    onPasteComplete,
    paste,
    pasteByColumnId,
    selectedCell,
    selectedRange,
    selectedRangeColumnIds,
    selectedRangeRowIds,
  ]);

  const virtualRows = rowVirtualizer.getVirtualItems();
  const virtualColumns = columnVirtualizer.getVirtualItems();
  const totalColumnsWidth = columnVirtualizer.getTotalSize();
  const leftColPad = virtualColumns[0]?.start ?? 0;
  const rightColPad =
    totalColumnsWidth - (virtualColumns[virtualColumns.length - 1]?.end ?? 0);

  const registerRowScroller = useCallback((scroller: GigatableRowScroller) => {
    rowScrollerRef.current = scroller;
    return () => {
      if (rowScrollerRef.current === scroller) {
        rowScrollerRef.current = null;
      }
    };
  }, []);

  const getCellState = useCallback(
    (cell: Cell<TData, unknown>): GigatableCellState => {
      const pasteStyle = computePasteCellStyle(
        cell.row.id,
        cell.column.id,
        pasteHighlight,
      );
      const previewValue = fillPreviewValue;
      return {
        isSelected: isCellSelected(cell.row.id, cell.column.id),
        isInRange: isCellWithinSelection(
          cell.row.id,
          cell.column.id,
          selectedRange,
          selectedRangeRowIds,
          selectedRangeColumnIds,
        ),
        isEditable: isColumnEditable(cell.column.id),
        isFillAnchor: isAnchorCell(cell.row.id, cell.column.id),
        isFillRange: isFillRangeCell(cell.row.id, cell.column.id),
        isFillSource: isFillSourceCell(cell.row.id, cell.column.id),
        fillPreviewValue:
          previewValue === undefined
            ? undefined
            : (cell.column.columnDef.meta?.formatFillPreview?.(
                previewValue,
                cell,
              ) ?? previewValue),
        fillHandleMouseDown,
        ...pasteStyle,
        cellRef: getCellRef(cell.row.id, cell.column.id),
      };
    },
    [
      fillHandleMouseDown,
      fillPreviewValue,
      getCellRef,
      isAnchorCell,
      isCellSelected,
      isColumnEditable,
      isFillRangeCell,
      isFillSourceCell,
      pasteHighlight,
      selectedRange,
      selectedRangeColumnIds,
      selectedRangeRowIds,
    ],
  );

  const contextValue = useMemo<GigatableContextValue<TData>>(
    () => ({
      table,
      rows,
      leafColumns,
      scrollContainerRef: tableContainerRef,
      selectedCell,
      selection: selectedRange,
      allColumnsEditable,
      allowColumnResizing,
      tableStyle,
      features: {
        cellSelection: allowCellSelection,
        rangeSelection: isRangeSelectionEnabled,
        quickEdit: allowQuickEdit,
        history: allowHistory,
        paste: allowPaste,
        fillHandle: allowFillHandle,
        fillDirection,
        columnResizing: allowColumnResizing,
        clearing: allowCellSelection,
      },
      getCellState,
      registerRowScroller,
    }),
    [
      allColumnsEditable,
      allowCellSelection,
      allowColumnResizing,
      allowFillHandle,
      allowHistory,
      allowPaste,
      allowQuickEdit,
      fillDirection,
      getCellState,
      isRangeSelectionEnabled,
      leafColumns,
      registerRowScroller,
      rows,
      selectedCell,
      selectedRange,
      table,
      tableContainerRef,
      tableStyle,
    ],
  );

  return (
    <>
      <style href="gigatable" precedence="default">{`
        td.is-in-range { background-color: var(--gt-range-bg); }
        td.is-fill-range { background-color: var(--gt-fill-preview-bg); }
        .gt-column-resizer {
          position: absolute;
          top: 0;
          z-index: 20;
          width: 5px;
          height: 100%;
          background: var(--gt-header-border-color);
          cursor: col-resize;
          touch-action: none;
          user-select: none;
        }
        .gt-column-resizer-ltr { right: -2.5px; }
        .gt-column-resizer-rtl { left: -2.5px; }
        .gt-column-resizer.is-resizing {
          background: var(--gt-selection-outline);
          opacity: 1;
        }
        @media (hover: hover) {
          .gt-column-resizer { opacity: 0; }
          th:hover > .gt-column-resizer,
          .gt-column-resizer.is-resizing { opacity: 1; }
        }
      `}</style>
      <GigatableContextProvider
        value={contextValue as GigatableContextValue<unknown>}
      >
        <QuickEditProvider value={allowQuickEdit}>
          <div
            className={clsx(
              "box-border border border-(--gt-cell-border-color) rounded-(--border-md)",
              {
                "select-none":
                  isRangeSelectionEnabled ||
                  !!columnSizingInfo.isResizingColumn,
              },
            )}
            style={{ ...resolvedTheme, backgroundColor: "var(--gt-row-bg)" }}
            onKeyDown={handleContainerKeyDown}
            onClick={handleBodyClick}
            onMouseDown={handleBodyMouseDown}
            onMouseOver={handleBodyMouseOver}
          >
            <div
              ref={tableContainerRef}
              className="overflow-auto outline-none"
              style={{ height: "var(--gt-table-height, 90vh)" }}
              tabIndex={-1}
            >
              {children ?? (
                <Table style={{ width: `${totalColumnsWidth}px` }}>
                  <Table.Header>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <Table.Row key={headerGroup.id}>
                        <th
                          className="bg-(--gt-header-bg) border-r"
                          style={{
                            width: `${leftColPad}px`,
                            padding: 0,
                            borderRightColor: "var(--gt-header-border-color)",
                          }}
                        />
                        {virtualColumns.map((vc) => {
                          const header = headerGroup.headers[vc.index];
                          const canResize = shouldRenderColumnResizer(
                            allowColumnResizing,
                            !header.isPlaceholder &&
                              header.column.getCanResize(),
                          );
                          return (
                            <Table.Head
                              key={header.id}
                              style={{ width: `${vc.size}px` }}
                              className={clsx({ relative: canResize })}
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                  )}
                              {canResize ? (
                                <span
                                  aria-hidden="true"
                                  data-gigatable-column-resizer
                                  className={getColumnResizerClassName(
                                    table.options.columnResizeDirection,
                                    header.column.getIsResizing(),
                                  )}
                                  onDoubleClick={(event) => {
                                    event.stopPropagation();
                                    header.column.resetSize();
                                  }}
                                  onMouseDown={(event) => {
                                    event.stopPropagation();
                                    header.getResizeHandler()(event);
                                  }}
                                  onTouchStart={(event) => {
                                    event.stopPropagation();
                                    header.getResizeHandler()(event);
                                  }}
                                />
                              ) : null}
                            </Table.Head>
                          );
                        })}
                        <th
                          className="bg-(--gt-header-bg)"
                          style={{ width: `${rightColPad}px`, padding: 0 }}
                        />
                      </Table.Row>
                    ))}
                  </Table.Header>
                  <Table.Body>
                    {rows.length > 0 ? (
                      <>
                        <tr
                          style={{ height: `${virtualRows[0]?.start ?? 0}px` }}
                        />
                        {virtualRows.map((virtualRow) => {
                          const row = rows[virtualRow.index];
                          const visibleCells = row.getVisibleCells();
                          return (
                            <Table.Row
                              key={row.id}
                              data-state={row.getIsSelected() && "selected"}
                              style={{ height: `${virtualRow.size}px` }}
                            >
                              <td
                                style={{ width: `${leftColPad}px`, padding: 0 }}
                              />
                              {virtualColumns.map((vc) => {
                                const cell = visibleCells[vc.index];
                                const {
                                  pasteBackground,
                                  pasteShadow,
                                  pasteTransition,
                                } = computePasteCellStyle(
                                  cell.row.id,
                                  cell.column.id,
                                  pasteHighlight,
                                );
                                return (
                                  <TableCell
                                    key={cell.id}
                                    cell={cell}
                                    cellRef={getCellRef(
                                      cell.row.id,
                                      cell.column.id,
                                    )}
                                    isSelected={isCellSelected(
                                      cell.row.id,
                                      cell.column.id,
                                    )}
                                    isInRange={isCellWithinSelection(
                                      cell.row.id,
                                      cell.column.id,
                                      selectedRange,
                                      selectedRangeRowIds,
                                      selectedRangeColumnIds,
                                    )}
                                    isEditable={
                                      allColumnsEditable ||
                                      (cell.column.columnDef.meta?.editable ??
                                        false)
                                    }
                                    isFillAnchor={isAnchorCell(
                                      cell.row.id,
                                      cell.column.id,
                                    )}
                                    isFillRange={isFillRangeCell(
                                      cell.row.id,
                                      cell.column.id,
                                    )}
                                    isFillSource={isFillSourceCell(
                                      cell.row.id,
                                      cell.column.id,
                                    )}
                                    fillPreviewValue={
                                      fillPreviewValue === undefined
                                        ? undefined
                                        : (cell.column.columnDef.meta?.formatFillPreview?.(
                                            fillPreviewValue,
                                            cell,
                                          ) ?? fillPreviewValue)
                                    }
                                    fillHandleMouseDown={fillHandleMouseDown}
                                    pasteBackground={pasteBackground}
                                    pasteShadow={pasteShadow}
                                    pasteTransition={pasteTransition}
                                    allColumnsEditable={allColumnsEditable}
                                  />
                                );
                              })}
                              <td
                                style={{
                                  width: `${rightColPad}px`,
                                  padding: 0,
                                }}
                              />
                            </Table.Row>
                          );
                        })}
                        <tr
                          style={{
                            height: `${
                              rowVirtualizer.getTotalSize() -
                              (virtualRows[virtualRows.length - 1]?.end ?? 0)
                            }px`,
                          }}
                        />
                      </>
                    ) : (
                      <tr>
                        <td
                          colSpan={leafColumns.length}
                          className="h-24 text-center align-middle border-r border-(--gt-cell-border-color)"
                        >
                          No data.
                        </td>
                      </tr>
                    )}
                  </Table.Body>
                </Table>
              )}
            </div>
          </div>
        </QuickEditProvider>
      </GigatableContextProvider>
    </>
  );
}

export const Gigatable = Object.assign(GigatableRoot, {
  Table: GigatableTable,
  Header: GigatableHeader,
  Body: GigatableBody,
  Footer: GigatableFooter,
  Cell: GigatableCell,
  FeatureGuide: GigatableFeatureGuide,
});
