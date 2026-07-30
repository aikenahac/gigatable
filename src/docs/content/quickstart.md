# Quickstart

Render a selectable, editable table with the built-in text editor.

## 1. Define Your Data and Columns

```tsx
import type { ColumnDef } from "@tanstack/react-table";

type Person = {
  id: string;
  name: string;
  role: string;
};

const data: Person[] = [
  { id: "1", name: "Ada", role: "Engineer" },
  { id: "2", name: "Grace", role: "Researcher" },
];

const columns: ColumnDef<Person>[] = [
  { accessorKey: "id", header: "ID", size: 80 },
  { accessorKey: "name", header: "Name", size: 180 },
  { accessorKey: "role", header: "Role", size: 180 },
];
```

## 2. Render Gigatable

```tsx
import { Gigatable, useGigatable } from "./gigatable";

export function PeopleGrid() {
  const { table } = useGigatable({ columns, data });

  return (
    <Gigatable
      table={table}
      allColumnsEditable
      allowCellSelection
      allowRangeSelection
    />
  );
}
```

`allColumnsEditable` uses Gigatable's packaged text editor, so a custom input component is not required.

## What to Try

1. Click a cell and navigate with Arrow keys.
2. Double-click any cell or press Enter to edit it.
3. Drag across cells to select a range.

## Add More Spreadsheet Behavior

Paste, fill, history, resizing, typed parsing, and custom inputs are opt-in. Continue with [Columns & Editing](/docs/columns-editing) to configure individual columns, or review the [Gigatable API](/docs/gigatable-api) for every feature prop.
