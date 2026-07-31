import type { CellContext } from "@tanstack/react-table";
import clsx from "clsx";
import * as React from "react";
import { createPortal } from "react-dom";
import { EditableCell, type EditableCellInputProps } from "../index";
import { readCellPortalStyle, type CellPortalStyle } from "./portal-theme";

/** Props for {@link DateCell}. */
export type DateCellProps<TData> = CellContext<TData, string> & {
  /** Accessible name for the calendar editor. */
  ariaLabel: string;
  /** Earliest allowed ISO `YYYY-MM-DD` value. */
  min?: string;
  /** Latest allowed ISO `YYYY-MM-DD` value. */
  max?: string;
  /** Formats the stored ISO value in view mode. */
  formatValue?: (value: string) => React.ReactNode;
};

const dayLabelFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});
const monthLabelFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "long",
});

function parseIsoDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function shiftIsoDate(value: string, days: number) {
  const date = parseIsoDate(value);
  if (!date) return value;
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

function clampIsoDate(value: string, min?: string, max?: string) {
  if (min && value < min) return min;
  if (max && value > max) return max;
  return value;
}

export function buildCalendarDays(monthValue: string) {
  const monthDate = parseIsoDate(monthValue) ?? new Date();
  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1, 12);
  first.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(first);
    date.setDate(first.getDate() + index);
    return toIsoDate(date);
  });
}

function shiftMonth(value: string, months: number) {
  const date = parseIsoDate(value) ?? new Date();
  const originalDay = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    12,
  ).getDate();
  date.setDate(Math.min(originalDay, lastDay));
  return toIsoDate(date);
}

interface DateEditorProps extends EditableCellInputProps<string> {
  ariaLabel: string;
  min?: string;
  max?: string;
  displayValue: React.ReactNode;
}

