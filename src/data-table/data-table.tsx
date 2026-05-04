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

// Memoized cell component to prevent unnecessary re-renders
const TableCell = React.memo(({
  cell,
  cellRef,
  isSelected,
  isInRange,
  isEditable,
  onClick,
  onKeyDown,
  onMouseDown,
  onMouseEnter,
}: {
  cell: any;
  cellRef: React.RefObject<HTMLTableCellElement | null>;
  isSelected: boolean;
  isInRange: boolean;
  isEditable: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onMouseDown: () => void;
  onMouseEnter: () => void;
}) => {
  return (
    <Table.Data
      key={cell.id}
      ref={cellRef}
      tabIndex={0}
      style={{ width: `${cell.column.getSize()}px` }}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      data-row-id={cell.row.id}
      data-column-id={cell.column.id}
      className={clsx({
        "outline outline-[1.5px] outline-[#3d5aa9] -outline-offset-[2px] rounded-[var(--border-md)] focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-[#3d5aa9] focus-visible:-outline-offset-[2px] focus-visible:rounded-[var(--border-md)]":
          isSelected,
        "bg-[#dbe1ff]": !isSelected && isInRange,
        "box-border p-0 cursor-text": isEditable,
      })}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </Table.Data>
  );
}, (prevProps, nextProps) => {
  // Only re-render if these props changed
  return (
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isInRange === nextProps.isInRange &&
    prevProps.cell.getValue() === nextProps.cell.getValue() &&
    prevProps.cell.row.id === nextProps.cell.row.id &&
    prevProps.cell.column.id === nextProps.cell.column.id
  );
});
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

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 30,
    overscan: 30,
  });

  const {
    selectedCell,
    selection: selectedRange,
    getCellRef,
    isCellSelected,
    isCellInRange,
    handleClick,
    handleKeyDown,
    handleMouseDown,
    handleMouseEnter,
  } = useCellSelection(rows, table.getVisibleFlatColumns(), tableContainerRef);

  const [, copy] = useCopyToClipboard();

  // Memoized event handler factories to avoid creating new functions on every render
  const createClickHandler = useCallback(
    (rowId: string, columnId: string) => () => {
      if (allowCellSelection) handleClick(rowId, columnId);
    },
    [allowCellSelection, handleClick]
  );

  const createKeyDownHandler = useCallback(
    (rowId: string, columnId: string, cellRef: React.RefObject<HTMLTableCellElement | null>) =>
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (allowCellSelection) handleKeyDown(e, rowId, columnId);
        if (e.key === "Enter") {
          const editableCell = cellRef.current?.querySelector("[data-editable-cell-viewing]");
          if (editableCell) {
            editableCell.dispatchEvent(
              new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true })
            );
          }
        }
      },
    [allowCellSelection, handleKeyDown]
  );

  const createMouseDownHandler = useCallback(
    (rowId: string, columnId: string) => () => {
      if (allowRangeSelection) handleMouseDown(rowId, columnId);
    },
    [allowRangeSelection, handleMouseDown]
  );

  const createMouseEnterHandler = useCallback(
    (rowId: string, columnId: string) => () => {
      if (allowRangeSelection) handleMouseEnter(rowId, columnId);
    },
    [allowRangeSelection, handleMouseEnter]
  );

  // Consolidated keyboard event listener for copy and undo/redo
  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      // Copy
      if ((event.ctrlKey || event.metaKey) && event.key === "c" && selectedRange) {
        event.preventDefault();
        const clipboardData = parseCopyData(
          selectedRange,
          table.getRowModel().rows,
          table.getAllColumns(),
        );
        await copy(clipboardData);
      }

      // Undo/Redo
      if (allowHistory && (event.ctrlKey || event.metaKey) && event.key === "z") {
        event.preventDefault();
        if (event.shiftKey) {
          redo?.();
        } else {
          undo?.();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedRange, copy, allowHistory, undo, redo, table]);

  // Paste event listener
  useEffect(() => {
    if (allowPaste && paste && selectedCell) {
      const pasteHandler = (event: ClipboardEvent) => {
        const clipboardData = event.clipboardData?.getData("Text");
        const result = paste(selectedCell, clipboardData);

        if (onPasteComplete && result.totalChanges > 0) {
          onPasteComplete(result);
        }
      };

      document.addEventListener("paste", pasteHandler);
      return () => document.removeEventListener("paste", pasteHandler);
    }

    return undefined;
  }, [allowPaste, selectedCell, paste, onPasteComplete]);

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div
      className={clsx("box-border border border-[hsl(240_5.9%_90%)] rounded-[var(--border-md)]", {
        "select-none": allowRangeSelection,
      })}
    >
      <div ref={tableContainerRef} className="h-[90vh] overflow-auto">
        <Table>
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Table.Head
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
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
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body>
            {rows.length > 0 ? (
              <>
                <tr style={{ height: `${virtualItems[0]?.start ?? 0}px` }} />
                {virtualItems.map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return (
                    <Table.Row
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      style={{
                        height: `${virtualRow.size}px`,
                      }}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const cellRef = getCellRef(cell.row.id, cell.column.id);
                        const isSelected = isCellSelected(
                          cell.row.id,
                          cell.column.id,
                        );
                        const isInRange = isCellInRange(
                          cell.row.id,
                          cell.column.id,
                        );
                        const isEditable = cell.column.columnDef.meta?.editable;

                        return (
                          <TableCell
                            key={cell.id}
                            cell={cell}
                            cellRef={cellRef}
                            isSelected={isSelected}
                            isInRange={isInRange}
                            isEditable={isEditable ?? false}
                            onClick={createClickHandler(cell.row.id, cell.column.id)}
                            onKeyDown={createKeyDownHandler(cell.row.id, cell.column.id, cellRef)}
                            onMouseDown={createMouseDownHandler(cell.row.id, cell.column.id)}
                            onMouseEnter={createMouseEnterHandler(cell.row.id, cell.column.id)}
                          />
                        );
                      })}
                    </Table.Row>
                  );
                })}
                <tr
                  style={{
                    height: `${
                      rowVirtualizer.getTotalSize() -
                      (virtualItems[virtualItems.length - 1]?.end ?? 0)
                    }px`,
                  }}
                />
              </>
            ) : (
              <Table.Row>
                <Table.Data
                  colSpan={table.getVisibleFlatColumns().length}
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
