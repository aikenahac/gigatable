import { describe, expect, it } from "vitest";
import {
  getColumnResizerClassName,
  shouldRenderColumnResizer,
} from "./gigatable";

describe("column resizing helpers", () => {
  it("renders a column resizer only when Gigatable and the column both allow it", () => {
    expect(shouldRenderColumnResizer(true, true)).toBe(true);
    expect(shouldRenderColumnResizer(false, true)).toBe(false);
    expect(shouldRenderColumnResizer(true, false)).toBe(false);
  });

  it("adds direction and active resizing classes to the resize handle", () => {
    expect(getColumnResizerClassName("ltr", true)).toContain(
      "gt-column-resizer-ltr",
    );
    expect(getColumnResizerClassName("rtl", false)).toContain(
      "gt-column-resizer-rtl",
    );
    expect(getColumnResizerClassName("ltr", true)).toContain("is-resizing");
    expect(getColumnResizerClassName(undefined, false)).toContain(
      "gt-column-resizer-ltr",
    );
  });
});
