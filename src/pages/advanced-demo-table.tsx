import {
  flexRender,
  getSortedRowModel,
  type ColumnPinningState,
  type ColumnSizingState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { columns } from "../columns";
import {
  Gigatable,
  themes,
  useGigatable,
  useGigatableContext,
} from "../gigatable";
import { strains, type Strain } from "../strains";
import { Table } from "../gigatable/table";

const COLUMN_SIZING_KEY = "gigatable-advanced-column-sizing";

function getPinnedStyle(
  column: ReturnType<
    ReturnType<typeof useGigatableContext<Strain>>["table"]["getColumn"]
  >,
): CSSProperties {
  if (!column) {
    return {};
  }
  const pinned = column.getIsPinned();
  return {
    position: pinned ? "sticky" : "relative",
    left: pinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: pinned === "right" ? `${column.getAfter("right")}px` : undefined,
    zIndex: pinned ? 12 : undefined,
    background: pinned ? "var(--gt-row-bg)" : undefined,
  };
}

function AdvancedHeader() {
  const { table } = useGigatableContext<Strain>();
  return (
    <Gigatable.Header className="sticky top-0 z-20">
      {table.getHeaderGroups().map((headerGroup) => (
        <Table.Row key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <Table.Head
              key={header.id}
              className="relative"
              style={{
                width: `${header.getSize()}px`,
                ...getPinnedStyle(header.column),
                background: "var(--gt-header-bg)",
              }}
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 text-left"
                onClick={header.column.getToggleSortingHandler()}
                disabled={!header.column.getCanSort()}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                {header.column.getIsSorted() === "asc"
                  ? "↑"
                  : header.column.getIsSorted() === "desc"
                    ? "↓"
                    : null}
              </button>
              {header.column.getCanResize() ? (
                <span
                  aria-hidden="true"
                  data-gigatable-column-resizer
                  className="gt-column-resizer gt-column-resizer-ltr"
                  onMouseDown={(event) => {
                    event.stopPropagation();
                    header.getResizeHandler()(event);
                  }}
                  onTouchStart={(event) => {
                    event.stopPropagation();
                    header.getResizeHandler()(event);
                  }}
                  onDoubleClick={(event) => {
                    event.stopPropagation();
                    header.column.resetSize();
                  }}
                />
              ) : null}
            </Table.Head>
          ))}
        </Table.Row>
      ))}
    </Gigatable.Header>
  );
}

function AdvancedBody({
  onMove,
}: {
  onMove: (sourceId: string, targetId: string) => void;
}) {
  const { rows, scrollContainerRef, registerRowScroller } =
    useGigatableContext<Strain>();
  const draggingRowId = useRef<string | null>(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 30,
    overscan: 6,
  });

  useEffect(
    () =>
      registerRowScroller((rowIndex, behavior, align) => {
        virtualizer.scrollToIndex(rowIndex, { behavior, align });
      }),
    [registerRowScroller, virtualizer],
  );

  const virtualRows = virtualizer.getVirtualItems();
  return (
    <Gigatable.Body>
      <tr style={{ height: virtualRows[0]?.start ?? 0 }} />
      {virtualRows.map((virtualRow) => {
        const row = rows[virtualRow.index];
        return (
          <Table.Row
            key={row.id}
            draggable
            style={{ height: virtualRow.size }}
            onDragStart={() => {
              draggingRowId.current = row.id;
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (draggingRowId.current && draggingRowId.current !== row.id) {
                onMove(draggingRowId.current, row.id);
              }
              draggingRowId.current = null;
            }}
            title="Drag to reorder this row"
          >
            {row.getVisibleCells().map((cell) => (
              <Gigatable.Cell
                key={cell.id}
                cell={cell}
                style={getPinnedStyle(cell.column)}
              />
            ))}
          </Table.Row>
        );
      })}
      <tr
        style={{
          height:
            virtualizer.getTotalSize() -
            (virtualRows[virtualRows.length - 1]?.end ?? 0),
        }}
      />
    </Gigatable.Body>
  );
}

