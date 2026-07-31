import { memo } from "react";
import clsx from "clsx";
import { cellToneColors, type CellTone } from "./types";

/** Props for {@link BadgeCell}. */
export interface BadgeCellProps {
  /** Visible badge text. */
  label: string;
  /** Semantic visual treatment. */
  tone?: CellTone;
  /** Additional source-owned styles. */
  className?: string;
}

/** Lightweight status or category display for a Gigatable cell. */
export const BadgeCell = memo(function BadgeCell({
  label,
  tone = "neutral",
  className,
}: BadgeCellProps) {
  return (
    <span
      className={clsx(
        "inline-flex max-w-full items-center truncate rounded-full border px-2 py-0.5 text-[0.7rem] font-semibold leading-[1.2]",
        className,
      )}
      style={{
        background: `color-mix(in srgb, ${cellToneColors[tone]} 12%, var(--gt-row-bg))`,
        borderColor: `color-mix(in srgb, ${cellToneColors[tone]} 32%, transparent)`,
        color: `color-mix(in srgb, ${cellToneColors[tone]} 62%, var(--gt-cell-text-color))`,
      }}
    >
      {label}
    </span>
  );
});
