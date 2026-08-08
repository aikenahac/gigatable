---
title: "Custom Inputs"
description: "Build text, numeric, select and domain-specific editors with typed values, cancellation, focus and keyboard commit behavior."
summary: "Build text, numeric, select, and domain-specific editors."
seoTitle: "Custom React Data Grid Cell Editors | Gigatable"
seoDescription: "Build text, numeric, select and domain-specific editors with typed values, cancellation, focus and keyboard commit behavior."
section: "customization"
sectionTitle: "Customization"
keywords: ["input","editor","select","number","onValueChange"]
audience: "consumer"
---

# Custom Inputs

`EditableCell` delegates the editing UI to `renderInput`. The renderer receives the current value and all commit, cancel, and keyboard bindings.

Gigatable core does not ship domain-specific cell components. It keeps the
basic text-editing path; your application supplies specialized cell UI. Run
`npx gigatable add cells` for optional, dependency-free source containing
starter select, date, number, badge, progress, popover, and dialog cells. See
[Optional Cells](/docs/optional-cells) for installation, component APIs, and
typed examples.

The optional `SelectCell` opens a custom listbox as soon as edit mode starts.
Arrow keys, Home, End, typeahead, Enter, Escape, and pointer selection work
without opening a second native control. `DateCell` follows the same activation
contract with a dependency-free calendar grid supporting day, week, and month
keyboard navigation. Neither component depends on shadcn/ui or its theme tokens.
`NumberCell` keeps its numeric value visible beside an active slider. Pass the
same semantic `tone` used by the view renderer, plus an optional `suffix`, so
editing and display states retain one visual language.

## Input Contract

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

Forward `onBlur` and `onKeyDown` so Enter, Tab, Escape, and blur follow the standard lifecycle.

Use `renderValue(value)` on `EditableCell` when edit mode stores a typed value
but view mode needs a label or formatted representation.

## Select Editor

```tsx
function StatusInput({
  value,
  onChange,
  onBlur,
  onKeyDown,
  className,
}: EditableCellInputProps<string>) {
  return (
    <select
      aria-label="Status"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className={className}
    >
      <option value="ready">Ready</option>
      <option value="review">Review</option>
      <option value="blocked">Blocked</option>
    </select>
  );
}
```

## Domain Component

Components that return typed values should call `onDraftChange` while the user
is editing and `commitValue` at an explicit commit boundary. `onValueChange`
remains available as the legacy immediate string-commit adapter.

```tsx
function RatingInput({
  value,
  onDraftChange,
  onBlur,
  onKeyDown,
}: EditableCellInputProps<number>) {
  return (
    <input
      aria-label="Rating"
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={(event) => onDraftChange(Number(event.target.value))}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    />
  );
}
```

## Cancellation

Call `cancelEditing()` when an editor-specific action should restore the original value without waiting for Escape.

## Focus

The standard text editor focuses when mounted. Custom components should focus their primary control only when editing begins. Avoid multiple auto-focused descendants and preserve visible focus styles.

Single-click selects a cell. Double-click, Alt/Option-click, or Enter activates
its editor; controls inside an active editor use normal single-click behavior.
Display-only and action columns stay read-only. Popovers and dialogs that edit a
field should use the same `EditableCell` lifecycle with explicit Save and Cancel
actions. Stop active controls and portals from leaking pointer or keyboard events
into grid selection. Mount portal content and global listeners only while open,
cancel transient overlays when their virtualized trigger unmounts or scrolls
away, and restore focus to the originating cell.

## Paste and Stored Types

Input parsing and clipboard parsing are separate. The editor controls values produced by user interaction; `meta.parsePastedValue` controls clipboard strings. Configure both when stored values are not strings.
