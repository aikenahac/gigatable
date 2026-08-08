---
title: "History & Clearing"
description: "Track edits, paste, fill and range clearing as undoable history entries and customize cleared values by column."
summary: "Enable undo/redo and customize Delete or Backspace values."
seoTitle: "Undo, Redo and Cell Clearing | Gigatable"
seoDescription: "Track edits, paste, fill and range clearing as undoable history entries and customize cleared values by column."
section: "guides"
sectionTitle: "Guides"
keywords: ["history","undo","redo","clear","delete","backspace"]
audience: "consumer"
---

# History & Clearing

History tracks table mutations from editing, paste, fill, and range clearing.

## Enable Undo and Redo

History has a state layer and a keyboard layer. Enable both.

```tsx
const { table, undo, redo, canUndo, canRedo } = useGigatable({
  columns,
  data,
  history: true,
  maxHistorySize: 50,
});

<Gigatable
  table={table}
  allowCellSelection
  allowHistory
  undo={undo}
  redo={redo}
/>;
```

Ctrl/Cmd+Z calls `undo`. Ctrl/Cmd+Shift+Z calls `redo`.

## History Controls

```tsx
const {
  clear, // Drop past and future entries while retaining current data.
  reset, // Replace current data and reset both stacks.
  canUndo,
  canRedo,
} = useGigatable(options);
```

`maxHistorySize` defaults to `20`.

## Clear Selected Cells

Delete or Backspace clears editable selected cells whenever `allowCellSelection` is enabled. A multi-cell clear is one undo entry.

The default cleared value is `null`. Override it per column:

```tsx
meta: {
  editable: true,
  getClearedValue: () => "",
}
```

The resolver receives the target TanStack cell, so defaults can depend on row or column context.

## Programmatic Clearing

`clearCells` accepts data row indices and column IDs.

```tsx
clearCells([
  { rowIndex: 0, columnId: "name" },
  { rowIndex: 0, columnId: "score" },
]);
```

## Synchronizing New Data

Passing a new `data` array reference replaces the internal data. When history is enabled, Gigatable resets history to that new baseline to prevent undoing into a previous dataset.

> [!NOTE]
> `clear` refers to the history stack. Use `clearCells` to change cell values.
