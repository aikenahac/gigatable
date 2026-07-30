import { clsx } from "clsx";
import type { Cell } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import * as React from "react";
import { Table as TablePrimitive } from "../table";
import { EditableCell } from "./editable-cell";
import {
  getColumnResizerClassName,
  shouldRenderColumnResizer,
} from "./column-resizing";
import {
  useGigatableContext,
  type GigatableCellState,
} from "./gigatable-context";
import type { EditableCellInputProps } from "./editable-cell";

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

export const GigatableTable = React.forwardRef<
  HTMLTableElement,
  React.ComponentPropsWithoutRef<typeof TablePrimitive>
>(function GigatableTable({ style, ...props }, ref) {
  const { tableStyle } = useGigatableContext();
  return (
    <TablePrimitive ref={ref} style={{ ...tableStyle, ...style }} {...props} />
  );
});

export const GigatableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentPropsWithoutRef<typeof TablePrimitive.Header>
>(function GigatableHeader({ children, ...props }, ref) {
  const { table, allowColumnResizing } = useGigatableContext();
  return (
    <TablePrimitive.Header ref={ref} {...props}>
      {children ??
        table.getHeaderGroups().map((headerGroup) => (
          <TablePrimitive.Row key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const canResize = shouldRenderColumnResizer(
                allowColumnResizing,
                !header.isPlaceholder && header.column.getCanResize(),
              );
              return (
                <TablePrimitive.Head
                  key={header.id}
                  className={clsx({ relative: canResize })}
                  style={{ width: `${header.getSize()}px` }}
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
                </TablePrimitive.Head>
              );
            })}
          </TablePrimitive.Row>
        ))}
    </TablePrimitive.Header>
  );
});

export const GigatableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentPropsWithoutRef<typeof TablePrimitive.Body>
>(function GigatableBody({ children, ...props }, ref) {
  const { rows, leafColumns } = useGigatableContext();
  return (
    <TablePrimitive.Body ref={ref} {...props}>
      {children ??
        (rows.length ? (
          rows.map((row) => (
            <TablePrimitive.Row
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <GigatableCell key={cell.id} cell={cell} />
              ))}
            </TablePrimitive.Row>
          ))
        ) : (
          <tr>
            <td
              colSpan={leafColumns.length}
              className="h-24 text-center align-middle"
            >
              No data.
            </td>
          </tr>
        ))}
    </TablePrimitive.Body>
  );
});

export const GigatableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentPropsWithoutRef<typeof TablePrimitive.Footer>
>(function GigatableFooter({ children, ...props }, ref) {
  const { table } = useGigatableContext();
  const footerGroups = table.getFooterGroups();
  if (
    !children &&
    footerGroups.every((group) =>
      group.headers.every((header) => header.column.columnDef.footer == null),
    )
  ) {
    return null;
  }
  return (
    <TablePrimitive.Footer ref={ref} {...props}>
      {children ??
        footerGroups.map((footerGroup) => (
          <TablePrimitive.Row key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <TablePrimitive.Head key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext(),
                    )}
              </TablePrimitive.Head>
            ))}
          </TablePrimitive.Row>
        ))}
    </TablePrimitive.Footer>
  );
});

export interface GigatableCellProps<TData>
  extends Omit<
    React.ComponentPropsWithoutRef<typeof TablePrimitive.Data>,
    "children"
  > {
  cell: Cell<TData, unknown>;
  children?: React.ReactNode | ((state: GigatableCellState) => React.ReactNode);
}

