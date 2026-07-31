import * as React from "react";
import { CellContext, TableMeta as TableMetaTS } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { useQuickEdit } from "./use-quick-edit";

const QuickEditContext = React.createContext(false);

export const QuickEditProvider = QuickEditContext.Provider;

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
  /** Updates the typed editor draft without committing it. */
  onDraftChange: (value: TValue) => void;
  /** Commits a typed value immediately and exits edit mode. */
  commitValue: (value: TValue) => void;
  /** Forward keydown events to handle Tab (save + move), Enter (save), Escape (cancel). */
  onKeyDown: (e: React.KeyboardEvent) => void;
  /** Call to discard changes and return to view mode without saving. */
  cancelEditing: () => void;
  /** Optional className applied to the input element. */
  className?: string;
}

/** Props accepted by {@link EditableCell}. */
export type EditableCellProps<TData, TValue> = Omit<
  CellContext<TData, TValue>,
  "renderValue"
> & {
  /** Component rendered while the cell is being edited. */
  renderInput: React.FunctionComponent<EditableCellInputProps<TValue>>;
  /** Optional view-mode renderer. The default renders the value as text or `-` when empty. */
  renderValue?:
    | CellContext<TData, TValue>["renderValue"]
    | ((value: TValue) => React.ReactNode);
};

function EditableCellComponent<TData, TValue>({
  getValue,
  cell,
  row: { id: rowKey, index: rowId },
  column: { id: colId },
  table,
  renderInput,
  renderValue,
}: EditableCellProps<TData, TValue>): React.ReactElement {
  const initialValue = getValue();
  const RenderInput = renderInput;
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<TValue>(initialValue);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const quickEditEnabled = React.use(QuickEditContext);
  // Spreading a TanStack CellContext also supplies its zero-argument
  // `renderValue`. Only treat a function that replaces that method as the
  // optional Gigatable formatter.
  const customRenderValue =
    renderValue === cell.renderValue
      ? undefined
      : (renderValue as ((value: TValue) => React.ReactNode) | undefined);

  const onDoubleClick = () => setIsEditing(true);
  const quickEdit = useQuickEdit({
    enabled: quickEditEnabled,
    inputRef,
    isEditing,
    startEditing: () => setIsEditing(true),
  });

  const restoreCellFocus = () => {
    requestAnimationFrame(() => {
      const cell = Array.from(
        document.querySelectorAll<HTMLTableCellElement>(
          "td[data-row-id][data-column-id]",
        ),
      ).find(
        (candidate) =>
          candidate.dataset.rowId === rowKey &&
          candidate.dataset.columnId === colId,
      );
      cell?.focus({ preventScroll: true });
    });
  };

  const cancelEditing = () => {
    setValue(initialValue);
    setIsEditing(false);
    restoreCellFocus();
  };

  const commitValue = (nextValue: TValue) => {
    setValue(nextValue);
    setIsEditing(false);
    (table.options.meta as TableMeta<TData> | undefined)?.updateCellData?.(
      rowId,
      colId,
      nextValue,
    );
    restoreCellFocus();
  };

  const onValueChange = (nextValue: string) =>
    commitValue(nextValue as unknown as TValue);

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
      e.preventDefault();
      handleEndEditing();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
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
        ref={(element) => {
          inputRef.current =
            element?.querySelector<HTMLInputElement | HTMLTextAreaElement>(
              "input, textarea",
            ) ?? null;
        }}
        onDoubleClick={onDoubleClick}
        className="flex items-center box-border w-full h-full cursor-text [&_input]:w-full [&_input]:h-full [&_input]:border-none [&_input]:outline-none [&_input]:bg-transparent [&_input]:text-inherit [&_input]:font-inherit [&_input]:p-0"
        tabIndex={0}
      >
        <RenderInput
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          onValueChange={onValueChange}
          onDraftChange={setValue}
          commitValue={commitValue}
          onKeyDown={handleKeyDownOnEdit}
          cancelEditing={cancelEditing}
        />
      </div>
    );
  }

  return (
    <div
      ref={quickEdit.wrapperRef}
      onKeyDown={handleKeyDownOnView}
      onDoubleClick={onDoubleClick}
      onMouseDown={quickEdit.onMouseDown}
      onClickCapture={quickEdit.onClickCapture}
      className="w-full h-full overflow-hidden text-ellipsis whitespace-nowrap flex items-center"
      data-editable-cell-viewing
      tabIndex={0}
    >
      {customRenderValue
        ? customRenderValue(value)
        : value
          ? String(value)
          : "-"}
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
      prevProps.row.id === nextProps.row.id &&
      prevProps.column.id === nextProps.column.id &&
      prevProps.renderInput === nextProps.renderInput &&
      prevProps.renderValue === nextProps.renderValue
    );
  },
) as typeof EditableCellComponent;
