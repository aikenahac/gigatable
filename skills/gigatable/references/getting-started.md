# Getting Started

## Requirements

Gigatable expects:

- React 19 or newer;
- TypeScript with an active `tsconfig.json`;
- Tailwind CSS v4;
- Node.js 18 or a compatible package-manager runtime.

Gigatable is source-installed. The CLI copies its React code into the application instead of adding a runtime `gigatable` dependency.

## Install

Run one command from the application root:

```bash
npx gigatable init
pnpm dlx gigatable init
yarn dlx gigatable init
bunx gigatable init
```

The interactive command validates TypeScript and Tailwind, asks for a destination (default `src/gigatable`), copies the source, and installs:

```text
@tanstack/react-table
@tanstack/react-virtual
clsx
```

Do not overwrite an existing destination without inspecting it for application changes.

## Configure TypeScript

Include the copied TanStack augmentation in the active project:

```json
{
  "include": ["src", "src/gigatable/types/react-table.d.ts"]
}
```

Older copies may name this file `react-table.ts`. Use the filename that actually exists. If `meta.editable` or other metadata is unknown, verify both the path and which `tsconfig` the editor/build uses.

## Render a first table

```tsx
import type { ColumnDef } from "@tanstack/react-table";
import { Gigatable, useGigatable } from "./gigatable";

type Person = {
  id: string;
  name: string;
  role: string;
};

const columns: ColumnDef<Person>[] = [
  { accessorKey: "id", header: "ID", size: 80 },
  { accessorKey: "name", header: "Name", size: 180 },
  { accessorKey: "role", header: "Role", size: 180 },
];

export function PeopleGrid({ data }: { data: Person[] }) {
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

`allColumnsEditable` supplies the packaged text editor. Prefer explicit editable metadata and custom editors for typed domain values.

## Diagnose setup failures

| Symptom                                   | Check                                                               |
| ----------------------------------------- | ------------------------------------------------------------------- |
| Import cannot be resolved                 | Match the import to the chosen copied directory                     |
| Metadata fields are unknown               | Include the installed augmentation file in the active `tsconfig`    |
| Styling is missing                        | Confirm Tailwind v4 processes files under the copied path           |
| CLI picks the wrong package manager       | Invoke it through the desired package manager                       |
| Existing behavior differs from this guide | Inspect the installed barrel, props, and types; the local copy wins |