export function GigatableCell<TData>({
  cell,
  children,
  className,
  style,
  overlay,
  ...props
}: GigatableCellProps<TData>) {
  const { allColumnsEditable, getCellState } = useGigatableContext<TData>();
  const state = getCellState(cell);
  const renderedChildren =
    typeof children === "function"
      ? children(state)
      : (children ??
        (allColumnsEditable && !cell.column.columnDef.meta?.editable ? (
          <EditableCell
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...(cell.getContext() as any)}
            renderInput={DefaultTextInput}
          />
        ) : (
          flexRender(cell.column.columnDef.cell, cell.getContext())
        )));

  const fillHandle = state.isFillAnchor ? (
    <span
      aria-hidden="true"
      data-gigatable-fill-handle
      className="absolute bottom-[-5px] right-[-5px] z-30 h-2 w-2 cursor-crosshair rounded-xs border border-(--gt-row-bg) bg-(--gt-selection-outline) shadow-[0_0_0_1px_var(--gt-cell-border-color),0_2px_5px_rgba(15,23,42,0.2)]"
      onMouseDown={state.fillHandleMouseDown}
    />
  ) : null;

  return (
    <TablePrimitive.Data
      {...props}
      ref={state.cellRef}
      tabIndex={0}
      data-row-id={cell.row.id}
      data-column-id={cell.column.id}
      className={clsx(
        cell.column.columnDef.meta?.getCellClassName?.(cell),
        className,
        {
          "outline-[1.5px] outline-(--gt-selection-outline) -outline-offset-2 rounded-(--border-md)":
            state.isSelected,
          "cursor-text": state.isEditable,
          relative: state.isFillAnchor,
          "is-in-range": state.isInRange,
          "is-fill-range": state.isFillRange,
        },
      )}
      style={{
        width: `${cell.column.getSize()}px`,
        backgroundColor:
          state.pasteBackground ||
          (state.isFillRange
            ? "var(--gt-fill-preview-bg)"
            : state.isInRange
              ? "var(--gt-range-bg)"
              : undefined),
        boxShadow: state.pasteShadow || undefined,
        transition: state.pasteTransition
          ? "background-color 3000ms ease"
          : undefined,
        ...style,
      }}
      overlay={
        <>
          {overlay}
          {fillHandle}
        </>
      }
    >
      {state.isFillRange &&
      !state.isFillSource &&
      state.fillPreviewValue !== undefined ? (
        <span className="text-(--gt-fill-preview-text-color) italic truncate">
          {String(state.fillPreviewValue)}
        </span>
      ) : (
        renderedChildren
      )}
    </TablePrimitive.Data>
  );
}

const featureLabels: Array<{
  key: keyof ReturnType<typeof useGigatableContext>["features"];
  label: string;
  description: string;
}> = [
  {
    key: "cellSelection",
    label: "Cell selection",
    description: "Click a cell and use Arrow keys or Tab to navigate.",
  },
  {
    key: "rangeSelection",
    label: "Range selection",
    description: "Drag or hold Shift while navigating to select a range.",
  },
  {
    key: "quickEdit",
    label: "Quick edit",
    description:
      "Alt/Option-click to edit, or drag to select part of the text.",
  },
  {
    key: "paste",
    label: "Copy and paste",
    description: "Use the standard Ctrl/Cmd+C and Ctrl/Cmd+V shortcuts.",
  },
  {
    key: "fillHandle",
    label: "Fill handle",
    description: "Drag the selected cell handle to repeat its value.",
  },
  {
    key: "clearing",
    label: "Clear cells",
    description: "Press Delete or Backspace to clear editable selected cells.",
  },
  {
    key: "history",
    label: "Undo and redo",
    description: "Use Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z.",
  },
  {
    key: "columnResizing",
    label: "Column resizing",
    description: "Drag a header edge, or double-click it to reset.",
  },
];

export function GigatableFeatureGuide(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  const { features } = useGigatableContext();
  return (
    <div {...props}>
      <ul className="grid gap-3">
        {featureLabels
          .filter(({ key }) => Boolean(features[key]))
          .map(({ key, label, description }) => (
            <li key={key}>
              <strong>{label}</strong>
              <div>{description}</div>
            </li>
          ))}
      </ul>
    </div>
  );
}
