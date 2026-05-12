# API Reference

Gigatable exposes a small public API from the local `./gigatable` barrel file copied by the CLI.

## `useGigatable(options)`

Creates a TanStack Table instance and mutation handlers for paste, fill, editing, undo, and redo.

```tsx
const { table, paste, applyFill, undo, redo, clear, canUndo, canRedo } =
  useGigatable({
    columns,
    data,
    history: true,
    maxHistorySize: 50,
  });
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `Array<ColumnDef<TData, TValue>>` | required | TanStack column definitions |
| `data` | `Array<TData>` | required | Initial row data, synced when the array reference changes |
| `history` | `boolean` | `false` | Enables undo/redo state tracking |
| `maxHistorySize` | `number` | `20` | Maximum undo steps retained |

## `<Gigatable>`

Renders the virtualized table UI.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `table` | `Table<TData>` | required | Table instance returned by `useGigatable` |
| `allowCellSelection` | `boolean` | `false` | Enables click selection and arrow-key navigation |
| `allowRangeSelection` | `boolean` | `false` | Enables drag and Shift+Arrow range selection |
| `allowHistory` | `boolean` | `false` | Enables undo and redo keyboard shortcuts |
| `allowPaste` | `boolean` | `false` | Enables TSV paste from the clipboard |
| `allowFillHandle` | `boolean` | `false` | Enables drag-fill behavior for editable columns |
| `paste` | `Function` | none | Handler returned by `useGigatable` |
| `applyFill` | `Function` | none | Handler returned by `useGigatable` |
| `undo` | `() => void` | none | Undo handler returned by `useGigatable` |
| `redo` | `() => void` | none | Redo handler returned by `useGigatable` |
| `onPasteComplete` | `(result: PasteResult) => void` | none | Called after paste changes are applied |
| `theme` | `GigatableTheme` | `themes.light` | Visual token overrides |
| `allColumnsEditable` | `boolean` | `false` | Treats every column as editable with the default text input |

## `<EditableCell>`

Wraps a TanStack cell renderer with double-click and Enter-to-edit behavior.

```tsx
cell: (cell) => <EditableCell {...cell} renderInput={TextInput} />
```

| Prop | Type | Description |
| --- | --- | --- |
| `renderInput` | `FunctionComponent<EditableCellInputProps<TValue>>` | Input component rendered while the cell is editing |

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| Click | Select cell |
| Drag or Shift+Click | Extend range selection |
| Arrow keys | Move selected cell |
| Shift+Arrow | Extend selected range |
| Ctrl/Cmd+C | Copy selected range as TSV |
| Ctrl/Cmd+V | Paste TSV at the selected cell |
| Enter | Enter edit mode or commit edit |
| Tab | Commit edit and move focus |
| Escape | Cancel edit |
| Ctrl/Cmd+Z | Undo |
| Ctrl/Cmd+Shift+Z | Redo |
