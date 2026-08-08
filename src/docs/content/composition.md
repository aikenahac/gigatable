---
title: "Compound Composition"
description: "Replace Gigatable table, header, body, footer or cell rendering while retaining selection, editing and virtualization behavior."
summary: "Replace table layers while retaining Gigatable behavior."
seoTitle: "Compose a Custom React Data Grid | Gigatable"
seoDescription: "Replace Gigatable table, header, body, footer or cell rendering while retaining selection, editing and virtualization behavior."
section: "customization"
sectionTitle: "Customization"
keywords: ["compound","custom body","footer","cell","children"]
audience: "consumer"
---

# Compound Composition

Gigatable’s compound components replace rendering layers while retaining selection, paste, fill, clearing, resizing, and keyboard behavior.

## Available Parts

```tsx
<Gigatable table={table} allowCellSelection>
  <Gigatable.Table>
    <Gigatable.Header />
    <Gigatable.Body />
    <Gigatable.Footer />
  </Gigatable.Table>
</Gigatable>
```

- `Gigatable.Table` merges the parent `tableStyle` with local styles.
- `Gigatable.Header` renders TanStack header groups and optional resize handles.
- `Gigatable.Body` renders rows and an empty state.
- `Gigatable.Footer` renders configured footer groups.
- `Gigatable.Cell` applies interaction state to a specific TanStack cell.
- `Gigatable.FeatureGuide` lists only enabled interactions.

## Custom Cell Content

```tsx
<Gigatable.Cell cell={cell}>
  {(state) => (
    <span data-selected={state.isSelected || undefined}>
      {String(cell.getValue())}
    </span>
  )}
</Gigatable.Cell>
```

The render function receives selection, fill, paste, editability, preview, and ref state. Keep `Gigatable.Cell` as the native data-cell boundary so delegated interactions continue to work.

## Custom Body

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

## Container and Table Styles

Use `containerRef` to observe or control the scroll container and `tableStyle` to supply base styles in compound mode.

```tsx
const containerRef = useRef<HTMLDivElement>(null);

<Gigatable
  table={table}
  containerRef={containerRef}
  tableStyle={{ minWidth: 960 }}
>
  {/* compound table */}
</Gigatable>;
```

## Empty and Loading States

The default body renders “No data.” for an empty row model. Custom bodies own their empty and loading presentation.

> [!WARNING]
> Rendering a completely unrelated table outside `Gigatable.Cell` removes the refs and metadata classes required by spreadsheet interactions.
