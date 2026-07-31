# Editing and Data

## Define editable columns

Pair `EditableCell` with `meta.editable`. The component provides the editor UI; metadata authorizes edit, paste, fill, and clearing behavior.

```tsx
import type { ColumnDef } from "@tanstack/react-table";
import { EditableCell, type EditableCellInputProps } from "./gigatable";

function TextInput({
  value,
  onChange,
  onBlur,
  onKeyDown,
  className,
}: EditableCellInputProps<string>) {
  return (
    <input
      autoFocus
      value={value ?? ""}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className={className}
    />
  );
}

const columns: ColumnDef<Person>[] = [
  { accessorKey: "id", header: "ID" },
  {
    accessorKey: "name",
    header: "Name",
    cell: (cell) => <EditableCell {...cell} renderInput={TextInput} />,
    meta: { editable: true },
  },
];
```

Always forward `onBlur` and `onKeyDown` for native inline inputs. Use
`cancelEditing` for editor-specific cancellation, `onDraftChange` for typed
drafts, and `commitValue` for typed commits. `onValueChange` is retained as the
legacy immediate string-commit adapter.

## Handle typed values

Clipboard values arrive as strings unless converted. Configure `parsePastedValue` for non-string columns and use metadata to keep clearing and previews consistent:

```tsx
const scoreColumn: ColumnDef<Person> = {
  accessorKey: "score",
  header: "Score",
  cell: (cell) => <EditableCell {...cell} renderInput={ScoreInput} />,
  meta: {
    editable: true,
    parsePastedValue: (value) => Number(value),
    getClearedValue: () => 0,
    formatFillPreview: (value) => `${value} pts`,
  },
};
```

`onDraftChange` and `commitValue` preserve numbers, dates, and domain values
without string casts. `parsePastedValue` remains responsible for converting
clipboard text into the same stored type.

## Use column metadata

The installed TanStack augmentation provides:

| Field               | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `editable`          | Enable mutations for the column                    |
| `allowFill`         | Opt an editable column out of fill when `false`    |
| `parsePastedValue`  | Convert clipboard text before storage              |
| `getClearedValue`   | Resolve Delete/Backspace values; default is `null` |
| `formatFillPreview` | Format the transient fill preview                  |
| `getCellClassName`  | Add a class in stock or composed cells             |

Use flat accessor keys for mutable cells. The default mutation methods shallow-clone a row and assign `row[columnId]`; nested accessor paths require an application-specific mutation adapter.

## Understand data ownership

`useGigatable` owns an internal array used by the table:

- it shallow-clones only rows whose values change;
- no-op mutations retain the previous array;
- a new incoming `data` reference synchronizes the table;
- when history is enabled, a new incoming `data` reference resets the history baseline;
- existing TanStack `meta` fields are preserved while Gigatable adds `updateCellData` and `clearCellData`.

Keep the incoming `data` reference stable until the application truly replaces its data. If external persistence is required, inspect the installed hook for the available callback surface and add an explicit application integration rather than assuming internal edits mutate the original array.

## Editing lifecycle

- Single-click selects without editing.
- Double-click or Enter starts an editable selected cell.
- Enter commits and moves down.
- Tab or Shift+Tab commits and traverses visible cells.
- Escape restores the original value.
- Blur commits.
- Alt/Option-click or drag uses quick edit only when `allowQuickEdit` is enabled.
