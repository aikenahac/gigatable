# gigatable — Usage Cheatsheet

## Minimal setup

```tsx
// app.tsx
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

## Defining columns

```tsx
// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { EditableCell, EditableCellInputProps } from "./gigatable";

// Custom input component — receives EditableCellInputProps
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

| Prop                        | Enables                                              | Also requires                                                                           |
| --------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `allowCellSelection`        | Click to select, arrow key navigation                | —                                                                                       |
| `allowRangeSelection`       | Drag + Shift+Arrow range selection                   | `allowCellSelection`                                                                    |
| `allowQuickEdit`            | Alt/Option-click editing and partial-text selection  | editable columns                                                                        |
| `singleColumnCellSelection` | Drag + Shift+Arrow range selection down one column   | `allowCellSelection`; overrides `allowRangeSelection={false}` for this constrained mode |
| `allowHistory`              | Ctrl/Cmd+Z / Ctrl/Cmd+Shift+Z                        | `undo`, `redo` props + `history: true` in `useGigatable`                                |
| `allowPaste`                | Ctrl/Cmd+V paste (TSV)                               | `paste` prop                                                                            |
| `allowFillHandle`           | Drag-fill in the configured direction                | `applyFill` prop + editable columns                                                     |
| `allColumnsEditable`        | Make every column editable with a default text input | —                                                                                       |
| `allowColumnResizing`       | Header-border drag resizing                          | `enableColumnResizing: true` in `useGigatable`                                          |

Delete and Backspace clear selected editable cells whenever cell selection is
enabled. Read-only cells are skipped, a range clear is one undo step, and
keystrokes inside an active editor are left alone. Override the default `null`
with `meta.getClearedValue`; no separate clearing flag is needed.

## Column behavior metadata

```tsx
meta: {
  editable: true,
  allowFill: true,
  parsePastedValue: (text) => Number(text),
  getClearedValue: () => null,
  formatFillPreview: (value) => `${value}%`,
  getCellClassName: (cell) => cell.getValue() == null ? "text-slate-400" : undefined,
}
```

Paste repeats over a larger selected range. Set `pasteByColumnId={false}` for
strictly sequential paste. `PasteResult.changes[].newValue` contains the value
after `parsePastedValue` runs.

## Custom composition

Omitting children keeps the default row-and-column virtualized renderer. For a
custom body, compose `Gigatable.Table`, `Gigatable.Header`, `Gigatable.Body`,
`Gigatable.Footer`, and `Gigatable.Cell`.

`useGigatableContext<TData>()` exposes rows, columns, selection state, the
scroll-container ref, `getCellState`, and `registerRowScroller`. Registration
returns a cleanup function for custom virtualizers.

## Column resizing

Column resizing uses TanStack Table sizing state. Enable TanStack resizing in `useGigatable`, then show Gigatable's header handles with `allowColumnResizing`:

```tsx
const { table } = useGigatable({
  columns,
  data,
  enableColumnResizing: true,
  columnResizeMode: "onChange",
});

<Gigatable table={table} allowColumnResizing />;
```

Double-click a resize handle to reset a column width. To persist widths, control TanStack state with `state: { columnSizing }` and `onColumnSizingChange`.

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

| Area        | Fields                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------ |
| `header`    | `background`, `textColor`, `borderColor`, `height`, `fontSize`, `fontFamily`, `fontWeight` |
| `row`       | `height`, `background`, `hoverBackground`                                                  |
| `cell`      | `borderColor`, `fontSize`, `fontFamily`, `fontWeight`, `textColor`, `paddingX`, `paddingY` |
| `selection` | `outline`, `rangeBackground`                                                               |
| `paste`     | `highlightBackground`, `highlightBorderColor`                                              |
| `fill`      | `previewBackground`, `previewTextColor`                                                    |

String values accept CSS variable references (e.g. `"var(--primary)"`). Number values are treated as `px`.
