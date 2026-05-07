import * as React from "react";
import { CellContext, TableMeta as TableMetaTS } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export interface TableMeta<TData> extends TableMetaTS<TData> {
  updateCellData?: (rowId: number, colId: string, value: unknown) => void;
}

export interface EditableCellInputProps<TValue> {
  value: TValue;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onBlur: () => void;
  onValueChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  cancelEditing: () => void;
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

export const EditableCell = React.memo(EditableCellComponent, (prevProps, nextProps) => {
  // Custom comparison to prevent re-renders when value hasn't changed
  return (
    prevProps.getValue() === nextProps.getValue() &&
    prevProps.row.index === nextProps.row.index &&
    prevProps.column.id === nextProps.column.id
  );
}) as typeof EditableCellComponent;