export function AdvancedDemoTable() {
  const [data, setData] = useState(() => strains.slice(0, 300));
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ["id", "name"],
  });
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(() => {
    try {
      return JSON.parse(localStorage.getItem(COLUMN_SIZING_KEY) ?? "{}");
    } catch {
      return {};
    }
  });
  const guideRef = useRef<HTMLDialogElement>(null);
  const guideTriggerRef = useRef<HTMLButtonElement>(null);
  const advancedColumns = useMemo(() => columns.slice(0, 14), []);
  const { table, paste, applyFill, applyHorizontalFill, undo, redo } =
    useGigatable({
      columns: advancedColumns,
      data,
      history: true,
      getSortedRowModel: getSortedRowModel(),
      enableSorting: true,
      enableColumnPinning: true,
      enableColumnResizing: true,
      columnResizeMode: "onChange",
      state: { sorting, columnVisibility, columnPinning, columnSizing },
      onSortingChange: setSorting,
      onColumnVisibilityChange: setColumnVisibility,
      onColumnPinningChange: setColumnPinning,
      onColumnSizingChange: (updater) => {
        setColumnSizing((current) => {
          const next =
            typeof updater === "function" ? updater(current) : updater;
          localStorage.setItem(COLUMN_SIZING_KEY, JSON.stringify(next));
          return next;
        });
      },
    });

  const moveRow = (sourceId: string, targetId: string) => {
    setData((current) => {
      const sourceIndex = current.findIndex(
        (_, index) => String(index) === sourceId,
      );
      const targetIndex = current.findIndex(
        (_, index) => String(index) === targetId,
      );
      if (sourceIndex < 0 || targetIndex < 0) {
        return current;
      }
      const next = [...current];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          ref={guideTriggerRef}
          type="button"
          className="rounded border bg-white px-3 py-1.5 text-xs font-semibold"
          onClick={() => guideRef.current?.showModal()}
        >
          Interaction guide
        </button>
        {table.getAllLeafColumns().map((column) => (
          <label
            key={column.id}
            className="flex items-center gap-1 rounded border bg-white px-2 py-1 text-xs"
          >
            <input
              type="checkbox"
              checked={column.getIsVisible()}
              onChange={column.getToggleVisibilityHandler()}
            />
            {column.id}
          </label>
        ))}
      </div>
      <div style={{ "--gt-table-height": "65vh" } as CSSProperties}>
        <Gigatable
          theme={themes.light}
          table={table}
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
          tableStyle={{ width: `${table.getTotalSize()}px` }}
        >
          <Gigatable.Table>
            <AdvancedHeader />
            <AdvancedBody onMove={moveRow} />
            <Gigatable.Footer className="sticky bottom-0 z-20 bg-white">
              <Table.Row>
                <td
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-8 px-3 text-xs font-medium"
                >
                  {table.getRowModel().rows.length} rows · drag rows to reorder
                </td>
              </Table.Row>
            </Gigatable.Footer>
          </Gigatable.Table>
          <dialog
            ref={guideRef}
            className="demo-interaction-dialog"
            aria-labelledby="demo-interaction-title"
            onClose={() => guideTriggerRef.current?.focus()}
            onCancel={(event) => {
              event.preventDefault();
              event.currentTarget.close();
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                event.currentTarget.close();
              }
            }}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                event.currentTarget.close();
              }
            }}
          >
            <div className="demo-interaction-panel">
              <header>
                <div>
                  <span>Keyboard & pointer guide</span>
                  <h2 id="demo-interaction-title">Table Interactions</h2>
                </div>
                <button type="button" onClick={() => guideRef.current?.close()}>
                  Close
                </button>
              </header>
              <p>
                Use these shortcuts to explore the enabled spreadsheet
                behaviors.
              </p>
              <Gigatable.FeatureGuide className="demo-interaction-list" />
            </div>
          </dialog>
        </Gigatable>
      </div>
    </div>
  );
}
