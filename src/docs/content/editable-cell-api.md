# EditableCell

`EditableCell` wraps a TanStack cell context with view/edit state and keyboard commit behavior.

## Usage

```tsx
{
  accessorKey: "name",
  header: "Name",
  cell: (cell) => <EditableCell {...cell} renderInput={TextInput} />,
  meta: { editable: true },
}
```

## Prop

| Prop          | Type                                                | Description                  |
| ------------- | --------------------------------------------------- | ---------------------------- |
| `renderInput` | `FunctionComponent<EditableCellInputProps<TValue>>` | Editor rendered while active |

TanStack cell context props are supplied by spreading the cell renderer argument.

## Editor Bindings

| Field           | Description                              |
| --------------- | ---------------------------------------- |
| `value`         | Current typed value                      |
| `onChange`      | Standard input/select change handler     |
| `onValueChange` | String value adapter for custom controls |
| `onBlur`        | Commit on blur                           |
| `onKeyDown`     | Enter, Tab, and Escape behavior          |
| `cancelEditing` | Restore the original value               |
| `className`     | Gigatable editor class                   |

## Behavior

- Double-click enters edit mode.
- Enter on a selected editable cell enters edit mode.
- Enter commits and requests the next row.
- Tab commits and requests the next or previous visible cell.
- Escape cancels.
- Blur commits.
- Quick-edit bindings can select a substring before the editor opens.

## Metadata Requirement

Always pair `EditableCell` with `meta: { editable: true }`. The component controls the editor UI; the metadata enables mutating table behaviors.
