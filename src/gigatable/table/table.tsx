import React from "react";
import { clsx } from "clsx";

export interface TableComponent
  extends React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLTableElement> &
      React.RefAttributes<HTMLTableElement>
  > {
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Footer: typeof TableFooter;
  Row: typeof TableRow;
  Head: typeof TableHead;
  Data: typeof TableData;
  Caption: typeof TableCaption;
}

const Table: Partial<TableComponent> = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, style, ...props }, ref) => (
  <div className="relative w-full" style={{ fontFamily: "var(--gt-cell-font-family)" }}>
    <table
      ref={ref}
      style={{ fontSize: "var(--gt-cell-font-size)", ...style }}
      className={clsx(
        "w-full leading-[20px] caption-bottom border-collapse table-fixed",
        className,
      )}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={clsx(
      "sticky top-0 z-10 bg-[var(--gt-header-bg)] [&_tr]:border-b [&_tr]:border-[color:var(--gt-header-border-color)]",
      className,
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={clsx("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={clsx(
      "border-t bg-[var(--gt-row-hover-bg)] font-medium",
      "[&_tr:last-child]:border-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={clsx(
      "border-b h-[var(--gt-row-height)] max-h-[var(--gt-row-height)]",
      "hover:bg-[var(--gt-row-hover-bg)]",
      "data-[state=selected]:bg-[var(--gt-row-hover-bg)]",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, style, ...props }, ref) => (
  <th
    ref={ref}
    style={{
      color: "var(--gt-header-text-color)",
      backgroundColor: "var(--gt-header-bg)",
      borderRightColor: "var(--gt-header-border-color)",
      fontSize: "var(--gt-header-font-size)",
      fontFamily: "var(--gt-header-font-family)",
      fontWeight: "var(--gt-header-font-weight)",
      ...style,
    }}
    className={clsx(
      "h-[var(--gt-header-height)] px-[var(--gt-cell-padding-x)] py-[var(--gt-cell-padding-y)] text-left align-middle",
      "border-r has-[role=checkbox]:pr-0",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableData = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & { overlay?: React.ReactNode }
>(({ className, style, children, overlay, ...props }, ref) => (
  <td
    ref={ref}
    style={{
      borderRightColor: "var(--gt-cell-border-color)",
      color: "var(--gt-cell-text-color)",
      fontWeight: "var(--gt-cell-font-weight)",
      ...style,
    }}
    className={clsx(
      "p-0 align-middle h-[var(--gt-row-height)] border-r has-[role=checkbox]:pr-0",
      className,
    )}
    {...props}
  >
    <div className="h-[var(--gt-row-height)] px-[var(--gt-cell-padding-x)] overflow-hidden text-ellipsis whitespace-nowrap flex items-center">
      {children}
    </div>
    {overlay}
  </td>
));
TableData.displayName = "TableData";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={clsx(
      "mt-4 text-sm leading-5 text-[hsl(240_3.8%_46.1%)]",
      className,
    )}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Footer = TableFooter;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Data = TableData;
Table.Caption = TableCaption;

export default Table as TableComponent;
