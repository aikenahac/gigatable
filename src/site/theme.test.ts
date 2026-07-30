import { describe, expect, it } from "vitest";
import { isThemeMode, resolveTheme } from "./theme";

describe("site theme helpers", () => {
  it("validates persisted modes", () => {
    expect(isThemeMode("system")).toBe(true);
    expect(isThemeMode("dark")).toBe(true);
    expect(isThemeMode("sepia")).toBe(false);
  });

  it("resolves system preferences and explicit modes", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("light", true)).toBe("light");
  });
});
