# useGigatable

`useGigatable` creates the TanStack Table instance, owns mutable row data, and returns mutation/history handlers.

## Options

The hook accepts every TanStack `TableOptions<TData>` field except `getCoreRowModel`, which Gigatable supplies.

| Option           | Type                         | Default  | Description                       |
| ---------------- | ---------------------------- | -------- | --------------------------------- |
| `columns`        | `ColumnDef<TData, TValue>[]` | required | TanStack columns                  |
| `data`           | `TData[]`                    | required | Initial and synchronized row data |
| `history`        | `boolean`                    | `false`  | Track mutations                   |
| `maxHistorySize` | `number`                     | `20`     | Retained undo entries             |

Options such as sorting, visibility, `getRowId`, column sizing, and controlled state pass through to `useReactTable`.

## Return Value

| Field                 | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `table`               | TanStack Table instance                               |
| `paste`               | Apply TSV at a selected cell and return `PasteResult` |
| `applyFill`           | Write one value to target row indices in a column     |
| `applyHorizontalFill` | Write one value to target columns in a row            |
| `clearCells`          | Clear explicit row-index/column-ID coordinates        |
| `undo`                | Restore the previous history state                    |
| `redo`                | Restore the next history state                        |
| `clear`               | Clear undo and redo stacks                            |
| `reset`               | Replace the history baseline                          |
| `canUndo`             | Whether an undo entry exists                          |
| `canRedo`             | Whether a redo entry exists                           |

## Example

```tsx
const {
  table,
  paste,
  applyFill,
  applyHorizontalFill,
  clearCells,
  undo,
  redo,
  clear,
  reset,
  canUndo,
  canRedo,
} = useGigatable({
  columns,
  data,
  history: true,
  maxHistorySize: 50,
  enableColumnResizing: true,
  columnResizeMode: "onChange",
});
```

## Mutation Semantics

- Row objects are shallow-cloned only when a value changes.
- No-op edits, paste, fill, or clearing retain the previous array.
- With history disabled, data lives in local React state.
- With history enabled, the history present state is the table’s source.
- A new `data` reference synchronizes the current table and resets history.

## Custom Table Metadata

Existing `meta` fields are preserved. Gigatable adds `updateCellData` and `clearCellData`.
