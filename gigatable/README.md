# gigatable-cli

Documentation: [gigatable.aiken.si](https://gigatable.aiken.si)

**Gigatable is supported by [Preskok ThinkTank](https://thinktank.preskok.si/en/).**

<a href="https://thinktank.preskok.si/en/" target="_blank" rel="noopener noreferrer">
  <img src="https://raw.githubusercontent.com/aikenahac/gigatable/refs/heads/master/public/preskok_thinktank.png" alt="Preskok Think Tank" width="220" />
</a>

Excel-like datatable for React with cell selection, range selection, inline editing, copy/paste, fill handle, and undo/redo — powered by TanStack Table and TanStack Virtual.

> **Install:** `npx gigatable init` copies the source files directly into your project. You own the code.

## Requirements

- React 19+
- TypeScript
- Tailwind CSS v4
- Node 18+

## Install

```bash
npx gigatable init
```

This will:
1. Prompt for a target directory (default: `src/gigatable`)
2. Check for TypeScript and Tailwind CSS v4
3. Copy all component files into your project
4. Install peer dependencies: `@tanstack/react-table`, `@tanstack/react-virtual`, `clsx`

## Quick Start

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

## Column Definitions

Use TanStack Table's `ColumnDef` format. Mark editable columns with `meta: { editable: true }` and wrap the cell with `<EditableCell>`.

```tsx
// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { EditableCell, EditableCellInputProps } from "./gigatable";

const TextInput = ({
  value,
  onChange,
  onKeyDown,
  onBlur,
}: EditableCellInputProps<string>) => (
  <input
    autoFocus
    value={value as string}
    onChange={onChange}
    onKeyDown={onKeyDown}
    onBlur={onBlur}
  />
);

const NumberInput =
  (step = 1) =>
  ({ value, onChange, onKeyDown, onBlur }: EditableCellInputProps<number>) =>
    (
      <input
        autoFocus
        type="number"
        step={step}
        value={value as number}
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
    // no meta.editable — read-only
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 200,
    cell: (cell) => <EditableCell {...cell} renderInput={TextInput} />,
    meta: { editable: true },
  },
  {
    accessorKey: "score",
    header: "Score",
    size: 100,
    cell: (cell) => <EditableCell {...cell} renderInput={NumberInput(0.1)} />,
    meta: { editable: true },
  },
];
```

## TypeScript Setup

Add the type augmentation file to your `tsconfig.json`:

```json
{
  "include": ["src", "src/gigatable/types/react-table.ts"]
}
```

This enables the `meta: { editable: true }` property on column definitions without type errors.

## API Reference

### `useGigatable(options)`

Wraps TanStack Table's `useReactTable`. Accepts all standard `TableOptions<TData>` except `getCoreRowModel` (added automatically).

| Option | Type | Default | Description |
|---|---|---|---|
| `columns` | `ColumnDef<TData, TValue>[]` | required | TanStack column definitions |
| `data` | `TData[]` | required | Row data. Synced to internal state when the array reference changes. |
| `history` | `boolean` | `false` | Enable undo/redo tracking |
| `maxHistorySize` | `number` | `20` | Max undo steps retained |

**Returns:** `{ table, paste, applyFill, undo, redo, clear, canUndo, canRedo }`

### `<Gigatable>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `table` | `Table<TData>` | required | Instance from `useGigatable` |
| `allowCellSelection` | `boolean` | `false` | Click selection + arrow key navigation |
| `allowRangeSelection` | `boolean` | `false` | Drag + Shift+Arrow range. Requires `allowCellSelection`. |
| `singleColumnCellSelection` | `boolean` | `false` | Drag + Shift+Arrow range down one column. Requires `allowCellSelection`; works when `allowRangeSelection` is false. |
| `allowHistory` | `boolean` | `false` | Ctrl/Cmd+Z / Ctrl/Cmd+Shift+Z. Requires `undo` + `redo`. |
| `allowPaste` | `boolean` | `false` | Ctrl/Cmd+V paste (TSV). Requires `paste`. |
| `allowFillHandle` | `boolean` | `false` | Drag-fill down. Requires `applyFill` + `meta: { editable: true }` columns. |
| `paste` | `Function` | — | From `useGigatable`. Required when `allowPaste`. |
| `applyFill` | `Function` | — | From `useGigatable`. Required when `allowFillHandle`. |
| `undo` | `() => void` | — | From `useGigatable`. Required when `allowHistory`. |
| `redo` | `() => void` | — | From `useGigatable`. Required when `allowHistory`. |
| `allColumnsEditable` | `boolean` | `false` | Make every column editable with a default text input. Columns with `meta: { editable: true }` keep their own `renderInput`. |
| `onPasteComplete` | `(result: PasteResult) => void` | — | Called after each paste with change details. |
| `theme` | `GigatableTheme` | `themes.light` | Customise visual appearance. |

### `<EditableCell>`

Renders a cell in either view mode (double-click/Enter to edit) or edit mode. Accepts all TanStack `CellContext<TData, TValue>` props plus:

| Prop | Type | Description |
|---|---|---|
| `renderInput` | `FC<EditableCellInputProps<TValue>>` | Your custom input component |

### `EditableCellInputProps<TValue>`

Props passed to your `renderInput` component:

| Prop | Description |
|---|---|
| `value` | Current cell value |
| `onChange` | Standard input change handler |
| `onBlur` | Commits value and exits edit mode |
| `onValueChange` | Commit a value string directly (for custom/select inputs) |
| `onKeyDown` | Forward to handle Tab (save + move), Enter (save), Escape (cancel) |
| `cancelEditing` | Discard changes and return to view mode |
| `className` | Optional className for the input element |

### `PasteResult`

Returned by `paste()` and passed to `onPasteComplete`:

```ts
interface PasteResult {
  changes: CellChange[];
  totalChanges: number;
}

interface CellChange {
  rowIndex: number;
  rowId: string;
  columnId: string;
  columnHeader: string;
  oldValue: unknown;
  newValue: unknown;
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| Click | Select cell |
| Shift+Click / Drag | Extend range selection |
| Arrow keys | Move selection |
| Shift+Arrow | Extend range |
| Ctrl/Cmd+Home/End | Jump to first/last row |
| Enter | Enter edit mode |
| Double-click | Enter edit mode |
| Tab | Save + move to next cell |
| Escape | Cancel edit |
| Ctrl/Cmd+C | Copy selection to clipboard (TSV) |
| Ctrl/Cmd+V | Paste from clipboard |
| Ctrl/Cmd+Z | Undo |
| Ctrl/Cmd+Shift+Z | Redo |

## Theming

Three built-in presets are available. Pass one as the `theme` prop, or spread and override individual fields.

```tsx
import { themes, Gigatable } from "./gigatable";

// Use a preset
<Gigatable theme={themes.dark} ... />

// Customize on top of a preset
<Gigatable theme={{ ...themes.dark, header: { background: "var(--brand)" } }} ... />

// Partial custom theme — unset fields fall back to themes.light
<Gigatable theme={{ row: { height: 36 }, selection: { outline: "orange" } }} ... />
```

The `GigatableTheme` interface groups fields by visual area:

```ts
import type { GigatableTheme } from "./gigatable";

const myTheme: GigatableTheme = {
  header: { background: "#1e293b", textColor: "#f8fafc", height: 40 },
  row: { height: 32, background: "#ffffff", hoverBackground: "#f1f5f9" },
  cell: { borderColor: "#e2e8f0", fontSize: 13, paddingX: 12, paddingY: 6 },
  selection: { outline: "var(--primary)", rangeBackground: "rgba(59,130,246,0.1)" },
  paste: { highlightBackground: "rgba(134,239,172,0.25)" },
  fill: { previewBackground: "#eff4ff", previewTextColor: "#6b8ccd" },
};
```

All values accept strings (including CSS variable references like `"var(--primary)"`) or numbers (treated as `px`).

## Known Limitations

- **Tailwind CSS v4 required** — all styling uses Tailwind utility classes.
- **TypeScript only** — JavaScript projects are not supported.
- **Fill handle fills up/down only** — not left, or right.
- **Paste format: TSV** — compatible with Excel and Google Sheets. JSON or CSV paste is not supported.
- **React 19+** — older React versions are untested.
