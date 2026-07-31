import { memo } from "react";
import clsx from "clsx";
import { cellToneColors, type CellTone } from "./types";

/** Props for {@link ProgressCell}. */
export interface ProgressCellProps {
  /** Current progress value. */
  value: number;
  /** Maximum progress value. */
  max?: number;
  /** Accessible description of the tracked work. */
  label: string;
  /** Semantic visual treatment. */
  tone?: CellTone;
  /** Formats the visible progress value. */
  formatValue?: (value: number, max: number) => string;
  /** Additional source-owned styles. */
  className?: string;
}

/** Compact, accessible progress display for read-only cells. */
export const ProgressCell = memo(function ProgressCell({
  value,
  max = 100,
  label,
  tone = "info",
  formatValue = (current, total) => `${Math.round((current / total) * 100)}%`,
  className,
}: ProgressCellProps) {
  const safeMax = max > 0 ? max : 100;
  const safeValue = Math.min(Math.max(value, 0), safeMax);
  const percentage = (safeValue / safeMax) * 100;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={safeValue}
      className={clsx("flex w-full items-center gap-2", className)}
    >
      <span
        className="h-1.5 min-w-12 flex-1 overflow-hidden rounded-full"
        style={{
          background:
            "color-mix(in srgb, var(--gt-cell-text-color) 11%, transparent)",
        }}
      >
        <span
          className="block h-full rounded-full"
          style={{
            width: `${percentage}%`,
            background: cellToneColors[tone],
          }}
        />
      </span>
      <span className="min-w-9 text-right text-[0.68rem] font-semibold tabular-nums text-[var(--gt-cell-text-color)]">
        {formatValue(safeValue, safeMax)}
      </span>
    </div>
  );
});
