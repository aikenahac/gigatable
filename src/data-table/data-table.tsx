import { clsx } from "clsx";
import type { Table as TanStackTableType } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Table } from "../table";
import type { CellCoordinates } from "./use-cell-selection";
import type { PasteResult } from "./use-data-table";
import { useCellSelection } from "./use-cell-selection";
import { useCopyToClipboard } from "./use-copy-to-clipboard";
import { parseCopyData } from "./parse-copy-data";
import React, { useCallback, useEffect, useRef } from "react";

export interface DataTableProps<TData> {
  table: TanStackTableType<TData>;
  allowCellSelection?: boolean;
  allowRangeSelection?: boolean;
  allowHistory?: boolean;
  allowPaste?: boolean;
  paste?: (
    selectedCell: CellCoordinates,
    clipboardData?: string,
  ) => PasteResult;
  onPasteComplete?: (result: PasteResult) => void;
  undo?: () => void;
  redo?: () => void;
}

const TableCell = React.memo(
  ({
    cell,
    cellRef,
    isSelected,
    isEditable,
  }: {
    cell: any;
    cellRef: (el: HTMLTableCellElement | null) => void;
    isSelected: boolean;
    isEditable: boolean;
  }) => (
    <Table.Data
      ref={cellRef}
      tabIndex={0}
      style={{ width: `${cell.column.getSize()}px` }}
      data-row-id={cell.row.id}
      data-column-id={cell.column.id}
      className={clsx({
        "outline outline-[1.5px] outline-[#3d5aa9] -outline-offset-[2px] rounded-[var(--border-md)] focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-[#3d5aa9] focus-visible:-outline-offset-[2px] focus-visible:rounded-[var(--border-md)]":
          isSelected,
        "box-border p-0 cursor-text": isEditable,
      })}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </Table.Data>
  ),
  (prevProps, nextProps) =>
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.cell.getValue() === nextProps.cell.getValue() &&
    prevProps.cell.row.id === nextProps.cell.row.id &&
    prevProps.cell.column.id === nextProps.cell.column.id,
);
TableCell.displayName = "TableCell";

