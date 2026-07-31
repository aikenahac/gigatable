import type { CellContext } from "@tanstack/react-table";
import * as React from "react";
import { EditableCell, type EditableCellInputProps } from "../index";
import { cellToneColors, type CellTone } from "./types";

export type NumberCellVariant = "number" | "range";

export function normalizeNumberCellValue(
  value: string | number,
  min?: number,
  max?: number,
): number | null {
  if (typeof value === "string" && value.trim() === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.min(Math.max(parsed, min ?? -Infinity), max ?? Infinity);
}

/** Props for {@link NumberCell}. */
export type NumberCellProps<TData> = Omit<
  CellContext<TData, number>,
  "renderValue"
> & {
  /** Accessible name for the numeric editor. */
  ariaLabel: string;
  /** Lowest committed value. */
  min?: number;
  /** Highest committed value. */
  max?: number;
  /** Numeric increment used by the editor. */
  step?: number;
  /** Use a number input or a range slider paired with a number input. */
  variant?: NumberCellVariant;
  /** Semantic color shared by the editable slider and its view renderer. */
  tone?: CellTone | ((value: number) => CellTone);
  /** Compact suffix shown beside the editable numeric value. */
  suffix?: string;
  /** Formats the value shown outside edit mode. */
  renderValue?: (value: number) => React.ReactNode;
};

/** Editable numeric cell that preserves number values through direct edits. */
export function NumberCell<TData>({
  ariaLabel,
  min,
  max,
  step = 1,
  variant = "number",
  tone = "info",
  suffix,
  renderValue,
  ...cell
}: NumberCellProps<TData>) {
  const NumberInput = React.useMemo(
    () =>
      function NumberInput({
        value,
        onDraftChange,
        commitValue,
        onKeyDown,
        cancelEditing,
      }: EditableCellInputProps<number>) {
        const [draft, setDraft] = React.useState(String(value));
        const groupRef = React.useRef<HTMLDivElement>(null);

        const updateDraft = (nextDraft: string) => {
          setDraft(nextDraft);
          const parsed = normalizeNumberCellValue(nextDraft);
          if (parsed !== null) onDraftChange(parsed);
        };
        const finishEditing = () => {
          const parsed = normalizeNumberCellValue(draft, min, max);
          if (parsed === null) cancelEditing();
          else commitValue(parsed);
        };
        const handleKeyDown = (event: React.KeyboardEvent) => {
          if (event.key === "Enter" || event.key === "Tab") {
            const parsed = normalizeNumberCellValue(draft, min, max);
            if (parsed === null) {
              event.preventDefault();
              cancelEditing();
            } else {
              commitValue(parsed);
            }
            return;
          }
          onKeyDown(event);
        };
        const handleBlur = (event: React.FocusEvent) => {
          if (
            event.relatedTarget instanceof Node &&
            groupRef.current?.contains(event.relatedTarget)
          ) {
            return;
          }
          finishEditing();
        };
        const sliderValue = normalizeNumberCellValue(draft, min, max) ?? value;
        const sliderMin = min ?? 0;
        const sliderMax = max ?? 100;
        const sliderPercentage =
          sliderMax > sliderMin
            ? ((sliderValue - sliderMin) / (sliderMax - sliderMin)) * 100
            : 0;
        const resolvedTone =
          typeof tone === "function" ? tone(sliderValue) : tone;
        const sliderColor = cellToneColors[resolvedTone];

        return (
          <div
            ref={groupRef}
            className="flex h-full min-w-0 w-full items-center gap-2"
            onBlur={handleBlur}
          >
            {variant === "range" ? (
              <div className="relative h-8 min-w-12 flex-1">
                <input
                  autoFocus
                  type="range"
                  aria-label={`${ariaLabel} slider`}
                  min={min}
                  max={max}
                  step={step}
                  value={sliderValue}
                  onChange={(event) => updateDraft(event.currentTarget.value)}
                  onKeyDown={handleKeyDown}
                  className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full shadow-inner transition-shadow peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--gt-selection-outline)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--gt-row-bg)]"
                  style={{
                    background:
                      "color-mix(in srgb, var(--gt-cell-text-color) 12%, transparent)",
                  }}
                >
                  <span
                    className="block h-full rounded-full transition-[width] duration-150"
                    style={{
                      width: `${sliderPercentage}%`,
                      background: sliderColor,
                    }}
                  />
                </span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 size-[1.125rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[var(--gt-row-bg)] shadow-[0_2px_8px_rgba(0,0,0,0.35)] transition-[left] duration-150"
                  style={{
                    left: `${sliderPercentage}%`,
                    background: sliderColor,
                  }}
                />
              </div>
            ) : null}
            <label
              className={
                variant === "range"
                  ? "flex h-8 min-w-[3.5rem] flex-none items-center justify-end rounded-lg border border-transparent px-1 text-[0.72rem] font-semibold tabular-nums text-[var(--gt-cell-text-color)] transition-colors hover:border-[var(--gt-cell-border-color)] focus-within:border-[var(--gt-selection-outline)] focus-within:bg-[color-mix(in_srgb,var(--gt-selection-outline)_8%,var(--gt-row-bg))]"
                  : "h-full w-full"
              }
            >
              <input
                autoFocus={variant === "number"}
                type="number"
                aria-label={ariaLabel}
                min={min}
                max={max}
                step={step}
                value={draft}
                onChange={(event) => updateDraft(event.currentTarget.value)}
                onKeyDown={handleKeyDown}
                className={
                  variant === "range"
                    ? "min-w-0 w-[2.75rem] appearance-none bg-transparent p-0 text-right text-inherit font-inherit outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    : "h-full w-full rounded-lg border border-[var(--gt-cell-border-color)] bg-[var(--gt-row-bg)] px-2 outline-none focus:border-[var(--gt-selection-outline)]"
                }
              />
              {suffix ? <span aria-hidden="true">{suffix}</span> : null}
            </label>
          </div>
        );
      },
    [ariaLabel, max, min, step, suffix, tone, variant],
  );

  return (
    <EditableCell
      {...cell}
      renderInput={NumberInput}
      renderValue={renderValue}
    />
  );
}
