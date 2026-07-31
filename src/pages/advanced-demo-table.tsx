import {
  flexRender,
  getSortedRowModel,
  type CellContext,
  type Column,
  type ColumnDef,
  type ColumnPinningState,
  type ColumnSizingState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  Gigatable,
  themes,
  useGigatable,
  useGigatableContext,
} from "../gigatable";
import {
  BadgeCell,
  DateCell,
  NumberCell,
  ProgressCell,
  SelectCell,
  type CellOption,
  type CellTone,
} from "../gigatable/cells";
import { Table } from "../gigatable/table";
import { useSiteTheme } from "../site/theme";
import {
  parseDemoDate,
  parseDemoNumber,
  parseDemoOption,
} from "./demo-editor-utils";

type ProductionStage =
  | "Queued"
  | "Setup"
  | "Running"
  | "Quality check"
  | "Complete";

interface WorkOrder extends Record<string, unknown> {
  workOrderId: string;
  product: string;
  line: string;
  stage: ProductionStage;
  quantity: number;
  startDate: string;
  dueDate: string;
  owner: string;
  expectedYield: number;
  priority: "Routine" | "Expedite" | "Critical";
  progress: number;
}

const PRODUCTS = [
  "Sterile tubing set",
  "Diagnostic cartridge",
  "Infusion pump housing",
  "Surgical tray",
  "Respirator filter",
  "Glucose sensor",
  "Sample collection kit",
  "Catheter assembly",
];
const OWNERS = [
  "Maya Patel",
  "Luka Novak",
  "Elena Rossi",
  "Jon Bell",
  "Amara Okafor",
  "Sofia Kim",
];
const STAGES: ProductionStage[] = [
  "Queued",
  "Setup",
  "Running",
  "Quality check",
  "Complete",
];
const LINES = Array.from(
  { length: 6 },
  (_, index) => `Line ${String.fromCharCode(65 + index)}`,
);
const PRIORITIES: WorkOrder["priority"][] = ["Routine", "Expedite", "Critical"];
const productOptions: ReadonlyArray<CellOption<string>> = PRODUCTS.map(
  (value) => ({ value, label: value }),
);
const stageOptions: ReadonlyArray<CellOption<ProductionStage>> = STAGES.map(
  (value) => ({ value, label: value }),
);
const lineOptions: ReadonlyArray<CellOption<string>> = LINES.map((value) => ({
  value,
  label: value,
}));
const ownerOptions: ReadonlyArray<CellOption<string>> = OWNERS.map((value) => ({
  value,
  label: value,
}));
const priorityOptions: ReadonlyArray<CellOption<WorkOrder["priority"]>> =
  PRIORITIES.map((value) => ({ value, label: value }));

const stageTone: Record<ProductionStage, CellTone> = {
  Queued: "neutral",
  Setup: "warning",
  Running: "info",
  "Quality check": "info",
  Complete: "success",
};

const priorityTone: Record<WorkOrder["priority"], CellTone> = {
  Routine: "neutral",
  Expedite: "warning",
  Critical: "danger",
};

export const PRODUCTION_REORDER_COLUMN_ID = "rowOrder";
const PRODUCTION_REORDER_COLUMN_WIDTH = 34;

export function buildProductionWorkOrders(count = 300): WorkOrder[] {
  return Array.from({ length: count }, (_, index) => {
    const stage = STAGES[index % STAGES.length];
    const startDay = 1 + (index % 24);
    const dueDay = Math.min(28, startDay + 3 + (index % 5));
    const priority =
      index % 17 === 0 ? "Critical" : index % 6 === 0 ? "Expedite" : "Routine";

    return {
      workOrderId: `WO-26-${String(index + 1).padStart(4, "0")}`,
      product: PRODUCTS[index % PRODUCTS.length],
      line: `Line ${String.fromCharCode(65 + (index % 6))}`,
      stage,
      quantity: 400 + ((index * 137) % 4_600),
      startDate: `2026-08-${String(startDay).padStart(2, "0")}`,
      dueDate: `2026-08-${String(dueDay).padStart(2, "0")}`,
      owner: OWNERS[index % OWNERS.length],
      expectedYield: 91 + ((index * 7) % 86) / 10,
      priority,
      progress:
        stage === "Complete"
          ? 100
          : stage === "Quality check"
            ? 82
            : stage === "Running"
              ? 38 + (index % 42)
              : stage === "Setup"
                ? 14
                : 0,
    };
  });
}