export function DataTable<TData>({
  table,
  allowCellSelection = false,
  allowRangeSelection = false,
  allowHistory = false,
  allowPaste = false,
  paste,
  onPasteComplete,
  undo,
  redo,
}: DataTableProps<TData>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rows = table.getRowModel().rows;
  const leafColumns = table.getVisibleLeafColumns();
  const lastMouseOverCellRef = useRef<string | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 30,
    overscan: 5,
  });

  const columnVirtualizer = useVirtualizer({
    count: leafColumns.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: (index) => leafColumns[index].getSize(),
    horizontal: true,
    overscan: 3,
  });

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
  } = useCellSelection(rows, leafColumns, tableContainerRef);

  const [, copy] = useCopyToClipboard();

  const handleBodyClick = useCallback(
    (e: React.MouseEvent) => {
      if (!allowCellSelection) return;
      const td = (e.target as Element).closest(
        "td[data-row-id]",
      ) as HTMLTableCellElement | null;
      if (!td) return;
      handleClick(td.dataset.rowId!, td.dataset.columnId!);
    },
    [allowCellSelection, handleClick],
  );

  const handleBodyMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!allowRangeSelection) return;
      const td = (e.target as Element).closest(
        "td[data-row-id]",
      ) as HTMLTableCellElement | null;
      if (!td) return;
      lastMouseOverCellRef.current = null;
      handleMouseDown(td.dataset.rowId!, td.dataset.columnId!);
    },
    [allowRangeSelection, handleMouseDown],
  );

  const handleBodyMouseOver = useCallback(
    (e: React.MouseEvent) => {
      if (!allowRangeSelection || !isSelectingRef.current) return;
      const td = (e.target as Element).closest(
        "td[data-row-id]",
      ) as HTMLTableCellElement | null;
      if (!td) return;
      const key = `${td.dataset.rowId}-${td.dataset.columnId}`;
      if (key === lastMouseOverCellRef.current) return;
      lastMouseOverCellRef.current = key;
      handleMouseEnter(td.dataset.rowId!, td.dataset.columnId!);
    },
    [allowRangeSelection, isSelectingRef, handleMouseEnter],
  );

  const handleContainerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!allowCellSelection) return;
      const td = (e.target as Element).closest(
        "td[data-row-id]",
      ) as HTMLTableCellElement | null;
      if (!td) return;
      handleKeyDown(
        e as React.KeyboardEvent<HTMLDivElement>,
        td.dataset.rowId!,
        td.dataset.columnId!,
      );
      if (e.key === "Enter") {
        const editableCell = td.querySelector("[data-editable-cell-viewing]");
        if (editableCell) {
          editableCell.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: "Enter",
              bubbles: true,
              cancelable: true,
            }),
          );
        }
      }
    },
    [allowCellSelection, handleKeyDown],
  );

  useEffect(() => {
    const handler = async (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "c" &&
        selectedRange
      ) {
        event.preventDefault();
        const clipboardData = parseCopyData(
          selectedRange,
          table.getRowModel().rows,
          table.getAllColumns(),
        );
        await copy(clipboardData);
      }
      if (
        allowHistory &&
        (event.ctrlKey || event.metaKey) &&
        event.key === "z"
      ) {
        event.preventDefault();
        if (event.shiftKey) redo?.();
        else undo?.();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [selectedRange, copy, allowHistory, undo, redo, table]);

  useEffect(() => {
    if (allowPaste && paste && selectedCell) {
      const pasteHandler = (event: ClipboardEvent) => {
        const clipboardData = event.clipboardData?.getData("Text");
        const result = paste(selectedCell, clipboardData);
        if (onPasteComplete && result.totalChanges > 0) onPasteComplete(result);
      };
      document.addEventListener("paste", pasteHandler);
      return () => document.removeEventListener("paste", pasteHandler);
    }
    return undefined;
  }, [allowPaste, selectedCell, paste, onPasteComplete]);

  const virtualRows = rowVirtualizer.getVirtualItems();
  const virtualColumns = columnVirtualizer.getVirtualItems();
  const totalColumnsWidth = columnVirtualizer.getTotalSize();
  const leftColPad = virtualColumns[0]?.start ?? 0;
  const rightColPad =
    totalColumnsWidth - (virtualColumns[virtualColumns.length - 1]?.end ?? 0);

  return (
    <div
      className={clsx(
        "box-border border border-[hsl(240_5.9%_90%)] rounded-[var(--border-md)]",
        { "select-none": allowRangeSelection },
      )}
      onKeyDown={handleContainerKeyDown}
    >
      <div ref={tableContainerRef} className="h-[90vh] overflow-auto">
        <Table style={{ width: `${totalColumnsWidth}px` }}>
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                <th style={{ width: `${leftColPad}px`, padding: 0 }} />
                {virtualColumns.map((vc) => {
                  const header = headerGroup.headers[vc.index];
                  return (
                    <Table.Head
                      key={header.id}
                      style={{ width: `${vc.size}px` }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </Table.Head>
                  );
                })}
                <th style={{ width: `${rightColPad}px`, padding: 0 }} />
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body
            onClick={handleBodyClick}
            onMouseDown={handleBodyMouseDown}
            onMouseOver={handleBodyMouseOver}
          >
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
                      <td style={{ width: `${leftColPad}px`, padding: 0 }} />
                      {virtualColumns.map((vc) => {
                        const cell = visibleCells[vc.index];
                        return (
                          <TableCell
                            key={cell.id}
                            cell={cell}
                            cellRef={getCellRef(cell.row.id, cell.column.id)}
                            isSelected={isCellSelected(
                              cell.row.id,
                              cell.column.id,
                            )}
                            isEditable={
                              cell.column.columnDef.meta?.editable ?? false
                            }
                          />
                        );
                      })}
                      <td style={{ width: `${rightColPad}px`, padding: 0 }} />
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
              <Table.Row>
                <Table.Data
                  colSpan={leafColumns.length}
                  className="h-24 text-center"
                >
                  No data.
                </Table.Data>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
