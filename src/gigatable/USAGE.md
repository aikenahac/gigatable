# gigatable — Usage Cheatsheet

## Minimal setup

```tsx
// app.tsx
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

## Defining columns

```tsx
// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { EditableCell, EditableCellInputProps } from "./gigatable";

// Custom input component — receives EditableCellInputProps
const TextInput = ({ value, onChange, onKeyDown, onBlur }: EditableCellInputProps<string>) => (
  <input
    autoFocus
    value={value as string}
    onChange={onChange}
    onKeyDown={onKeyDown}
    onBlur={onBlur}
  />
);

export const columns: ColumnDef<MyRow, unknown>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 80,
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 200,
    cell: (cell) => <EditableCell {...cell} renderInput={TextInput} />,
    meta: { editable: true },
  },
];
```

## TypeScript augmentation

Add `src/gigatable/types/react-table.ts` to the `include` array in your `tsconfig.json`:

```json
{
  "include": ["src", "src/gigatable/types/react-table.ts"]
}
```

## Feature flags

| Prop | Enables | Also requires |
|---|---|---|
| `allowCellSelection` | Click to select, arrow key navigation | — |
| `allowRangeSelection` | Drag + Shift+Arrow range selection | `allowCellSelection` |
| `singleColumnCellSelection` | Drag + Shift+Arrow range selection down one column | `allowCellSelection`; overrides `allowRangeSelection={false}` for this constrained mode |
| `allowHistory` | Ctrl/Cmd+Z / Ctrl/Cmd+Shift+Z | `undo`, `redo` props + `history: true` in `useGigatable` |
| `allowPaste` | Ctrl/Cmd+V paste (TSV) | `paste` prop |
| `allowFillHandle` | Drag-fill down a column | `applyFill` prop + `meta: { editable: true }` on columns |
| `allColumnsEditable` | Make every column editable with a default text input | — |

## Theming

```tsx
import { themes, Gigatable } from "./gigatable";
import type { GigatableTheme } from "./gigatable";

// Built-in preset
<Gigatable theme={themes.dark} ... />

// Override a preset field
<Gigatable theme={{ ...themes.dark, header: { background: "var(--brand)" } }} ... />

// Partial custom theme (unset fields fall back to themes.light)
<Gigatable theme={{ row: { height: 36 }, selection: { outline: "#f59e0b" } }} ... />
```

Themeable areas and their fields:

| Area | Fields |
|---|---|
| `header` | `background`, `textColor`, `borderColor`, `height`, `fontSize`, `fontFamily`, `fontWeight` |
| `row` | `height`, `background`, `hoverBackground` |
| `cell` | `borderColor`, `fontSize`, `fontFamily`, `fontWeight`, `textColor`, `paddingX`, `paddingY` |
| `selection` | `outline`, `rangeBackground` |
| `paste` | `highlightBackground`, `highlightBorderColor` |
| `fill` | `previewBackground`, `previewTextColor` |

String values accept CSS variable references (e.g. `"var(--primary)"`). Number values are treated as `px`.