export const productionColumns: ColumnDef<WorkOrder>[] = [
  {
    id: PRODUCTION_REORDER_COLUMN_ID,
    header: "Reorder rows",
    size: PRODUCTION_REORDER_COLUMN_WIDTH,
    minSize: PRODUCTION_REORDER_COLUMN_WIDTH,
    maxSize: PRODUCTION_REORDER_COLUMN_WIDTH,
    enableHiding: false,
    enableResizing: false,
    enableSorting: false,
    cell: () => null,
  },
  {
    accessorKey: "workOrderId",
    header: "Work order",
    size: 150,
  },
  {
    accessorKey: "product",
    header: "Product",
    size: 210,
    cell: (cell) => (
      <SelectCell
        {...(cell as CellContext<WorkOrder, string>)}
        options={productOptions}
        ariaLabel={`Product for ${cell.row.original.workOrderId}`}
      />
    ),
    meta: {
      editable: true,
      getClearedValue: () => productOptions[0].value,
      parsePastedValue: (value, cell) =>
        parseDemoOption(value, productOptions, cell.getValue<string>()),
    },
  },
  {
    accessorKey: "line",
    header: "Line",
    size: 100,
    cell: (cell) => (
      <SelectCell
        {...(cell as CellContext<WorkOrder, string>)}
        options={lineOptions}
        ariaLabel={`Production line for ${cell.row.original.workOrderId}`}
      />
    ),
    meta: {
      editable: true,
      getClearedValue: () => "Line A",
      parsePastedValue: (value, cell) =>
        parseDemoOption(value, lineOptions, cell.getValue<string>()),
    },
  },
  {
    accessorKey: "stage",
    header: "Stage",
    size: 150,
    cell: (cell) => (
      <SelectCell
        {...(cell as CellContext<WorkOrder, ProductionStage>)}
        options={stageOptions}
        ariaLabel={`Stage for ${cell.row.original.workOrderId}`}
        renderOption={(_option, value) => (
          <BadgeCell label={value} tone={stageTone[value]} />
        )}
      />
    ),
    meta: {
      editable: true,
      getClearedValue: () => "Queued",
      parsePastedValue: (value, cell) =>
        parseDemoOption(value, stageOptions, cell.getValue<ProductionStage>()),
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    size: 120,
    cell: (cell) => (
      <NumberCell
        {...(cell as CellContext<WorkOrder, number>)}
        ariaLabel={`Quantity for ${cell.row.original.workOrderId}`}
        min={1}
        max={50_000}
        step={1}
        renderValue={(value) => value.toLocaleString()}
      />
    ),
    meta: {
      editable: true,
      getClearedValue: () => 1,
      parsePastedValue: (value, cell) =>
        parseDemoNumber(value, cell.getValue<number>(), 1, 50_000),
    },
  },
  {
    accessorKey: "startDate",
    header: "Start",
    size: 120,
    cell: (cell) => (
      <DateCell
        {...(cell as CellContext<WorkOrder, string>)}
        ariaLabel={`Start date for ${cell.row.original.workOrderId}`}
        min="2026-07-01"
        max="2026-12-31"
      />
    ),
    meta: {
      editable: true,
      getClearedValue: () => "",
      parsePastedValue: (value, cell) =>
        parseDemoDate(
          value,
          cell.getValue<string>(),
          "2026-07-01",
          "2026-12-31",
        ),
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due",
    size: 120,
    cell: (cell) => (
      <DateCell
        {...(cell as CellContext<WorkOrder, string>)}
        ariaLabel={`Due date for ${cell.row.original.workOrderId}`}
        min="2026-07-01"
        max="2026-12-31"
      />
    ),
    meta: {
      editable: true,
      getClearedValue: () => "",
      parsePastedValue: (value, cell) =>
        parseDemoDate(
          value,
          cell.getValue<string>(),
          "2026-07-01",
          "2026-12-31",
        ),
    },
  },
  {
    accessorKey: "owner",
    header: "Owner",
    size: 150,
    cell: (cell) => (
      <SelectCell
        {...(cell as CellContext<WorkOrder, string>)}
        options={ownerOptions}
        ariaLabel={`Owner for ${cell.row.original.workOrderId}`}
      />
    ),
    meta: {
      editable: true,
      getClearedValue: () => OWNERS[0],
      parsePastedValue: (value, cell) =>
        parseDemoOption(value, ownerOptions, cell.getValue<string>()),
    },
  },
  {
    accessorKey: "expectedYield",
    header: "Expected yield",
    size: 180,
    cell: (cell) => (
      <NumberCell
        {...(cell as CellContext<WorkOrder, number>)}
        ariaLabel={`Expected yield for ${cell.row.original.workOrderId}`}
        min={0}
        max={100}
        step={0.1}
        variant="range"
        suffix="%"
        tone={(value) =>
          value >= 96 ? "success" : value >= 93 ? "warning" : "danger"
        }
        renderValue={(value) => (
          <ProgressCell
            value={value}
            max={100}
            label={`${value.toFixed(1)}% expected yield`}
            tone={value >= 96 ? "success" : value >= 93 ? "warning" : "danger"}
            formatValue={(current) => `${current.toFixed(1)}%`}
          />
        )}
      />
    ),
    meta: {
      editable: true,
      getClearedValue: () => 0,
      parsePastedValue: (value, cell) =>
        parseDemoNumber(value, cell.getValue<number>(), 0, 100),
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    size: 120,
    cell: (cell) => (
      <SelectCell
        {...(cell as CellContext<WorkOrder, WorkOrder["priority"]>)}
        options={priorityOptions}
        ariaLabel={`Priority for ${cell.row.original.workOrderId}`}
        renderOption={(_option, value) => (
          <BadgeCell label={value} tone={priorityTone[value]} />
        )}
      />
    ),
    meta: {
      editable: true,
      getClearedValue: () => "Routine",
      parsePastedValue: (value, cell) =>
        parseDemoOption(
          value,
          priorityOptions,
          cell.getValue<WorkOrder["priority"]>(),
        ),
    },
  },
  {
    accessorKey: "progress",
    header: "Progress",
    size: 180,
    cell: (cell) => (
      <NumberCell
        {...(cell as CellContext<WorkOrder, number>)}
        ariaLabel={`Progress for ${cell.row.original.workOrderId}`}
        min={0}
        max={100}
        step={1}
        variant="range"
        suffix="%"
        tone={(value) =>
          value === 100 ? "success" : value > 0 ? "info" : "neutral"
        }
        renderValue={(value) => (
          <ProgressCell
            value={value}
            label={`${value}% complete`}
            tone={value === 100 ? "success" : value > 0 ? "info" : "neutral"}
          />
        )}
      />
    ),
    meta: {
      editable: true,
      getClearedValue: () => 0,
      parsePastedValue: (value, cell) =>
        parseDemoNumber(value, cell.getValue<number>(), 0, 100),
    },
  },
];

function getPinnedStyles(column: Column<WorkOrder>): CSSProperties {
  const pinned = column.getIsPinned();
  return {
    left: pinned === "left" ? `${column.getStart("left")}px` : undefined,
    position: pinned ? "sticky" : "relative",
    zIndex: pinned ? 2 : 0,
  };
}

function ProductionHeader() {
  const { table } = useGigatableContext<WorkOrder>();

  return (
    <Gigatable.Header className="sticky top-0 z-20">
      {table.getHeaderGroups().map((headerGroup) => (
        <Table.Row key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const canSort = header.column.getCanSort();
            const sorted = header.column.getIsSorted();
            const isReorderColumn =
              header.column.id === PRODUCTION_REORDER_COLUMN_ID;
            return (
              <Table.Head
                key={header.id}
                colSpan={header.colSpan}
                style={{
                  width: header.getSize(),
                  ...getPinnedStyles(header.column),
                  background: "var(--gt-header-bg)",
                }}
                className={header.column.getIsPinned() ? "gt-pinned-cell" : ""}
              >
                {isReorderColumn ? (
                  <span className="sr-only">Reorder rows</span>
                ) : (
                  <button
                    type="button"
                    className="demo-sort-button"
                    disabled={!canSort}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    {sorted === "asc" ? " ↑" : sorted === "desc" ? " ↓" : ""}
                  </button>
                )}
                {!isReorderColumn && header.column.getCanResize() ? (
                  <button
                    type="button"
                    aria-label={`Resize ${String(header.column.columnDef.header)} column`}
                    className={`gt-column-resizer gt-column-resizer-${
                      table.options.columnResizeDirection ?? "ltr"
                    } ${header.column.getIsResizing() ? "is-resizing" : ""}`}
                    onDoubleClick={() => header.column.resetSize()}
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                  />
                ) : null}
              </Table.Head>
            );
          })}
        </Table.Row>
      ))}
    </Gigatable.Header>
  );
}

