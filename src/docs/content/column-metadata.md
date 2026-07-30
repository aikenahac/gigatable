# Column Metadata

Gigatable augments TanStack Table’s `ColumnMeta` with behavior hooks. Include the augmentation file in TypeScript, then configure each column.

## Metadata Reference

| Field               | Type                            | Purpose                                        |
| ------------------- | ------------------------------- | ---------------------------------------------- |
| `editable`          | `boolean`                       | Allows editing, paste, fill, and clearing      |
| `allowFill`         | `boolean`                       | Opts an editable column out of fill when false |
| `parsePastedValue`  | `(value, cell) => unknown`      | Converts clipboard strings                     |
| `getClearedValue`   | `(cell) => unknown`             | Resolves Delete/Backspace values               |
| `formatFillPreview` | `(value, cell) => string`       | Formats transient fill text                    |
| `getCellClassName`  | `(cell) => string \| undefined` | Adds a class to stock or composed cells        |

## Complete Example

```tsx
{
  accessorKey: "score",
  header: "Score",
  cell: (cell) => <EditableCell {...cell} renderInput={ScoreInput} />,
  meta: {
    editable: true,
    allowFill: true,
    parsePastedValue: (value) => Number(value),
    getClearedValue: () => 0,
    formatFillPreview: (value) => `${value} pts`,
    getCellClassName: (cell) =>
      Number(cell.getValue()) >= 90 ? "is-high-score" : undefined,
  },
}
```

## Table Metadata

`useGigatable` merges its mutation methods into any existing TanStack `meta` object:

```ts
table.options.meta?.updateCellData?.(rowIndex, columnId, value);
table.options.meta?.clearCellData?.([{ rowIndex, columnId }]);
```

Your own metadata fields remain available.

## TypeScript Setup

```json
{
  "include": ["src", "src/gigatable/types/react-table.ts"]
}
```

If metadata fields show as unknown, confirm that the copied augmentation file is included by the active `tsconfig.json`.
