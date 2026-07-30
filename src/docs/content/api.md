# API Reference

Gigatable exposes a small public API from the local `./gigatable` barrel file copied by the CLI.

## `useGigatable(options)`

Creates a TanStack Table instance and mutation handlers for paste, fill, editing, undo, and redo.

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
  enableColumnResizing: true,
  columnResizeMode: "onChange",
  history: true,
  maxHistorySize: 50,
});
```

| Option                 | Type                              | Default          | Description                                               |
| ---------------------- | --------------------------------- | ---------------- | --------------------------------------------------------- |
| `columns`              | `Array<ColumnDef<TData, TValue>>` | required         | TanStack column definitions                               |
| `data`                 | `Array<TData>`                    | required         | Initial row data, synced when the array reference changes |
| `history`              | `boolean`                         | `false`          | Enables undo/redo state tracking                          |
| `maxHistorySize`       | `number`                          | `20`             | Maximum undo steps retained                               |
| `enableColumnResizing` | `boolean`                         | TanStack default | Enables TanStack column resize handlers and sizing state  |
| `columnResizeMode`     | `"onChange"` or `"onEnd"`         | TanStack default | Use `"onChange"` for live width updates while dragging    |
| `state.columnSizing`   | `ColumnSizingState`               | TanStack default | Optional controlled sizing state for persisted widths     |
| `onColumnSizingChange` | `OnChangeFn<ColumnSizingState>`   | TanStack default | Optional callback for saving resized widths               |

## `<Gigatable>`

Renders the virtualized table UI.

| Prop                        | Type                                      | Default        | Description                                                                                                                               |
| --------------------------- | ----------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `table`                     | `Table<TData>`                            | required       | Table instance returned by `useGigatable`                                                                                                 |
| `allowCellSelection`        | `boolean`                                 | `false`        | Enables click selection and arrow-key navigation                                                                                          |
| `allowRangeSelection`       | `boolean`                                 | `false`        | Enables drag and Shift+Arrow range selection                                                                                              |
| `allowQuickEdit`            | `boolean`                                 | `false`        | Enables Alt/Option-click edit and partial-text selection                                                                                  |
| `singleColumnCellSelection` | `boolean`                                 | `false`        | Enables drag and Shift+Arrow range selection down one column. Requires `allowCellSelection` and works when `allowRangeSelection` is false |
| `allowHistory`              | `boolean`                                 | `false`        | Enables undo and redo keyboard shortcuts                                                                                                  |
| `allowPaste`                | `boolean`                                 | `false`        | Enables TSV paste from the clipboard                                                                                                      |
| `pasteByColumnId`           | `boolean`                                 | `true`         | Preserves copied column IDs for internal paste                                                                                            |
| `allowFillHandle`           | `boolean`                                 | `false`        | Enables drag-fill behavior for editable columns                                                                                           |
| `fillDirection`             | `"vertical"`, `"horizontal"`, or `"both"` | `"vertical"`   | Restricts fill direction                                                                                                                  |
| `allowColumnResizing`       | `boolean`                                 | `false`        | Shows header-border resize handles. Requires `enableColumnResizing` in `useGigatable`                                                     |
| `paste`                     | `Function`                                | none           | Handler returned by `useGigatable`                                                                                                        |
| `applyFill`                 | `Function`                                | none           | Handler returned by `useGigatable`                                                                                                        |
| `applyHorizontalFill`       | `Function`                                | none           | Horizontal handler returned by `useGigatable`                                                                                             |
| `undo`                      | `() => void`                              | none           | Undo handler returned by `useGigatable`                                                                                                   |
| `redo`                      | `() => void`                              | none           | Redo handler returned by `useGigatable`                                                                                                   |
| `onPasteComplete`           | `(result: PasteResult) => void`           | none           | Called after paste changes are applied                                                                                                    |
| `theme`                     | `GigatableTheme`                          | `themes.light` | Visual token overrides                                                                                                                    |
| `allColumnsEditable`        | `boolean`                                 | `false`        | Treats every column as editable with the default text input                                                                               |

Delete and Backspace are inherent editable-cell behavior when
`allowCellSelection` is enabled. They clear only editable cells, default to
`null`, and record one history entry per keypress.

## Compound components

`Gigatable.Table`, `.Header`, `.Body`, `.Footer`, and `.Cell` support complete
body replacement. `useGigatableContext<TData>()` exposes the table models,
scroll ref, cell state, and cleanup-returning `registerRowScroller`.
`Gigatable.FeatureGuide` lists only interactions enabled on its parent table.

## `<EditableCell>`

Wraps a TanStack cell renderer with double-click and Enter-to-edit behavior.

```tsx
cell: (cell) => <EditableCell {...cell} renderInput={TextInput} />;
```

| Prop          | Type                                                | Description                                        |
| ------------- | --------------------------------------------------- | -------------------------------------------------- |
| `renderInput` | `FunctionComponent<EditableCellInputProps<TValue>>` | Input component rendered while the cell is editing |

## Keyboard shortcuts

| Shortcut                   | Action                         |
| -------------------------- | ------------------------------ |
| Click                      | Select cell                    |
| Drag or Shift+Click        | Extend range selection         |
| Arrow keys                 | Move selected cell             |
| Shift+Arrow                | Extend selected range          |
| Ctrl/Cmd+C                 | Copy selected range as TSV     |
| Ctrl/Cmd+V                 | Paste TSV at the selected cell |
| Enter                      | Enter edit mode or commit edit |
| Tab                        | Commit edit and move focus     |
| Escape                     | Cancel edit                    |
| Ctrl/Cmd+Z                 | Undo                           |
| Ctrl/Cmd+Shift+Z           | Redo                           |
| Drag header border         | Resize column                  |
| Double-click header border | Reset column width             |
