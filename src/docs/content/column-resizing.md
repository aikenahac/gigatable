---
title: "Column Resizing"
description: "Enable draggable TanStack column resizing, reset widths and persist controlled column-sizing state with Gigatable."
summary: "Enable resizing and persist TanStack column sizing state."
seoTitle: "Resizable React Data Grid Columns | Gigatable"
seoDescription: "Enable draggable TanStack column resizing, reset widths and persist controlled column-sizing state with Gigatable."
section: "guides"
sectionTitle: "Guides"
keywords: ["resize","width","columnSizing","persist"]
audience: "consumer"
---

# Column Resizing

Gigatable renders resize handles around TanStack Table’s column sizing state.

## Enable Resizing

```tsx
const { table } = useGigatable({
  columns,
  data,
  enableColumnResizing: true,
  columnResizeMode: "onChange",
});

<Gigatable table={table} allowColumnResizing />;
```

`enableColumnResizing` lets TanStack create handlers. `allowColumnResizing` displays Gigatable’s header-edge controls.

## Interaction

- Drag a visible header edge to resize.
- Double-click the edge to reset the column to its definition size.
- Touch dragging uses TanStack’s touch handler.
- Columns with `enableResizing: false` do not render a handle.

## Persist Widths

Control TanStack’s `columnSizing` state and save it in application state or storage.

```tsx
const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

const { table } = useGigatable({
  columns,
  data,
  enableColumnResizing: true,
  columnResizeMode: "onChange",
  state: { columnSizing },
  onColumnSizingChange: setColumnSizing,
});
```

Persist the object only after validating that saved column IDs still exist in the current schema.

## Resize Modes

`"onChange"` updates widths during drag and gives immediate feedback. `"onEnd"` updates after release and can reduce work for expensive custom cell renderers.

## Direction

TanStack’s `columnResizeDirection` controls logical direction. Gigatable uses it when positioning and styling the resize handle.
