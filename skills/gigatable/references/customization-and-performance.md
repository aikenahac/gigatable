# Customization and Performance

## Theme the stock renderer

Use a built-in preset or a partial typed override:

```tsx
import { Gigatable, themes } from "./gigatable";

<Gigatable table={table} theme={themes.dark} />;

<Gigatable
  table={table}
  theme={{
    row: { height: "36px" },
    selection: { outline: "#2563eb" },
  }}
/>;
```

Current built-ins are `themes.light`, `themes.dark`, `themes.minimal`, and `themes.giga`. Confirm against the installed `theme/presets` barrel before using one.

Theme groups include `header`, `row`, `cell`, `selection`, `paste`, and `fill`. CSS variables prefixed with `--gt-` can override resolved values at a containing element. Keep `theme.row.height` aligned with actual row layout because the virtualizer derives measurements from it.

## Compose the renderer

Use compound parts when the stock virtualized table is insufficient:

```tsx
<Gigatable table={table} allowCellSelection>
  <Gigatable.Table>
    <Gigatable.Header />
    <Gigatable.Body>
      {table.getRowModel().rows.map((row) => (
        <Table.Row key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <Gigatable.Cell key={cell.id} cell={cell} />
          ))}
        </Table.Row>
      ))}
    </Gigatable.Body>
  </Gigatable.Table>
</Gigatable>
```

Available compound parts are `Table`, `Header`, `Body`, `Footer`, `Cell`, and `FeatureGuide`. Keep `Gigatable.Cell` as the data-cell boundary so selection state, refs, metadata classes, fill previews, and paste highlights remain connected.

Custom bodies own empty and loading states. Use `containerRef` for scroll-container access and `tableStyle` for compound table styling.

## Use context only when needed

Call `useGigatableContext<TData>()` below `Gigatable` to access the table, rows, visible columns, selection, enabled features, `getCellState`, scroll container, and row-scroller registration. Prefer compound parts for ordinary customization.

Register a custom virtualizer for off-screen keyboard navigation:

```tsx
const { registerRowScroller } = useGigatableContext<Row>();

useEffect(
  () =>
    registerRowScroller((rowIndex, behavior, align) => {
      virtualizer.scrollToIndex(rowIndex, { behavior, align });
    }),
  [registerRowScroller, virtualizer],
);
```

Return the registration cleanup. Keep one active scroller.

Use `useQuickEdit` only when a custom viewing renderer must transfer an Alt/Option-selected text range into an input or textarea.

## Keep large tables fast

- Keep `columns` and `data` references stable.
- Supply a stable TanStack `getRowId` when rows reorder.
- Prefer accessor keys for mutable values.
- Avoid expensive formatting in mounted cells; memoize domain-heavy views.
- Mount complex inputs only while editing.
- Keep controlled TanStack state limited to product needs.
- Use `"onEnd"` resizing when live width updates are costly.
- Preserve row virtualization in custom bodies and register their row scroller.

The stock renderer virtualizes rows while headers and visible columns remain mounted.

## Preserve accessibility

- Retain native table structure and focusable cells.
- Give custom editors accessible labels and visible focus.
- Forward editor keyboard bindings instead of swallowing navigation keys.
- Do not place unrelated table markup outside `Gigatable.Cell` if spreadsheet interactions must continue to work.
- Verify keyboard access across selected, editing, read-only, and off-screen cells.
