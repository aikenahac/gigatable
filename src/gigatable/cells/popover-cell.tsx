import type { CellContext } from "@tanstack/react-table";
import * as React from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { EditableCell, type EditableCellInputProps } from "../index";
import type { OverlayCellEditorProps } from "./types";
import { readCellPortalStyle, type CellPortalStyle } from "./portal-theme";

/** Props for {@link PopoverCell}. */
export type PopoverCellProps<TData, TValue> = Omit<
  CellContext<TData, TValue>,
  "renderValue"
> & {
  /** Compact content shown before the popover editor is activated. */
  trigger: React.ReactNode | ((value: TValue) => React.ReactNode);
  /** Accessible name for the trigger and popover. */
  ariaLabel: string;
  /** Application-owned editor rendered inside the popover. */
  renderEditor: (props: OverlayCellEditorProps<TValue>) => React.ReactNode;
  /** Optional contextual content rendered below the editor. */
  details?: React.ReactNode | ((value: TValue) => React.ReactNode);
  /** Additional trigger styles. */
  className?: string;
  /** Additional popover panel styles. */
  contentClassName?: string;
};

interface PopoverPosition {
  left: number;
  top: number;
  width: number;
}

interface PopoverEditorPortalProps<TValue>
  extends EditableCellInputProps<TValue> {
  ariaLabel: string;
  renderEditor: (props: OverlayCellEditorProps<TValue>) => React.ReactNode;
  details?: React.ReactNode | ((value: TValue) => React.ReactNode);
  contentClassName?: string;
}

function PopoverEditorPortal<TValue>({
  value,
  onDraftChange,
  commitValue,
  cancelEditing,
  ariaLabel,
  renderEditor,
  details,
  contentClassName,
}: PopoverEditorPortalProps<TValue>) {
  const anchorRef = React.useRef<HTMLSpanElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState<PopoverPosition>({
    left: 12,
    top: 12,
    width: 288,
  });
  const [portalTheme, setPortalTheme] = React.useState<CellPortalStyle | null>(
    null,
  );

  React.useLayoutEffect(() => {
    const anchor = anchorRef.current?.closest("td") ?? anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    setPortalTheme(readCellPortalStyle(anchor));
    const width = Math.min(320, window.innerWidth - 24);
    const estimatedHeight = panelRef.current?.offsetHeight ?? 220;
    const left = Math.min(
      Math.max(12, rect.left),
      Math.max(12, window.innerWidth - width - 12),
    );
    const top =
      rect.bottom + estimatedHeight + 12 <= window.innerHeight
        ? rect.bottom + 8
        : Math.max(12, rect.top - estimatedHeight - 8);
    setPosition({ left, top, width });
    requestAnimationFrame(() => {
      panelRef.current
        ?.querySelector<HTMLElement>("input, select, textarea, button")
        ?.focus();
    });
  }, []);

  React.useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) cancelEditing();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        cancelEditing();
      }
    };
    const handleScroll = () => cancelEditing();
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [cancelEditing]);

  const renderedDetails =
    typeof details === "function" ? details(value) : details;

  return (
    <>
      <span ref={anchorRef} aria-hidden="true" />
      {typeof document !== "undefined"
        ? createPortal(
            <div
              ref={panelRef}
              role="dialog"
              aria-label={ariaLabel}
              className={clsx(
                "fixed z-[100] rounded-xl border border-[var(--gt-cell-border-color)] bg-[var(--gt-row-bg)] p-4 text-sm text-[var(--gt-cell-text-color)] shadow-2xl",
                contentClassName,
              )}
              style={{ ...position, ...portalTheme }}
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            >
              {renderEditor({ value, onChange: onDraftChange })}
              {renderedDetails ? (
                <div className="mt-4 border-t border-[var(--gt-cell-border-color)] pt-3">
                  {renderedDetails}
                </div>
              ) : null}
              <div className="mt-4 flex justify-end gap-2">
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
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

/** Editable contextual popover designed for use inside virtualized cells. */
export function PopoverCell<TData, TValue>({
  trigger,
  ariaLabel,
  renderEditor,
  details,
  className,
  contentClassName,
  ...cell
}: PopoverCellProps<TData, TValue>) {
  const PopoverInput = React.useMemo(
    () =>
      function PopoverInput(props: EditableCellInputProps<TValue>) {
        return (
          <PopoverEditorPortal
            {...props}
            ariaLabel={ariaLabel}
            renderEditor={renderEditor}
            details={details}
            contentClassName={contentClassName}
          />
        );
      },
    [ariaLabel, contentClassName, details, renderEditor],
  );
  const renderTrigger = React.useCallback(
    (value: TValue) => (
      <span
        aria-haspopup="dialog"
        aria-label={ariaLabel}
        className={clsx(
          "inline-flex max-w-full items-center gap-1.5 truncate rounded px-1.5 py-1 text-left text-xs font-medium text-[var(--gt-cell-text-color)]",
          className,
        )}
      >
        {typeof trigger === "function" ? trigger(value) : trigger}
      </span>
    ),
    [ariaLabel, className, trigger],
  );

  return (
    <EditableCell
      {...cell}
      renderInput={PopoverInput}
      renderValue={renderTrigger}
    />
  );
}
