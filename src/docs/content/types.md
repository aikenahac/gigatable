---
title: "Exported Types"
description: "Reference Gigatable props, hook options, paste results, cell changes, editor input types, themes and TanStack metadata."
summary: "Use Gigatable’s exported TypeScript types."
seoTitle: "Gigatable TypeScript Types | React Data Grid Docs"
seoDescription: "Reference Gigatable props, hook options, paste results, cell changes, editor input types, themes and TanStack metadata."
section: "reference"
sectionTitle: "Reference"
keywords: ["types","typescript","paste result","selection"]
audience: "consumer"
---

# Types

Gigatable exports the public types needed to wire custom tables, inputs, themes, and paste handlers.

## `GigatableProps<TData>`

Props accepted by `<Gigatable>`. The only required prop is the TanStack `table` instance from `useGigatable`; optional feature props enable selection, paste, fill, column resizing, history, theming, and callbacks.

```ts
interface GigatableProps<TData> {
  table: Table<TData>;
  allowColumnResizing?: boolean;
  allowQuickEdit?: boolean;
  pasteByColumnId?: boolean;
  fillDirection?: "vertical" | "horizontal" | "both";
  children?: React.ReactNode;
}
```

`allowColumnResizing` only controls whether Gigatable renders header resize handles. Enable TanStack resizing through `useGigatable` with options such as `enableColumnResizing`, `columnResizeMode`, `state.columnSizing`, and `onColumnSizingChange`.

## `UseGigatableProps<TData, TValue>`

Configuration accepted by `useGigatable`. It extends TanStack Table options except `getCoreRowModel`, which Gigatable provides internally.

```ts
interface UseGigatableProps<TData, TValue>
  extends Omit<TableOptions<TData>, "getCoreRowModel"> {
  columns: Array<ColumnDef<TData, TValue>>;
  data: Array<TData>;
  history?: boolean;
  maxHistorySize?: number;
}
```

## `PasteResult`

Returned by the paste handler and passed to `onPasteComplete`.

```ts
interface PasteResult {
  changes: Array<CellChange>;
  totalChanges: number;
}
```

## `CellChange`

Describes one value changed by paste.

```ts
interface CellChange {
  rowIndex: number;
  rowId: string;
  columnId: string;
  columnHeader: string;
  oldValue: unknown;
  newValue: unknown;
}
```

## `EditableCellInputProps<TValue>`

Props passed into your custom editable input renderer.

```ts
interface EditableCellInputProps<TValue> {
  value: TValue;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onBlur: () => void;
  onDraftChange: (value: TValue) => void;
  commitValue: (value: TValue) => void;
  onValueChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  cancelEditing: () => void;
  className?: string;
}
```

## `GigatableTheme`

Typed theme object grouped by visual area: `header`, `row`, `cell`, `selection`, `paste`, and `fill`.

```ts
import type { GigatableTheme } from "./gigatable";

const theme: GigatableTheme = {
  row: { height: 34 },
  selection: { outline: "#2563eb" },
};
```

## TanStack `ColumnMeta`

Gigatable augments TanStack Table column metadata with reusable editing hooks.

```ts
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    editable?: boolean;
    allowFill?: boolean;
    parsePastedValue?: (value: string, cell: Cell<TData, TValue>) => unknown;
    getClearedValue?: (cell: Cell<TData, TValue>) => unknown;
    formatFillPreview?: (value: unknown, cell: Cell<TData, TValue>) => string;
    getCellClassName?: (cell: Cell<TData, TValue>) => string | undefined;
  }
}
```

Include `src/gigatable/types/react-table.ts` in `tsconfig.json` so TypeScript recognizes the field.

## Composition types

`GigatableCellState`, `GigatableContextValue`, `GigatableFeatures`, and
`GigatableRowScroller` describe the compound rendering API.
`UseQuickEditOptions` and `QuickEditBindings` support custom editors through
the exported `useQuickEdit` hook.