function DateEditor({
  value,
  commitValue,
  cancelEditing,
  ariaLabel,
  min,
  max,
  displayValue,
}: DateEditorProps) {
  const anchorRef = React.useRef<HTMLSpanElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const today = toIsoDate(new Date());
  const initialDate = clampIsoDate(
    parseIsoDate(value) ? value : parseIsoDate(min ?? "") ? min! : today,
    min,
    max,
  );
  const [activeDate, setActiveDate] = React.useState(initialDate);
  const [visibleMonth, setVisibleMonth] = React.useState(
    `${initialDate.slice(0, 7)}-01`,
  );
  const [position, setPosition] = React.useState({ left: 12, top: 12 });
  const [portalTheme, setPortalTheme] = React.useState<CellPortalStyle | null>(
    null,
  );
  const days = React.useMemo(
    () => buildCalendarDays(visibleMonth),
    [visibleMonth],
  );
  const visibleMonthNumber = Number(visibleMonth.slice(5, 7)) - 1;

  React.useLayoutEffect(() => {
    const anchor = anchorRef.current?.closest("td") ?? anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    setPortalTheme(readCellPortalStyle(anchor));
    const width = Math.min(312, window.innerWidth - 24);
    const estimatedHeight = 350;
    const left = Math.min(
      Math.max(12, rect.left),
      Math.max(12, window.innerWidth - width - 12),
    );
    const top =
      rect.bottom + estimatedHeight + 12 <= window.innerHeight
        ? rect.bottom + 6
        : Math.max(12, rect.top - estimatedHeight - 6);
    setPosition({ left, top });
  }, []);

  React.useEffect(() => {
    requestAnimationFrame(() => {
      panelRef.current
        ?.querySelector<HTMLButtonElement>(`button[data-date="${activeDate}"]`)
        ?.focus();
    });
  }, [activeDate, visibleMonth]);

  React.useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) cancelEditing();
    };
    const handleScroll = () => cancelEditing();
    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [cancelEditing]);

  const isAllowed = (date: string) =>
    (!min || date >= min) && (!max || date <= max);

  const activateDate = (date: string) => {
    const nextDate = clampIsoDate(date, min, max);
    setActiveDate(nextDate);
    setVisibleMonth(`${nextDate.slice(0, 7)}-01`);
  };

  const handleDayKeyDown = (event: React.KeyboardEvent) => {
    let nextDate: string | null = null;
    if (event.key === "ArrowLeft") nextDate = shiftIsoDate(activeDate, -1);
    if (event.key === "ArrowRight") nextDate = shiftIsoDate(activeDate, 1);
    if (event.key === "ArrowUp") nextDate = shiftIsoDate(activeDate, -7);
    if (event.key === "ArrowDown") nextDate = shiftIsoDate(activeDate, 7);
    if (event.key === "PageUp") nextDate = shiftMonth(activeDate, -1);
    if (event.key === "PageDown") nextDate = shiftMonth(activeDate, 1);
    if (event.key === "Home") {
      const date = parseIsoDate(activeDate);
      nextDate = shiftIsoDate(activeDate, -(date?.getDay() ?? 0));
    }
    if (event.key === "End") {
      const date = parseIsoDate(activeDate);
      nextDate = shiftIsoDate(activeDate, 6 - (date?.getDay() ?? 0));
    }
    if (nextDate !== null) {
      event.preventDefault();
      event.stopPropagation();
      activateDate(nextDate);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      commitValue(activeDate);
    }
  };

  const moveVisibleMonth = (months: number) => {
    activateDate(shiftMonth(activeDate, months));
  };

  const previousMonthValue = shiftMonth(visibleMonth, -1);
  const nextMonthValue = shiftMonth(visibleMonth, 1);
  const previousDisabled = Boolean(
    min && previousMonthValue.slice(0, 7) < min.slice(0, 7),
  );
  const nextDisabled = Boolean(
    max && nextMonthValue.slice(0, 7) > max.slice(0, 7),
  );

  return (
    <>
      <span
        ref={anchorRef}
        className="inline-flex max-w-full items-center truncate"
      >
        {displayValue}
      </span>
      {typeof document !== "undefined"
        ? createPortal(
            <div
              ref={panelRef}
              role="dialog"
              aria-label={`${ariaLabel} calendar`}
              className="fixed z-[110] w-[min(19.5rem,calc(100vw-1.5rem))] rounded-2xl border border-[var(--gt-cell-border-color)] bg-[var(--gt-row-bg)] p-3 text-sm text-[var(--gt-cell-text-color)] shadow-2xl outline-none ring-1 ring-black/5"
              style={{ ...position, ...portalTheme }}
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                event.stopPropagation();
                if (event.key === "Escape") {
                  event.preventDefault();
                  cancelEditing();
                }
              }}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  aria-label="Previous month"
                  disabled={previousDisabled}
                  className="grid size-8 place-items-center rounded-lg border border-[var(--gt-cell-border-color)] bg-transparent text-base disabled:cursor-not-allowed disabled:opacity-30"
                  onClick={() => moveVisibleMonth(-1)}
                >
                  ‹
                </button>
                <strong className="text-sm font-semibold" aria-live="polite">
                  {monthLabelFormatter.format(
                    parseIsoDate(visibleMonth) ?? new Date(),
                  )}
                </strong>
                <button
                  type="button"
                  aria-label="Next month"
                  disabled={nextDisabled}
                  className="grid size-8 place-items-center rounded-lg border border-[var(--gt-cell-border-color)] bg-transparent text-base disabled:cursor-not-allowed disabled:opacity-30"
                  onClick={() => moveVisibleMonth(1)}
                >
                  ›
                </button>
              </div>
              <div className="grid grid-cols-7 text-center text-[0.66rem] font-semibold uppercase tracking-[0.08em] opacity-55">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <span key={day} className="py-1.5" aria-hidden="true">
                    {day}
                  </span>
                ))}
              </div>
              <div
                role="grid"
                aria-label={ariaLabel}
                className="grid grid-cols-7 gap-0.5"
              >
                {days.map((date) => {
                  const parsed = parseIsoDate(date)!;
                  const isOutsideMonth =
                    parsed.getMonth() !== visibleMonthNumber;
                  const isSelected = date === value;
                  const isActive = date === activeDate;
                  const isToday = date === today;
                  const disabled = !isAllowed(date);
                  return (
                    <button
                      key={date}
                      type="button"
                      role="gridcell"
                      data-date={date}
                      aria-label={dayLabelFormatter.format(parsed)}
                      aria-selected={isSelected}
                      aria-current={isToday ? "date" : undefined}
                      disabled={disabled}
                      tabIndex={isActive ? 0 : -1}
                      className={clsx(
                        "grid aspect-square min-h-8 place-items-center rounded-lg text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--gt-selection-outline)]",
                        disabled && "cursor-not-allowed opacity-25",
                        isOutsideMonth && !disabled && "opacity-45",
                      )}
                      style={
                        isActive || isSelected
                          ? {
                              background: isSelected
                                ? "var(--gt-selection-outline)"
                                : "color-mix(in srgb, var(--gt-selection-outline) 15%, var(--gt-row-bg))",
                              color: isSelected ? "white" : undefined,
                            }
                          : undefined
                      }
                      onFocus={() => setActiveDate(date)}
                      onKeyDown={handleDayKeyDown}
                      onClick={() => commitValue(date)}
                    >
                      {parsed.getDate()}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-[var(--gt-cell-border-color)] pt-2">
                <button
                  type="button"
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-[var(--gt-selection-outline)] disabled:opacity-30"
                  disabled={!isAllowed(today)}
                  onClick={() => commitValue(today)}
                >
                  Today
                </button>
                <button
                  type="button"
                  className="rounded-lg px-2 py-1 text-xs font-semibold opacity-70"
                  onClick={cancelEditing}
                >
                  Cancel
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

/** Dependency-free calendar editor for ISO date values. */
export function DateCell<TData>({
  ariaLabel,
  min,
  max,
  formatValue,
  ...cell
}: DateCellProps<TData>) {
  const DateInput = React.useMemo(
    () =>
      function DateInput(props: EditableCellInputProps<string>) {
        return (
          <DateEditor
            {...props}
            ariaLabel={ariaLabel}
            min={min}
            max={max}
            displayValue={
              props.value ? (formatValue?.(props.value) ?? props.value) : "—"
            }
          />
        );
      },
    [ariaLabel, formatValue, max, min],
  );
  const renderValue = React.useCallback(
    (value: string) => (value ? (formatValue?.(value) ?? value) : "—"),
    [formatValue],
  );

  return (
    <EditableCell {...cell} renderInput={DateInput} renderValue={renderValue} />
  );
}