interface ProductionBodyProps {
  onMove: (draggedId: string, targetId: string) => void;
}

const PRODUCTION_ROW_HEIGHT = 34;
const PRODUCTION_OVERSCAN = 6;

export function getProductionVirtualRange(
  scrollTop: number,
  viewportHeight: number,
  rowCount: number,
) {
  if (rowCount <= 0) return { start: 0, end: 0 };

  const visibleStart = Math.min(
    rowCount - 1,
    Math.floor(Math.max(0, scrollTop) / PRODUCTION_ROW_HEIGHT),
  );
  const visibleCount = Math.max(
    1,
    Math.ceil(Math.max(0, viewportHeight) / PRODUCTION_ROW_HEIGHT),
  );

  return {
    start: Math.max(0, visibleStart - PRODUCTION_OVERSCAN),
    end: Math.min(rowCount, visibleStart + visibleCount + PRODUCTION_OVERSCAN),
  };
}

function ProductionBody({ onMove }: ProductionBodyProps) {
  const { rows, scrollContainerRef, registerRowScroller } =
    useGigatableContext<WorkOrder>();
  const [range, setRange] = useState({
    start: 0,
    end: Math.min(rows.length, 24),
  });
  const draggedId = useRef<string | null>(null);

  useEffect(() => {
    const scroller = scrollContainerRef.current;
    if (!scroller) return undefined;
    const updateRange = () => {
      setRange(
        getProductionVirtualRange(
          scroller.scrollTop,
          scroller.clientHeight,
          rows.length,
        ),
      );
    };
    const unregisterScroller = registerRowScroller(
      (rowIndex, behavior, align) => {
        const viewportRows = Math.floor(
          scroller.clientHeight / PRODUCTION_ROW_HEIGHT,
        );
        const alignedIndex =
          align === "end" ? Math.max(0, rowIndex - viewportRows + 1) : rowIndex;
        scroller.scrollTo({
          top: alignedIndex * PRODUCTION_ROW_HEIGHT,
          behavior,
        });
      },
    );
    const resizeObserver = new ResizeObserver(updateRange);
    updateRange();
    resizeObserver.observe(scroller);
    scroller.addEventListener("scroll", updateRange, { passive: true });
    return () => {
      unregisterScroller();
      resizeObserver.disconnect();
      scroller.removeEventListener("scroll", updateRange);
    };
  }, [registerRowScroller, rows.length, scrollContainerRef]);

  const visibleRows = rows.slice(range.start, range.end);
  return (
    <Gigatable.Body>
      <tr style={{ height: range.start * PRODUCTION_ROW_HEIGHT }} />
      {visibleRows.map((row) => {
        return (
          <Table.Row
            key={row.id}
            onDragOver={(event: DragEvent<HTMLTableRowElement>) => {
              if (!draggedId.current) return;
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
            }}
            onDrop={(event: DragEvent<HTMLTableRowElement>) => {
              event.preventDefault();
              if (draggedId.current && draggedId.current !== row.id) {
                onMove(draggedId.current, row.id);
              }
              draggedId.current = null;
            }}
            onDragEnd={() => {
              draggedId.current = null;
            }}
            style={{ height: PRODUCTION_ROW_HEIGHT }}
          >
            {row.getVisibleCells().map((cell) => {
              const style = {
                width: cell.column.getSize(),
                ...getPinnedStyles(cell.column),
              };
              const className = cell.column.getIsPinned()
                ? "gt-pinned-cell"
                : undefined;

              if (cell.column.id === PRODUCTION_REORDER_COLUMN_ID) {
                const stopCellSelection = (
                  event: ReactMouseEvent<HTMLButtonElement>,
                ) => event.stopPropagation();
                const stopPointerSelection = (
                  event: ReactPointerEvent<HTMLButtonElement>,
                ) => event.stopPropagation();

                return (
                  <Gigatable.Cell
                    key={cell.id}
                    cell={cell}
                    style={style}
                    className={`${className ?? ""} demo-row-reorder-cell`}
                  >
                    <button
                      type="button"
                      draggable
                      className="demo-row-reorder-handle"
                      aria-label={`Drag to reorder ${row.original.workOrderId}`}
                      title="Drag to reorder"
                      onPointerDown={stopPointerSelection}
                      onMouseDown={stopCellSelection}
                      onClick={stopCellSelection}
                      onDoubleClick={stopCellSelection}
                      onDragStart={(event) => {
                        event.stopPropagation();
                        draggedId.current = row.id;
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", row.id);
                      }}
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        width="16"
                        height="16"
                      >
                        <circle cx="5" cy="3" r="1.25" />
                        <circle cx="11" cy="3" r="1.25" />
                        <circle cx="5" cy="8" r="1.25" />
                        <circle cx="11" cy="8" r="1.25" />
                        <circle cx="5" cy="13" r="1.25" />
                        <circle cx="11" cy="13" r="1.25" />
                      </svg>
                    </button>
                  </Gigatable.Cell>
                );
              }

              return (
                <Gigatable.Cell
                  key={cell.id}
                  cell={cell}
                  style={style}
                  className={className}
                />
              );
            })}
          </Table.Row>
        );
      })}
      <tr
        style={{
          height: Math.max(
            0,
            (rows.length - range.end) * PRODUCTION_ROW_HEIGHT,
          ),
        }}
      />
    </Gigatable.Body>
  );
}

