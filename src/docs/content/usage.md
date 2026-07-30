# Usage

Gigatable separates table state from rendering. `useGigatable` creates a TanStack Table instance and mutation handlers; `<Gigatable>` renders the virtualized grid and wires selection, paste, fill, and history behavior.

## Minimal setup

```tsx
import { Gigatable, useGigatable } from "./gigatable";
import { columns } from "./columns";
import { myData } from "./data";

export function App() {
  const { table, paste, applyFill, applyHorizontalFill, undo, redo } =
    useGigatable({
      columns,
      data: myData,
      enableColumnResizing: true,
      columnResizeMode: "onChange",
      history: true,
    });

  return (
    <Gigatable
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
    />
  );
}
```

## Define columns

Gigatable uses TanStack Table `ColumnDef` objects. Read-only columns can use normal accessors. Editable columns should render `EditableCell` and opt in with `meta: { editable: true }`.

```tsx
import type { ColumnDef } from "@tanstack/react-table";
import { EditableCell } from "./gigatable";
import type { EditableCellInputProps } from "./gigatable";

type Row = {
  id: string;
  name: string;
  score: number;
};

const TextInput = ({
  value,
  onChange,
  onBlur,
  onKeyDown,
}: EditableCellInputProps<string>) => (
  <input
    autoFocus
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    onKeyDown={onKeyDown}
  />
);

export const columns: Array<ColumnDef<Row>> = [
  { accessorKey: "id", header: "ID", size: 96 },
  {
    accessorKey: "name",
    header: "Name",
    size: 180,
    cell: (cell) => <EditableCell {...cell} renderInput={TextInput} />,
    meta: { editable: true },
  },
  { accessorKey: "score", header: "Score", size: 120 },
];
```

## Feature flags

| Prop                        | Enables                                              | Requires                                                                                |
| --------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `allowCellSelection`        | Click selection and arrow-key navigation             | none                                                                                    |
| `allowRangeSelection`       | Drag and Shift+Arrow range selection                 | `allowCellSelection`                                                                    |
| `allowQuickEdit`            | Alt/Option-click and partial-text quick edit         | editable columns                                                                        |
| `singleColumnCellSelection` | Drag and Shift+Arrow range selection down one column | `allowCellSelection`; overrides `allowRangeSelection={false}` for this constrained mode |
| `allowHistory`              | Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z                      | `history: true`, `undo`, `redo`                                                         |
| `allowPaste`                | Ctrl/Cmd+V TSV paste                                 | `paste`                                                                                 |
| `allowFillHandle`           | Excel-style drag fill                                | `applyFill`, editable columns                                                           |
| `allowColumnResizing`       | Header-border drag resizing                          | `enableColumnResizing: true` in `useGigatable`                                          |

## Column resizing

Column resizing uses TanStack Table sizing state. Enable it in `useGigatable`, then opt into the resize handles on `<Gigatable>`.

```tsx
const { table } = useGigatable({
  columns,
  data,
  enableColumnResizing: true,
  columnResizeMode: "onChange",
});

<Gigatable table={table} allowColumnResizing />;
```

Users drag the header border to resize a column and double-click the handle to reset the width. Persist widths by controlling TanStack's `columnSizing` state with `state: { columnSizing }` and `onColumnSizingChange`.

## Editing behavior

Double-click an editable cell or press Enter on a selected editable cell to edit. Alt/Option-click enters quick edit, while Alt/Option-drag transfers a partial text selection into the editor. Enter saves and moves down, Tab saves and traverses cells, Escape cancels, and blur commits.

Delete or Backspace clears the selected editable cell or editable cells in a range. Read-only columns are skipped, active inputs keep native key behavior, and a range clear is one undo entry. Clearing defaults to `null`; use `meta.getClearedValue` for another value.

## Custom body composition

With no children, Gigatable keeps its default virtualized renderer. Use
`Gigatable.Table`, `.Header`, `.Body`, `.Footer`, and `.Cell` to replace any
rendering layer while retaining delegated interactions. `Gigatable.Cell`
applies selection refs, fill/paste previews, metadata classes, and the fill
handle. Custom virtualizers can call `registerRowScroller` from
`useGigatableContext`.

## Full demo

The demo route in this repo shows a wide biological strain dataset with virtualization, editable cells, copy/paste, fill handle, column resizing, and history enabled.
