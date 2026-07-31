import type { CellContext } from "@tanstack/react-table";
import clsx from "clsx";
import * as React from "react";
import { createPortal } from "react-dom";
import { EditableCell, type EditableCellInputProps } from "../index";
import { readCellPortalStyle, type CellPortalStyle } from "./portal-theme";
import type { CellOption } from "./types";

/** Props for {@link SelectCell}. */
export type SelectCellProps<TData, TValue extends string> = CellContext<
  TData,
  TValue
> & {
  /** Stable list of selectable values. */
  options: ReadonlyArray<CellOption<TValue>>;
  /** Accessible name for the editing control. */
  ariaLabel: string;
  /** Text shown when the value does not match an option. */
  placeholder?: string;
  /** Optional rich renderer shared by view mode and the custom option list. */
  renderOption?: (
    option: CellOption<TValue> | undefined,
    value: TValue,
  ) => React.ReactNode;
};

interface SelectEditorProps<TValue extends string>
  extends EditableCellInputProps<TValue> {
  options: ReadonlyArray<CellOption<TValue>>;
  ariaLabel: string;
  placeholder: string;
  renderOption?: SelectCellProps<unknown, TValue>["renderOption"];
}

function findEnabledOption<TValue extends string>(
  options: ReadonlyArray<CellOption<TValue>>,
  startIndex: number,
  direction: 1 | -1,
) {
  if (options.length === 0) return -1;
  for (let offset = 0; offset < options.length; offset += 1) {
    const index =
      (startIndex + direction * offset + options.length) % options.length;
    if (!options[index]?.disabled) return index;
  }
  return -1;
}

