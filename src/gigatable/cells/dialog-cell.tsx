import type { CellContext } from "@tanstack/react-table";
import * as React from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { EditableCell, type EditableCellInputProps } from "../index";
import type { OverlayCellEditorProps } from "./types";
import { readCellPortalStyle, type CellPortalStyle } from "./portal-theme";

/** Props for {@link DialogCell}. */
export type DialogCellProps<TData, TValue> = Omit<
  CellContext<TData, TValue>,
  "renderValue"
> & {
  /** Compact content shown before the dialog editor is activated. */
  trigger: React.ReactNode | ((value: TValue) => React.ReactNode);
  /** Accessible dialog heading. */
  title: string | ((value: TValue) => string);
  /** Optional supporting dialog copy. */
  description?: string | ((value: TValue) => string);
  /** Application-owned editor rendered inside the dialog. */
  renderEditor: (props: OverlayCellEditorProps<TValue>) => React.ReactNode;
  /** Accessible name for the trigger. Defaults to the dialog title. */
  ariaLabel?: string;
  /** Additional trigger styles. */
  className?: string;
};

interface DialogEditorPortalProps<TValue>
  extends EditableCellInputProps<TValue> {
  title: string | ((value: TValue) => string);
  description?: string | ((value: TValue) => string);
  renderEditor: (props: OverlayCellEditorProps<TValue>) => React.ReactNode;
}

function DialogEditorPortal<TValue>({
  value,
  onDraftChange,
  commitValue,
  cancelEditing,
  title,
  description,
  renderEditor,
}: DialogEditorPortalProps<TValue>) {
  const anchorRef = React.useRef<HTMLSpanElement>(null);
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [portalTheme, setPortalTheme] = React.useState<CellPortalStyle | null>(
    null,
  );
  const titleId = React.useId();
  const descriptionId = React.useId();
  const resolvedTitle = typeof title === "function" ? title(value) : title;
  const resolvedDescription =
    typeof description === "function" ? description(value) : description;

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    requestAnimationFrame(() => {
      dialog
        .querySelector<HTMLElement>("input, select, textarea, button")
        ?.focus();
    });
  }, []);

  React.useLayoutEffect(() => {
    const anchor = anchorRef.current?.closest("td") ?? anchorRef.current;
    if (anchor) setPortalTheme(readCellPortalStyle(anchor));
  }, []);

  return (
    <>
      <span ref={anchorRef} aria-hidden="true" />
      {typeof document !== "undefined"
        ? createPortal(
            <dialog
              ref={dialogRef}
              aria-labelledby={titleId}
              aria-describedby={resolvedDescription ? descriptionId : undefined}
              className="m-auto w-[min(42rem,calc(100%_-_2rem))] rounded-2xl border border-[var(--gt-cell-border-color)] bg-[var(--gt-row-bg)] p-0 text-[var(--gt-cell-text-color)] shadow-2xl backdrop:bg-slate-950/50"
              style={portalTheme ?? undefined}
              onCancel={(event) => {
                event.preventDefault();
                cancelEditing();
              }}
              onClick={(event) => {
                event.stopPropagation();
                if (event.target === event.currentTarget) cancelEditing();
              }}
              onMouseDown={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                event.stopPropagation();
                if (event.key === "Escape") {
                  event.preventDefault();
                  cancelEditing();
                }
              }}
            >
              <div className="p-6">
                <header>
                  <h2
                    id={titleId}
                    className="m-0 text-xl font-semibold tracking-tight"
                  >
                    {resolvedTitle}
                  </h2>
                  {resolvedDescription ? (
                    <p
                      id={descriptionId}
                      className="mt-2 text-sm leading-6 opacity-70"
                    >
                      {resolvedDescription}
                    </p>
                  ) : null}
                </header>
                <div className="mt-5">
                  {renderEditor({ value, onChange: onDraftChange })}
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    className="rounded border border-[var(--gt-cell-border-color)] px-3 py-1.5 text-xs font-semibold"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rounded bg-[var(--gt-selection-outline)] px-3 py-1.5 text-xs font-semibold text-white"
                    onClick={() => commitValue(value)}
                  >
                    Save
                  </button>
                </div>
              </div>
            </dialog>,
            document.body,
          )
        : null}
    </>
  );
}

/** Editable modal cell designed for long-form application-owned content. */
export function DialogCell<TData, TValue>({
  trigger,
  title,
  description,
  renderEditor,
  ariaLabel,
  className,
  ...cell
}: DialogCellProps<TData, TValue>) {
  const resolvedAriaLabel =
    ariaLabel ?? (typeof title === "string" ? title : "Open dialog editor");
  const DialogInput = React.useMemo(
    () =>
      function DialogInput(props: EditableCellInputProps<TValue>) {
        return (
          <DialogEditorPortal
            {...props}
            title={title}
            description={description}
            renderEditor={renderEditor}
          />
        );
      },
    [description, renderEditor, title],
  );
  const renderTrigger = React.useCallback(
    (value: TValue) => (
      <span
        aria-haspopup="dialog"
        aria-label={resolvedAriaLabel}
        className={clsx(
          "inline-flex items-center rounded border border-[var(--gt-cell-border-color)] bg-[var(--gt-row-bg)] px-2 py-1 text-[0.7rem] font-semibold text-[var(--gt-cell-text-color)] shadow-sm",
          className,
        )}
      >
        {typeof trigger === "function" ? trigger(value) : trigger}
      </span>
    ),
    [className, resolvedAriaLabel, trigger],
  );

  return (
    <EditableCell
      {...cell}
      renderInput={DialogInput}
      renderValue={renderTrigger}
    />
  );
}
