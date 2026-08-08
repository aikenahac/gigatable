---
title: "Columns & Editing"
description: "Define typed TanStack columns, custom cell editors, editable metadata, commit behavior and controlled data updates with Gigatable."
summary: "Define typed columns, editable cells, and commit behavior."
seoTitle: "Editable React Data Grid Cells and Columns | Gigatable"
seoDescription: "Define typed TanStack columns, custom cell editors, editable metadata, commit behavior and controlled data updates with Gigatable."
section: "guides"
sectionTitle: "Guides"
keywords: ["columns","editable","input","cell","allColumnsEditable"]
audience: "consumer"
---

# Columns & Editing

Gigatable uses TanStack Table `ColumnDef` objects. A column becomes editable when its cell renderer uses `EditableCell` and its metadata contains `editable: true`.

For a complete implementation path—from TanStack’s headless model through selection, mutation history, and virtualization—read [Build an Editable Data Grid with TanStack Table](/guides/editable-tanstack-table/).

## Read-Only and Editable Columns

```tsx
const columns: ColumnDef<Row>[] = [
  { accessorKey: "id", header: "ID", size: 96 },
  {
    accessorKey: "name",
    header: "Name",
    size: 200,
    cell: (cell) => <EditableCell {...cell} renderInput={TextInput} />,
    meta: { editable: true },
  },
];
```

The metadata flag is the behavior contract used by paste, fill, clearing, and keyboard editing. A custom `cell` renderer without `meta.editable` remains read-only to Gigatable.

## Editing Lifecycle

- Single-click selects without starting an editor.
- Double-click or press Enter on a selected editable cell to start.
- Alt/Option-click starts quick edit when `allowQuickEdit` is enabled.
- Enter commits and moves down.
- Tab or Shift+Tab commits and traverses visible cells.
- Escape cancels without changing the value.
- Blur commits the editor’s current value.

## Make Every Column Editable

Set `allColumnsEditable` to wrap columns without explicit editable metadata in Gigatable’s default text editor.

```tsx
<Gigatable table={table} allColumnsEditable />
```

Columns that already render `EditableCell` keep their custom editor. This is useful for admin tools or generated schemas, but explicit metadata gives better parsing and input control.

## Numeric and Select Editors

Use `onDraftChange` when an editor returns a typed value without a DOM change
event. Call `commitValue` when a custom control has an explicit commit action.
`onValueChange` remains the legacy immediate string-commit adapter.

```tsx
function ScoreInput({
  value,
  onDraftChange,
  onBlur,
  onKeyDown,
}: EditableCellInputProps<number>) {
  return (
    <input
      aria-label="Score"
      type="number"
      inputMode="numeric"
      value={value ?? 0}
      onChange={(event) => onDraftChange(Number(event.target.value))}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    />
  );
}
```

Pair numeric inputs with `meta.parsePastedValue` so pasted strings enter your data model as numbers.

## Controlled Application Data

`useGigatable` owns an internal data array and synchronizes when the `data` reference changes. Pass a new array reference to replace the table data. Cell updates are exposed through `table.options.meta.updateCellData`.

> [!NOTE]
> Gigatable’s mutation helpers update shallow row objects by accessor key. Use flat accessor keys for editable values or adapt the installed source for nested domain models.

## Troubleshooting

| Symptom                              | Check                                                          |
| ------------------------------------ | -------------------------------------------------------------- |
| Enter does not open the editor       | The cell must be selected and the column must be editable      |
| Paste skips custom conversion        | Add `meta.parsePastedValue`                                    |
| Fill handle does not appear          | Enable selection, fill, and provide the fill handlers          |
| Custom input loses keyboard behavior | Forward `onBlur` and `onKeyDown` from `EditableCellInputProps` |
