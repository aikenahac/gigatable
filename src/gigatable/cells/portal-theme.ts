import type * as React from "react";

const portalThemeVariables = [
  "--gt-row-bg",
  "--gt-row-hover-bg",
  "--gt-cell-border-color",
  "--gt-cell-text-color",
  "--gt-cell-font-family",
  "--gt-cell-font-size",
  "--gt-cell-font-weight",
  "--gt-selection-outline",
] as const;

export type CellPortalStyle = React.CSSProperties &
  Record<(typeof portalThemeVariables)[number], string>;

/** Copies inherited Gigatable theme variables onto a body-level editor portal. */
export function readCellPortalStyle(element: Element): CellPortalStyle {
  const computed = getComputedStyle(element);
  return Object.fromEntries(
    portalThemeVariables.map((variable) => [
      variable,
      computed.getPropertyValue(variable),
    ]),
  ) as unknown as CellPortalStyle;
}
