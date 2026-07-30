# Selection & Navigation

Selection is the foundation for clipboard, fill, clearing, and keyboard editing.

## Single-Cell Selection

```tsx
<Gigatable table={table} allowCellSelection />
```

Click selects a cell. Arrow keys move through visible rows and columns, Tab moves horizontally, and Ctrl/Cmd+Home or Ctrl/Cmd+End jumps to the first or last visible cell.

## Rectangular Ranges

```tsx
<Gigatable table={table} allowCellSelection allowRangeSelection />
```

Drag between cells, Shift+click, or hold Shift while pressing Arrow keys. The anchor remains stable while the range endpoint moves.

## Single-Column Ranges

Use constrained ranges for workflows where cross-column editing would be unsafe.

```tsx
<Gigatable table={table} allowCellSelection singleColumnCellSelection />
```

`singleColumnCellSelection` works when `allowRangeSelection` is false. Dragging or Shift+Arrow stays in the anchor column.

## Selection and Editing

- Enter starts editing the selected editable cell.
- Delete or Backspace clears editable cells in the selection.
- Copy serializes the selected rectangle as TSV.
- Paste begins at the active cell or repeats into a larger selected range.
- The fill handle uses the active cell or range boundary as its source.

Read-only cells can still be selected and copied. Mutating operations skip columns that are not editable.

## Virtualized Navigation

Keyboard navigation can move to rows that are not mounted. The stock renderer asks TanStack Virtual to scroll the target row into view before focusing it. Custom virtualizers should register a row scroller through `useGigatableContext`.

## Accessibility

Gigatable cells are focusable and expose native table semantics. Keep interactive controls inside cells keyboard-operable and avoid stopping navigation keys unless the editor needs their native behavior.
