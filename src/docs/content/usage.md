# Usage

Gigatable separates table state from rendering. `useGigatable` creates a TanStack Table instance and mutation handlers; `<Gigatable>` renders the virtualized grid and wires selection, paste, fill, and history behavior.

## Minimal setup

```tsx
import { Gigatable, useGigatable } from "./gigatable";
import { columns } from "./columns";
import { myData } from "./data";

export function App() {
  const { table, paste, applyFill, undo, redo } = useGigatable({
    columns,
    data: myData,
    history: true,
  });

  return (
    <Gigatable
      table={table}
      allowCellSelection
      allowRangeSelection
      allowHistory
      allowPaste
      allowFillHandle
      paste={paste}
      applyFill={applyFill}
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

| Prop | Enables | Requires |
| --- | --- | --- |
| `allowCellSelection` | Click selection and arrow-key navigation | none |
| `allowRangeSelection` | Drag and Shift+Arrow range selection | `allowCellSelection` |
| `allowHistory` | Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z | `history: true`, `undo`, `redo` |
| `allowPaste` | Ctrl/Cmd+V TSV paste | `paste` |
| `allowFillHandle` | Excel-style drag fill | `applyFill`, editable columns |

## Editing behavior

Double-click an editable cell or press Enter on a selected editable cell to edit. Press Enter or Tab to save, Escape to cancel, and blur to commit the current value.

## Full demo

The demo route in this repo shows a wide biological strain dataset with virtualization, editable cells, copy/paste, fill handle, and history enabled.
