# Clipboard & Paste

Gigatable copies and pastes tab-separated values so selections round-trip through Excel, Google Sheets, and text editors.

Want the interaction model and a live example first? See [React Data Grid with Excel Copy and Paste](/features/excel-copy-paste/), then use this guide for the implementation details.

## Enable Clipboard Workflows

Copy is available when cell selection is enabled. Paste also needs the handler returned by `useGigatable`.

```tsx
const { table, paste } = useGigatable({ columns, data });

<Gigatable
  table={table}
  allowCellSelection
  allowRangeSelection
  allowPaste
  paste={paste}
/>;
```

## Copy Behavior

Ctrl/Cmd+C serializes the selected rectangle in visible row and column order. Newlines separate rows and tabs separate columns.

## External and Internal Paste

External paste starts at the selected cell and advances across visible columns. Internal paste can preserve copied column IDs even if the destination selection starts elsewhere.

```tsx
<Gigatable
  table={table}
  allowCellSelection
  allowPaste
  paste={paste}
  pasteByColumnId
/>
```

Set `pasteByColumnId={false}` to always paste positionally.

## Repeat Into a Selected Range

When the selected range is larger than the clipboard matrix, Gigatable repeats the source pattern to fill the range. A `1 × 1` value fills every editable target; a multi-cell pattern repeats by row and column.

## Parse Domain Values

Clipboard values begin as strings. Convert them per column with metadata.

```tsx
meta: {
  editable: true,
  parsePastedValue: (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  },
}
```

## Inspect Changes

`onPasteComplete` receives the old and new value for every changed cell.

```tsx
<Gigatable
  table={table}
  allowCellSelection
  allowPaste
  paste={paste}
  onPasteComplete={(result) => {
    console.info(`${result.totalChanges} cells changed`, result.changes);
  }}
/>
```

Each `CellChange` includes `rowIndex`, `rowId`, `columnId`, `columnHeader`, `oldValue`, and `newValue`.

## Boundaries and History

- Values outside available rows or columns are ignored.
- Read-only columns remain unchanged.
- A paste with no changes does not create new data.
- With history enabled, the entire paste is a single undo step.

> [!TIP]
> Validate domain-specific values in `parsePastedValue` rather than parsing after `onPasteComplete`; the parser controls what reaches table state.
