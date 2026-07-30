# Gigatable

`Gigatable` renders the virtualized grid and coordinates spreadsheet interactions around a TanStack Table instance.

## Required Prop

| Prop    | Type           | Description                               |
| ------- | -------------- | ----------------------------------------- |
| `table` | `Table<TData>` | Table instance returned by `useGigatable` |

## Feature Props

| Prop                        | Type                                   | Default      | Description                               |
| --------------------------- | -------------------------------------- | ------------ | ----------------------------------------- |
| `allowCellSelection`        | `boolean`                              | `false`      | Click selection and keyboard navigation   |
| `allowRangeSelection`       | `boolean`                              | `false`      | Rectangular drag and Shift selection      |
| `singleColumnCellSelection` | `boolean`                              | `false`      | Constrained range selection in one column |
| `allowQuickEdit`            | `boolean`                              | `false`      | Alt/Option-click and partial-text editing |
| `allowHistory`              | `boolean`                              | `false`      | Undo/redo keyboard shortcuts              |
| `allowPaste`                | `boolean`                              | `false`      | Clipboard paste                           |
| `pasteByColumnId`           | `boolean`                              | `true`       | Preserve column IDs for internal paste    |
| `allowFillHandle`           | `boolean`                              | `false`      | Excel-style drag fill                     |
| `fillDirection`             | `"vertical" \| "horizontal" \| "both"` | `"vertical"` | Allowed fill axes                         |
| `allowColumnResizing`       | `boolean`                              | `false`      | Header-edge resize handles                |
| `allColumnsEditable`        | `boolean`                              | `false`      | Default editor for every column           |

## Handler Props

| Prop                  | Type                                 | Required When            |
| --------------------- | ------------------------------------ | ------------------------ |
| `paste`               | `useGigatable().paste`               | `allowPaste`             |
| `onPasteComplete`     | `(result: PasteResult) => void`      | Optional paste reporting |
| `applyFill`           | `useGigatable().applyFill`           | Vertical fill            |
| `applyHorizontalFill` | `useGigatable().applyHorizontalFill` | Horizontal fill          |
| `undo`                | `() => void`                         | `allowHistory`           |
| `redo`                | `() => void`                         | `allowHistory`           |

## Presentation and Composition

| Prop           | Type                        | Default                    | Description                        |
| -------------- | --------------------------- | -------------------------- | ---------------------------------- |
| `theme`        | `GigatableTheme`            | `themes.light`             | Typed visual overrides             |
| `children`     | `ReactNode`                 | Stock virtualized renderer | Compound table content             |
| `containerRef` | `RefObject<HTMLDivElement>` | Internal ref               | Scroll-container ref               |
| `tableStyle`   | `CSSProperties`             | none                       | Base table styles in compound mode |

## Minimal Example

```tsx
const { table } = useGigatable({ columns, data });

<Gigatable table={table} />;
```

## Fully Interactive Example

```tsx
<Gigatable
  table={table}
  allowCellSelection
  allowRangeSelection
  allowQuickEdit
  allowPaste
  paste={paste}
  allowFillHandle
  fillDirection="both"
  applyFill={applyFill}
  applyHorizontalFill={applyHorizontalFill}
  allowHistory
  undo={undo}
  redo={redo}
  allowColumnResizing
  theme={themes.giga}
/>
```

## Compound Exports

`Gigatable.Table`, `.Header`, `.Body`, `.Footer`, `.Cell`, and `.FeatureGuide` are attached to the component.
