# Virtualization & Performance

The stock renderer virtualizes rows with TanStack Virtual. Only the visible window plus a small overscan is mounted.

## What Is Virtualized

Rows are virtualized; headers and visible columns remain mounted. The scroll container height is controlled by `--gt-table-height`, while row height comes from the active theme.

```tsx
<div style={{ "--gt-table-height": "560px" } as React.CSSProperties}>
  <Gigatable table={table} />
</div>
```

## Stable Inputs

Keep `columns` and `data` references stable unless their contents change. Gigatable synchronizes a new data reference into internal state.

```tsx
const columns = useMemo<ColumnDef<Row>[]>(() => createColumns(), []);
```

Avoid expensive cell render work. Format values before rendering or memoize domain-heavy display components.

## Row Height

Virtual measurements use `theme.row.height`. Keep the value aligned with the actual row layout.

```tsx
<Gigatable table={table} theme={{ row: { height: 36 } }} />
```

## Large Data Sets

- Use stable row IDs through TanStack’s `getRowId` when rows can reorder.
- Prefer accessor keys for mutable cells.
- Keep controlled TanStack state focused on what the UI needs.
- Use `"onEnd"` resizing if live width changes are expensive.
- Avoid mounting complex editors until a cell enters edit mode.

## Custom Virtualizers

Compound rendering can provide its own virtualized body. Call `registerRowScroller` from `useGigatableContext` so off-screen keyboard navigation can request a row.

```tsx
const { registerRowScroller } = useGigatableContext<Row>();

useEffect(
  () =>
    registerRowScroller((index, behavior, align) => {
      virtualizer.scrollToIndex(index, { behavior, align });
    }),
  [registerRowScroller, virtualizer],
);
```

Return the cleanup function from the effect.

## Bundle Behavior

The demo data and Mermaid renderer are route-split from the landing page. Keep optional documentation and visualization dependencies behind lazy routes or dynamic imports.
