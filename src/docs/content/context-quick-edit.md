# Context & Quick Edit

Use the exported context and quick-edit hook when a custom renderer needs Gigatable’s interaction state.

## `useGigatableContext`

The hook must run below `<Gigatable>`.

```tsx
const {
  table,
  rows,
  leafColumns,
  scrollContainerRef,
  selectedCell,
  selection,
  features,
  getCellState,
  registerRowScroller,
} = useGigatableContext<Row>();
```

The context also exposes `allColumnsEditable`, `allowColumnResizing`, and `tableStyle`.

## Cell State

`getCellState(cell)` returns:

- Selection and range booleans.
- Editability and the cell ref callback.
- Fill source, target, preview, and handle bindings.
- Paste highlight background, shadow, and transition state.

Prefer `Gigatable.Cell` unless you need to integrate those values into a specialized renderer.

## Custom Row Scroller

```tsx
useEffect(
  () =>
    registerRowScroller((rowIndex, behavior, align) => {
      virtualizer.scrollToIndex(rowIndex, { behavior, align });
    }),
  [registerRowScroller, virtualizer],
);
```

Registration returns a cleanup function. Only one active scroller should own off-screen navigation.

## `useQuickEdit`

`useQuickEdit` transfers an Alt/Option-dragged text range into a custom input.

```tsx
const bindings = useQuickEdit({
  enabled: allowQuickEdit,
  inputRef,
  isEditing,
  startEditing,
});

return (
  <div
    ref={bindings.wrapperRef}
    onMouseDown={bindings.onMouseDown}
    onClickCapture={bindings.onClickCapture}
  >
    {value}
  </div>
);
```

The viewing wrapper must contain the text being selected. The input ref may point to an `input` or `textarea`.

## Feature Guide

```tsx
<Gigatable table={table} allowCellSelection allowPaste paste={paste}>
  <Gigatable.FeatureGuide className="feature-guide" />
  <Gigatable.Table>
    <Gigatable.Header />
    <Gigatable.Body />
  </Gigatable.Table>
</Gigatable>
```

The guide reflects the parent feature flags, so product help stays synchronized with configuration.
