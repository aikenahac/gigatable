import { describe, it, expect } from "vitest";
import { resolveTheme } from "./utils";
import { themes } from "./presets";

describe("resolveTheme", () => {
  it("returns light-preset CSS variable values when called with no argument", () => {
    const vars = resolveTheme();
    expect(vars["--gt-header-bg"]).toBe("#374151");
    expect(vars["--gt-header-text-color"]).toBe("#f9fafb");
    expect(vars["--gt-selection-outline"]).toBe("#3d5aa9");
    expect(vars["--gt-fill-preview-text-color"]).toBe("#6b8ccd");
  });

  it("overrides only the specified section fields, leaving others at light defaults", () => {
    const vars = resolveTheme({ header: { background: "navy" } });
    expect(vars["--gt-header-bg"]).toBe("navy");
    expect(vars["--gt-header-text-color"]).toBe("#f9fafb");
    expect(vars["--gt-selection-outline"]).toBe("#3d5aa9");
  });

  it("overrides fields across multiple sections independently", () => {
    const vars = resolveTheme({
      row: { height: 36 },
      selection: { outline: "orange" },
    });
    expect(vars["--gt-row-height"]).toBe("36px");
    expect(vars["--gt-selection-outline"]).toBe("orange");
    expect(vars["--gt-header-bg"]).toBe("#374151");
  });

  it("converts a number row height to a px string", () => {
    const vars = resolveTheme({ row: { height: 40 } });
    expect(vars["--gt-row-height"]).toBe("40px");
  });

  it("converts a number fontSize to a px string", () => {
    const vars = resolveTheme({ cell: { fontSize: 16 } });
    expect(vars["--gt-cell-font-size"]).toBe("16px");
  });

  it("converts a number fontWeight to a plain numeric string without px", () => {
    const vars = resolveTheme({ header: { fontWeight: 700 } });
    expect(vars["--gt-header-font-weight"]).toBe("700");
  });

  it("passes a CSS variable reference string through unchanged", () => {
    const vars = resolveTheme({ selection: { outline: "var(--primary)" } });
    expect(vars["--gt-selection-outline"]).toBe("var(--primary)");
  });

  it("returns exactly 23 CSS variable keys", () => {
    const vars = resolveTheme();
    expect(Object.keys(vars)).toHaveLength(23);
  });

  it("resolves themes.dark correctly", () => {
    const vars = resolveTheme(themes.dark);
    expect(vars["--gt-header-bg"]).toBe("#1e293b");
    expect(vars["--gt-cell-text-color"]).toBe("#e2e8f0");
    expect(vars["--gt-selection-outline"]).toBe("#60a5fa");
    expect(vars["--gt-row-bg"]).toBe("#0f172a");
  });
});
