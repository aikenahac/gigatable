import { clsx } from "clsx";
import type { ColumnResizeDirection } from "@tanstack/react-table";

export function shouldRenderColumnResizer(
  allowColumnResizing: boolean,
  canResize: boolean,
) {
  return allowColumnResizing && canResize;
}

export function getColumnResizerClassName(
  direction: ColumnResizeDirection | undefined,
  isResizing: boolean,
) {
  const resolvedDirection = direction ?? "ltr";
  return clsx("gt-column-resizer", `gt-column-resizer-${resolvedDirection}`, {
    "is-resizing": isResizing,
  });
}