export function ProductionScheduleDemo() {
  const { resolvedTheme } = useSiteTheme();
  const [data, setData] = useState(() => buildProductionWorkOrders());
  const [isColumnManagerOpen, setIsColumnManagerOpen] = useState(false);
  const columnManagerRef = useRef<HTMLDetailsElement>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: [PRODUCTION_REORDER_COLUMN_ID, "workOrderId", "product"],
  });
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(
        window.localStorage.getItem("gigatable-production-column-sizing") ??
          "{}",
      ) as ColumnSizingState;
    } catch {
      return {};
    }
  });

  const columns = useMemo(() => productionColumns, []);
  const {
    table,
    paste,
    applyFill,
    applyHorizontalFill,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useGigatable({
    data,
    columns,
    getRowId: (row) => row.workOrderId,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnVisibility,
      columnPinning,
      columnSizing,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onColumnSizingChange: (updater) => {
      setColumnSizing((current) => {
        const next = typeof updater === "function" ? updater(current) : updater;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            "gigatable-production-column-sizing",
            JSON.stringify(next),
          );
        }
        return next;
      });
    },
    columnResizeMode: "onChange",
    enableColumnResizing: true,
    history: true,
  });

  const moveOrder = useCallback(
    (draggedId: string, targetId: string) => {
      const current = table.options.data;
      const from = current.findIndex((item) => item.workOrderId === draggedId);
      const to = current.findIndex((item) => item.workOrderId === targetId);
      if (from < 0 || to < 0) return;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      setData(next);
    },
    [table],
  );

  const visibleOrders = table.getRowModel().rows;
  const visibleQuantity = visibleOrders.reduce(
    (total, row) => total + row.original.quantity,
    0,
  );
  const hideableColumns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide());

  useEffect(() => {
    if (!isColumnManagerOpen) return;

    const closeColumnManager = () => setIsColumnManagerOpen(false);
    const handlePointerDown = (event: PointerEvent) => {
      const manager = columnManagerRef.current;
      if (manager && !manager.contains(event.target as Node)) {
        closeColumnManager();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeColumnManager();
      columnManagerRef.current?.querySelector<HTMLElement>("summary")?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isColumnManagerOpen]);

  return (
    <div className="demo-scenario-stack">
      <div className="demo-column-toolbar">
        <details
          ref={columnManagerRef}
          className="demo-column-manager"
          open={isColumnManagerOpen}
          onToggle={(event) => setIsColumnManagerOpen(event.currentTarget.open)}
        >
          <summary>
            Manage columns
            <span>
              {table.getVisibleLeafColumns().length}/
              {table.getAllLeafColumns().length}
            </span>
          </summary>
          <div className="demo-column-manager-panel">
            {hideableColumns.map((column) => (
              <label key={column.id}>
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />
                {String(column.columnDef.header ?? column.id)}
              </label>
            ))}
          </div>
        </details>
        <p>
          10 editable fields. Double-click, press Enter, or Alt/Option-click to
          edit; drag the leading row handle to reprioritize.
        </p>
        <div className="demo-history-actions">
          <button type="button" onClick={undo} disabled={!canUndo}>
            Undo
          </button>
          <button type="button" onClick={redo} disabled={!canRedo}>
            Redo
          </button>
        </div>
      </div>

      <div
        className="demo-table-shell"
        style={{ "--gt-table-height": "58vh" } as CSSProperties}
      >
        <Gigatable
          table={table}
          theme={resolvedTheme === "dark" ? themes.giga : themes.light}
          allowCellSelection
          allowRangeSelection
          allowQuickEdit
          allowHistory
          allowPaste
          allowFillHandle
          fillDirection="both"
          allowColumnResizing
          paste={paste}
          applyFill={applyFill}
          applyHorizontalFill={applyHorizontalFill}
          undo={undo}
          redo={redo}
          tableStyle={{ width: table.getTotalSize() }}
        >
          <Gigatable.Table>
            <ProductionHeader />
            <ProductionBody onMove={moveOrder} />
            <Gigatable.Footer className="sticky bottom-0 z-20">
              <Table.Row>
                <Table.Data
                  colSpan={table.getVisibleLeafColumns().length}
                  className="demo-production-summary"
                >
                  <div className="demo-production-summary-content">
                    <strong>
                      {visibleOrders.length} scheduled work orders
                    </strong>
                    <span>
                      {visibleQuantity.toLocaleString()} units in the current
                      schedule view
                    </span>
                  </div>
                </Table.Data>
              </Table.Row>
            </Gigatable.Footer>
          </Gigatable.Table>
        </Gigatable>
      </div>
    </div>
  );
}

export const AdvancedDemoTable = ProductionScheduleDemo;
