# Fill Handle

The fill handle repeats the selected value into editable cells while previewing the result.

## Enable Vertical Fill

```tsx
const { table, applyFill } = useGigatable({ columns, data });

<Gigatable
  table={table}
  allowCellSelection
  allowFillHandle
  applyFill={applyFill}
/>;
```

Vertical fill is the default. Drag the handle above or below the source.

## Enable Horizontal or Two-Axis Fill

```tsx
const { table, applyFill, applyHorizontalFill } = useGigatable({
  columns,
  data,
});

<Gigatable
  table={table}
  allowCellSelection
  allowFillHandle
  fillDirection="both"
  applyFill={applyFill}
  applyHorizontalFill={applyHorizontalFill}
/>;
```

`fillDirection` accepts `"vertical"`, `"horizontal"`, or `"both"`. Horizontal fill requires `applyHorizontalFill`.

## Column Eligibility

Editable columns participate by default. Opt a column out with:

```tsx
meta: {
  editable: true,
  allowFill: false,
}
```

Horizontal drag skips ineligible and read-only columns.

## Preview Formatting

The transient preview uses the source value. Format it without changing stored data:

```tsx
meta: {
  editable: true,
  formatFillPreview: (value) => `${Number(value).toFixed(1)}%`,
}
```

## Range Sources

A selected range can act as the fill source. Gigatable determines the drag axis from pointer movement, locks that axis for the gesture, and applies eligible targets when the pointer is released.

## History and Cancellation

The completed fill is one history entry. Leaving the valid table region or ending without eligible targets produces no mutation.
