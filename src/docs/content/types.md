# Types

Gigatable exports the public types needed to wire custom tables, inputs, themes, and paste handlers.

## `GigatableProps<TData>`

Props accepted by `<Gigatable>`. The only required prop is the TanStack `table` instance from `useGigatable`; optional feature props enable selection, paste, fill, history, theming, and callbacks.

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
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: () => void;
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

Gigatable augments TanStack Table column metadata with `editable?: boolean`.

```ts
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    editable?: boolean;
  }
}
```

Include `src/gigatable/types/react-table.ts` in `tsconfig.json` so TypeScript recognizes the field.
