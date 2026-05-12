import type { GigatableTheme } from "./types";
import { themes } from "./presets";

function toPx(v: string | number): string {
  return typeof v === "number" ? `${v}px` : v;
}

function toStr(v: string | number): string {
  return String(v);
}

export function resolveTheme(theme?: GigatableTheme): Record<string, string> {
  const base = themes.light;
  const h = { ...base.header, ...theme?.header };
  const r = { ...base.row, ...theme?.row };
  const c = { ...base.cell, ...theme?.cell };
  const s = { ...base.selection, ...theme?.selection };
  const p = { ...base.paste, ...theme?.paste };
  const f = { ...base.fill, ...theme?.fill };

  return {
    "--gt-header-bg": h.background!,
    "--gt-header-text-color": h.textColor!,
    "--gt-header-border-color": h.borderColor!,
    "--gt-header-height": toPx(h.height!),
    "--gt-header-font-size": toPx(h.fontSize!),
    "--gt-header-font-family": h.fontFamily!,
    "--gt-header-font-weight": toStr(h.fontWeight!),
    "--gt-row-height": toPx(r.height!),
    "--gt-row-bg": r.background!,
    "--gt-row-hover-bg": r.hoverBackground!,
    "--gt-cell-border-color": c.borderColor!,
    "--gt-cell-font-size": toPx(c.fontSize!),
    "--gt-cell-font-family": c.fontFamily!,
    "--gt-cell-font-weight": toStr(c.fontWeight!),
    "--gt-cell-text-color": c.textColor!,
    "--gt-cell-padding-x": toPx(c.paddingX!),
    "--gt-cell-padding-y": toPx(c.paddingY!),
    "--gt-selection-outline": s.outline!,
    "--gt-range-bg": s.rangeBackground!,
    "--gt-paste-highlight-bg": p.highlightBackground!,
    "--gt-paste-highlight-border": p.highlightBorderColor!,
    "--gt-fill-preview-bg": f.previewBackground!,
    "--gt-fill-preview-text-color": f.previewTextColor!,
  };
}
