# Spreadsheet Features

## Wire features and handlers together

Selection is the foundation for editing, clipboard, fill, and clearing. Enable only the behaviors the product needs:

```tsx
const { table, paste, applyFill, applyHorizontalFill, undo, redo } =
  useGigatable({
    columns,
    data,
    history: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  });

<Gigatable
  table={table}
  allowCellSelection
  allowRangeSelection
  allowQuickEdit
  allowPaste
  paste={paste}
  allowFillHandle
  fillDirection="both"
  applyFill={applyFill}
  applyHorizontalFill={applyHorizontalFill}
  allowHistory
  undo={undo}
  redo={redo}
  allowColumnResizing
/>;
```

Required pairings:

| Behavior                 | Configuration                                                                           |
| ------------------------ | --------------------------------------------------------------------------------------- |
| Cell navigation and copy | `allowCellSelection`                                                                    |
| Rectangular ranges       | `allowCellSelection` + `allowRangeSelection`                                            |
| Single-column ranges     | `allowCellSelection` + `singleColumnCellSelection`, without rectangular ranges          |
| Paste                    | `allowCellSelection` + `allowPaste` + `paste`                                           |
| Vertical fill            | selection + `allowFillHandle` + `applyFill`                                             |
| Horizontal fill          | selection + `allowFillHandle` + horizontal/both `fillDirection` + `applyHorizontalFill` |
| History shortcuts        | hook `history: true` + `allowHistory` + `undo` + `redo`                                 |
| Resizing                 | hook `enableColumnResizing` + component `allowColumnResizing`                           |

Mutations skip columns that are not editable.

## Selection

- Click selects one cell.
- Drag, Shift+click, or Shift+Arrow extends an enabled range.
- `singleColumnCellSelection` constrains ranges to the anchor column and is intended to replace, not accompany, rectangular range selection.
- Arrow keys and Tab navigate visible rows and columns.
- Ctrl/Cmd+Home and Ctrl/Cmd+End jump to the first or last visible cell.
- Off-screen navigation asks the registered row virtualizer to scroll before focusing.

## Clipboard

Copy serializes the selected rectangle as tab-separated rows in visible row and column order. Paste begins at the active cell, skips non-editable columns, and can repeat smaller clipboard data into a larger selected range.

Use `meta.parsePastedValue` for non-string domain values. `onPasteComplete` receives:

```ts
interface PasteResult {
  changes: CellChange[];
  totalChanges: number;
}
```

`pasteByColumnId` defaults to `true` and preserves column identities for internal Gigatable copies. Disable it when positional pasting is explicitly preferred.

## Fill and clearing

The fill handle repeats source values; it does not infer numeric or date series. `fillDirection` accepts `"vertical"`, `"horizontal"`, or `"both"` and defaults to `"vertical"`.

Set `meta.allowFill: false` to exclude a mutable column. Set `meta.formatFillPreview` when the stored value needs display formatting.

Delete or Backspace clears editable selected cells. The default cleared value is `null`; override it with `meta.getClearedValue`.

## History

History groups each edit, paste, fill, or multi-cell clear into one undo entry. The default maximum is 20; pass `maxHistorySize` to change it. Use `clear` to discard undo/redo stacks and `reset(nextData)` to establish a new baseline when those functions exist in the installed version.

## Resizing

Enable TanStack resizing in `useGigatable` and header handles on `Gigatable`. Use controlled `columnSizing` state to persist widths. Prefer `columnResizeMode: "onEnd"` when live resizing is too expensive.

## Keyboard and pointer checks

| Input                           | Expected result                        |
| ------------------------------- | -------------------------------------- |
| Enter                           | Start editing, or commit and move down |
| Tab / Shift+Tab                 | Commit and move horizontally           |
| Escape                          | Cancel editing                         |
| Ctrl/Cmd+C and V                | Copy/paste TSV                         |
| Ctrl/Cmd+Z / Ctrl/Cmd+Shift+Z   | Undo/redo                              |
| Delete / Backspace              | Clear editable selection               |
| Drag fill handle                | Repeat source values                   |
| Drag / double-click header edge | Resize / reset width                   |
