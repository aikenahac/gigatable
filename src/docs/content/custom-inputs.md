# Custom Inputs

`EditableCell` delegates the editing UI to `renderInput`. The renderer receives the current value and all commit, cancel, and keyboard bindings.

## Input Contract

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

Forward `onBlur` and `onKeyDown` so Enter, Tab, Escape, and blur follow the standard lifecycle.

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

Components that return a value instead of an event should call `onValueChange`.

```tsx
function RatingInput({
  value,
  onValueChange,
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
      onChange={(event) => onValueChange(event.target.value)}
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

## Paste and Stored Types

Input parsing and clipboard parsing are separate. The editor controls values produced by user interaction; `meta.parsePastedValue` controls clipboard strings. Configure both when stored values are not strings.