function SelectEditor<TValue extends string>({
  value,
  onDraftChange,
  commitValue,
  cancelEditing,
  onKeyDown,
  options,
  ariaLabel,
  placeholder,
  renderOption,
}: SelectEditorProps<TValue>) {
  const anchorRef = React.useRef<HTMLSpanElement>(null);
  const listboxRef = React.useRef<HTMLDivElement>(null);
  const listboxId = React.useId();
  const initialIndex = options.findIndex((option) => option.value === value);
  const [activeIndex, setActiveIndex] = React.useState(() =>
    initialIndex >= 0 ? initialIndex : findEnabledOption(options, 0, 1),
  );
  const [position, setPosition] = React.useState({
    left: 12,
    top: 12,
    width: 220,
  });
  const [portalTheme, setPortalTheme] = React.useState<CellPortalStyle | null>(
    null,
  );
  const typeaheadRef = React.useRef("");
  const typeaheadTimerRef = React.useRef<number | null>(null);

  React.useLayoutEffect(() => {
    const anchor = anchorRef.current?.closest("td") ?? anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    setPortalTheme(readCellPortalStyle(anchor));
    const width = Math.min(
      Math.max(rect.width, 180),
      Math.max(180, window.innerWidth - 24),
    );
    const estimatedHeight = Math.min(options.length * 42 + 16, 280);
    const left = Math.min(
      Math.max(12, rect.left),
      Math.max(12, window.innerWidth - width - 12),
    );
    const top =
      rect.bottom + estimatedHeight + 12 <= window.innerHeight
        ? rect.bottom + 6
        : Math.max(12, rect.top - estimatedHeight - 6);
    setPosition({ left, top, width });
    requestAnimationFrame(() => listboxRef.current?.focus());
  }, [options.length]);

  React.useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!listboxRef.current?.contains(event.target as Node)) cancelEditing();
    };
    const handleScroll = () => cancelEditing();
    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
      if (typeaheadTimerRef.current !== null) {
        window.clearTimeout(typeaheadTimerRef.current);
      }
    };
  }, [cancelEditing]);

  const activateIndex = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    setActiveIndex(index);
    onDraftChange(option.value);
  };

  const move = (direction: 1 | -1) => {
    const start =
      activeIndex < 0 ? (direction === 1 ? 0 : -1) : activeIndex + direction;
    const nextIndex = findEnabledOption(options, start, direction);
    if (nextIndex >= 0) activateIndex(nextIndex);
  };

  const commitActiveOption = () => {
    const option = options[activeIndex];
    if (option && !option.disabled) commitValue(option.value);
  };

  const handleTypeahead = (key: string) => {
    typeaheadRef.current += key.toLocaleLowerCase();
    if (typeaheadTimerRef.current !== null) {
      window.clearTimeout(typeaheadTimerRef.current);
    }
    typeaheadTimerRef.current = window.setTimeout(() => {
      typeaheadRef.current = "";
    }, 600);
    const match = options.findIndex(
      (option) =>
        !option.disabled &&
        option.label.toLocaleLowerCase().startsWith(typeaheadRef.current),
    );
    if (match >= 0) activateIndex(match);
  };

  const handleListboxKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      event.stopPropagation();
      move(event.key === "ArrowDown" ? 1 : -1);
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      event.stopPropagation();
      const nextIndex = findEnabledOption(
        options,
        event.key === "Home" ? 0 : options.length - 1,
        event.key === "Home" ? 1 : -1,
      );
      if (nextIndex >= 0) activateIndex(nextIndex);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      commitActiveOption();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      cancelEditing();
      return;
    }
    if (event.key === "Tab") {
      onKeyDown(event);
      return;
    }
    if (event.key.length === 1 && /\S/.test(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      handleTypeahead(event.key);
    }
  };

  const activeOption = options[activeIndex];
  const activeValue = activeOption?.value ?? value;

  return (
    <>
      <span
        ref={anchorRef}
        className="inline-flex max-w-full items-center truncate"
      >
        {renderOption?.(activeOption, activeValue) ??
          activeOption?.label ??
          activeValue ??
          placeholder}
      </span>
      {typeof document !== "undefined"
        ? createPortal(
            <div
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-label={ariaLabel}
              aria-activedescendant={
                activeIndex >= 0
                  ? `${listboxId}-option-${activeIndex}`
                  : undefined
              }
              tabIndex={0}
              className="fixed z-[110] max-h-72 overflow-auto rounded-xl border border-[var(--gt-cell-border-color)] bg-[var(--gt-row-bg)] p-1.5 text-sm text-[var(--gt-cell-text-color)] shadow-2xl outline-none ring-1 ring-black/5 focus-visible:ring-2 focus-visible:ring-[var(--gt-selection-outline)]"
              style={{ ...position, ...portalTheme }}
              onKeyDown={handleListboxKeyDown}
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
            >
              {options.length === 0 ? (
                <div className="px-3 py-2 opacity-60">{placeholder}</div>
              ) : (
                options.map((option, index) => {
                  const isActive = index === activeIndex;
                  const isSelected = option.value === value;
                  return (
                    <div
                      key={option.value}
                      id={`${listboxId}-option-${index}`}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled || undefined}
                      className={clsx(
                        "flex min-h-9 items-center justify-between gap-3 rounded-lg px-2.5 py-1.5",
                        option.disabled
                          ? "cursor-not-allowed opacity-40"
                          : "cursor-pointer",
                      )}
                      style={
                        isActive
                          ? {
                              background:
                                "color-mix(in srgb, var(--gt-selection-outline) 14%, var(--gt-row-bg))",
                            }
                          : undefined
                      }
                      onMouseEnter={() => activateIndex(index)}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        if (!option.disabled) commitValue(option.value);
                      }}
                    >
                      <span className="min-w-0 truncate">
                        {renderOption?.(option, option.value) ?? option.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className={clsx(
                          "text-xs font-bold text-[var(--gt-selection-outline)]",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      >
                        ✓
                      </span>
                    </div>
                  );
                })
              )}
              <span className="sr-only" aria-live="polite">
                {activeOption?.label}
              </span>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

/** Keyboard-first custom listbox cell with no third-party UI dependency. */
export function SelectCell<TData, TValue extends string>({
  options,
  ariaLabel,
  placeholder = "Select…",
  renderOption,
  ...cell
}: SelectCellProps<TData, TValue>) {
  const SelectInput = React.useMemo(
    () =>
      function SelectInput(props: EditableCellInputProps<TValue>) {
        return (
          <SelectEditor
            {...props}
            options={options}
            ariaLabel={ariaLabel}
            placeholder={placeholder}
            renderOption={renderOption}
          />
        );
      },
    [ariaLabel, options, placeholder, renderOption],
  );
  const renderValue = React.useCallback(
    (value: TValue) => {
      const option = options.find((candidate) => candidate.value === value);
      return (
        renderOption?.(option, value) ?? option?.label ?? value ?? placeholder
      );
    },
    [options, placeholder, renderOption],
  );

  return (
    <EditableCell
      {...cell}
      renderInput={SelectInput}
      renderValue={renderValue}
    />
  );
}
