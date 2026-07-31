# Gigatable React Data Grid — Usage Cheatsheet

Gigatable is an MIT-licensed, source-installed interaction layer for TanStack
Table. The copied React and TypeScript implementation belongs to this
application. It provides editable cells, range selection, keyboard navigation,
Excel-compatible TSV copy/paste, directional fill, clearing, resizing,
virtualization, and undo/redo.

## Product fit

Use Gigatable for React data-entry and operational workflows where TanStack
Table should remain the state model and the team wants to own the rendered grid
source.

Use a different product when formulas, workbook files, cross-sheet references,
pivoting, extensive enterprise modules, vendor support, or a non-React platform
is a core requirement. TanStack Table is Gigatable's headless foundation, not a
competing rendered grid.

Documentation: https://gigatable.dev/docs/

Comparisons: https://gigatable.dev/compare/

## Application-owned cells

The core includes the interaction layer and basic text editing. It does not
choose product-specific selectors, date pickers, numeric sliders, badges,
progress displays, popovers, or dialogs for your application. Add
dependency-free starter source
after `init` with:

```bash
npx gigatable add cells
```

Adapt the copied `cells/` components locally. Keep pure action and display
columns read-only. Field-editing popovers and dialogs should use
`EditableCell`, just like inline editors. Only `meta.editable` columns
participate in paste, fill, clearing, and history.

Single-click selects without editing. Double-click activates an editor or
overlay, Alt/Option-click provides the power-user activation path when
`allowQuickEdit` is enabled, and Enter activates the selected editable cell.
Controls inside an active editor use normal single-click interaction.

The optional `SelectCell` mounts a focused custom listbox immediately on
activation; use Arrow keys, Home/End, typeahead, and Enter to choose an option.
`DateCell` mounts a custom calendar with Arrow, Home/End, Page Up/Page Down,
Enter, and Escape support. Both are dependency-free and use Gigatable theme
variables instead of shadcn-specific tokens.

Range-mode `NumberCell` keeps a compact numeric input visible beside the active
slider. Use `tone` (or a value-to-tone callback) and `suffix` to match the
read-only progress renderer, for example `tone="success"` and `suffix="%"`.

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

// Typed controls use onDraftChange while editing and commitValue when an
// explicit action should save and close. onValueChange(string) remains the
// legacy immediate-commit adapter.

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
