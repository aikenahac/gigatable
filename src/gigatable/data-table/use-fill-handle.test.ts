import { describe, expect, it } from "vitest";
import { isFillAxisAllowed } from "./use-fill-handle";

describe("fill direction", () => {
  it("restricts single-axis fills and allows both axes", () => {
    expect(isFillAxisAllowed("vertical", "vertical")).toBe(true);
    expect(isFillAxisAllowed("vertical", "horizontal")).toBe(false);
    expect(isFillAxisAllowed("horizontal", "vertical")).toBe(false);
    expect(isFillAxisAllowed("both", "vertical")).toBe(true);
    expect(isFillAxisAllowed("both", "horizontal")).toBe(true);
  });
});
