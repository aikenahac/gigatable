import * as React from "react";
import { CellContext, TableMeta as TableMetaTS } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export interface TableMeta<TData> extends TableMetaTS<TData> {
  updateCellData?: (rowId: number, colId: string, value: unknown) => void;
}

/** Props passed to the `renderInput` component inside {@link EditableCell}. */
export interface EditableCellInputProps<TValue> {
  /** The current cell value passed to the input. */
  value: TValue;
  /** Standard React change handler — update local input state here. */
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  /** Commits the current value and exits edit mode on blur. */
  onBlur: () => void;
  /** Commits a value string directly without a DOM event — useful for select or custom inputs. */
  onValueChange: (value: string) => void;
  /** Forward keydown events to handle Tab (save + move), Enter (save), Escape (cancel). */
  onKeyDown: (e: React.KeyboardEvent) => void;
  /** Call to discard changes and return to view mode without saving. */
  cancelEditing: () => void;
  /** Optional className applied to the input element. */
  className?: string;
}

interface EditableCellProps<TData, TValue> extends CellContext<TData, TValue> {
  renderInput: React.FunctionComponent<EditableCellInputProps<TValue>>;
}

function EditableCellComponent<TData, TValue>({
  getValue,
  row: { index: rowId },
  column: { id: colId },
  table,
  renderInput,
}: EditableCellProps<TData, TValue>): React.ReactElement {
  const initialValue = getValue();
  const RenderInput = renderInput;
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<TValue>(initialValue);

  const onDoubleClick = () => setIsEditing(true);

  const cancelEditing = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  const onValueChange = (value: string) => {
    setValue(value as unknown as TValue);
    setIsEditing(false);
    (table.options.meta as TableMeta<TData> | undefined)?.updateCellData?.(
      rowId,
      colId,
      value,
    );
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const newValue = e.target.value;
    setValue(newValue as unknown as TValue);
  };

  const handleEndEditing = () => {
    setIsEditing(false);
    (table.options.meta as TableMeta<TData> | undefined)?.updateCellData?.(
      rowId,
      colId,
      value,
    );
  };

  const handleKeyDownOnEdit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Tab") {
      handleEndEditing();
    } else if (e.key === "Escape") {
      cancelEditing();
    } else {
      e.stopPropagation();
    }
  };

  const handleKeyDownOnView = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.stopPropagation();
      setIsEditing(true);
    }
  };

  const handleBlur = () => handleEndEditing();

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (isEditing) {
    return (
      <div
        onDoubleClick={onDoubleClick}
        className="flex items-center box-border w-full h-full cursor-text [&_input]:w-full [&_input]:h-full [&_input]:border-none [&_input]:outline-none [&_input]:bg-transparent [&_input]:text-inherit [&_input]:font-inherit [&_input]:p-0"
        tabIndex={0}
      >
        <RenderInput
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          onValueChange={onValueChange}
          onKeyDown={handleKeyDownOnEdit}
          cancelEditing={cancelEditing}
        />
      </div>
    );
  }

  return (
    <div
      onKeyDown={handleKeyDownOnView}
      onDoubleClick={onDoubleClick}
      className="w-full h-full overflow-hidden text-ellipsis whitespace-nowrap flex items-center"
      data-editable-cell-viewing
      tabIndex={0}
    >
      {value ? String(value) : "-"}
    </div>
  );
}

/**
 * Wraps a cell with double-click-to-edit behaviour. Renders read-only by default; switches
 * to `renderInput` on double-click or Enter. Wire `updateCellData` via `table.options.meta`
 * (provided automatically by {@link useGigatable}) to persist changes.
 */
export const EditableCell = React.memo(
  EditableCellComponent,
  (prevProps, nextProps) => {
    // Custom comparison to prevent re-renders when value hasn't changed
    return (
      prevProps.getValue() === nextProps.getValue() &&
      prevProps.row.index === nextProps.row.index &&
      prevProps.column.id === nextProps.column.id
    );
  },
) as typeof EditableCellComponent;
