# API Reference

Confirm exact signatures against the installed barrel and source before coding.

## Public values

```ts
Gigatable;
EditableCell;
useGigatable;
useGigatableContext;
useQuickEdit;
themes;
```

## Public types

```ts
GigatableProps;
UseGigatableProps;
CellChange;
PasteResult;
CellCoordinates;
Selection;
CopyBuffer;
EditableCellInputProps;
GigatableCellState;
GigatableContextValue;
GigatableFeatures;
GigatableRowScroller;
QuickEditBindings;
UseQuickEditOptions;
FillDirection;
GigatableTheme;
```

## `useGigatable`

It accepts all TanStack `TableOptions<TData>` except `getCoreRowModel`, which the hook supplies, plus:

| Option           | Default  | Meaning                           |
| ---------------- | -------- | --------------------------------- |
| `columns`        | required | TanStack column definitions       |
| `data`           | required | Initial and synchronized row data |
| `history`        | `false`  | Track mutations for undo/redo     |
| `maxHistorySize` | `20`     | Maximum retained undo entries     |

Current return values:

| Field                 | Meaning                                        |
| --------------------- | ---------------------------------------------- |
| `table`               | TanStack table instance                        |
| `paste`               | Apply TSV and return `PasteResult`             |
| `applyFill`           | Fill target row indices in one column          |
| `applyHorizontalFill` | Fill target column IDs in one row              |
| `clearCells`          | Clear explicit row-index/column-ID coordinates |
| `undo`, `redo`        | Traverse history                               |
| `clear`               | Discard undo and redo stacks                   |
| `reset`               | Establish a new history baseline               |
| `canUndo`, `canRedo`  | History availability                           |

## `Gigatable` props

The only required prop is the `table` returned by `useGigatable`.

| Prop                        | Default / requirement                      |
| --------------------------- | ------------------------------------------ |
| `allowCellSelection`        | `false`                                    |
| `allowRangeSelection`       | `false`; requires cell selection           |
| `singleColumnCellSelection` | `false`; use instead of rectangular ranges |
| `allowQuickEdit`            | `false`                                    |
| `allowHistory`              | `false`; pass `undo` and `redo`            |
| `allowPaste`                | `false`; pass `paste`                      |
| `pasteByColumnId`           | `true`                                     |
| `allowFillHandle`           | `false`; pass the needed fill handlers     |
| `fillDirection`             | `"vertical"`                               |
| `allowColumnResizing`       | `false`; enable TanStack resizing too      |
| `allColumnsEditable`        | `false`                                    |
| `onPasteComplete`           | optional paste summary callback            |
| `theme`                     | light preset when omitted                  |
| `children`                  | stock virtualized renderer when omitted    |
| `containerRef`              | optional scroll-container ref              |
| `tableStyle`                | optional compound-mode table styles        |

## `EditableCellInputProps<TValue>`

```ts
interface EditableCellInputProps<TValue> {
  value: TValue;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onBlur: () => void;
  onValueChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  cancelEditing: () => void;
  className?: string;
}
```

## Paste result

```ts
interface PasteResult {
  changes: CellChange[];
  totalChanges: number;
}

interface CellChange {
  rowIndex: number;
  rowId: string;
  columnId: string;
  columnHeader: string;
  oldValue: unknown;
  newValue: unknown;
}
```

## Column metadata

```ts
interface ColumnMeta<TData, TValue> {
  editable?: boolean;
  allowFill?: boolean;
  parsePastedValue?: (value: string, cell: Cell<TData, TValue>) => unknown;
  getClearedValue?: (cell: Cell<TData, TValue>) => unknown;
  formatFillPreview?: (value: unknown, cell: Cell<TData, TValue>) => string;
  getCellClassName?: (cell: Cell<TData, TValue>) => string | undefined;
}
```
