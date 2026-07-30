# Hooks & Context

Gigatable exports advanced primitives for custom rendering and editors.

## `useGigatableContext<TData>()`

Returns the active table, row model, visible leaf columns, scroll ref, selection, feature flags, table styles, cell-state resolver, and row-scroller registration.

The hook throws outside `<Gigatable>`.

## `GigatableCellState`

| Field                 | Type          |
| --------------------- | ------------- |
| `isSelected`          | `boolean`     |
| `isInRange`           | `boolean`     |
| `isEditable`          | `boolean`     |
| `isFillAnchor`        | `boolean`     |
| `isFillRange`         | `boolean`     |
| `isFillSource`        | `boolean`     |
| `fillPreviewValue`    | `unknown`     |
| `fillHandleMouseDown` | mouse handler |
| `pasteBackground`     | `string`      |
| `pasteShadow`         | `string`      |
| `pasteTransition`     | `boolean`     |
| `cellRef`             | ref callback  |

## `useQuickEdit(options)`

Accepts `enabled`, `inputRef`, `isEditing`, and `startEditing`. It returns `wrapperRef`, `onMouseDown`, and `onClickCapture`.

## `GigatableFeatures`

The context reports enabled cell selection, range selection, quick edit, history, paste, fill, fill direction, column resizing, and clearing.

## `GigatableRowScroller`

```ts
type GigatableRowScroller = (
  rowIndex: number,
  behavior: "auto" | "smooth",
  align: "start" | "end" | "auto",
) => void;
```

Register a scroller when a custom virtualizer owns the body.

## `Gigatable.FeatureGuide`

The compound component renders user-facing descriptions for enabled feature flags. Style or position it anywhere inside the parent `Gigatable`.
