import { describe, expect, it } from "vitest";
import { getRouteForPath } from "./routes";

describe("getRouteForPath", () => {
  it("maps the root path to the landing route", () => {
    expect(getRouteForPath("/")).toEqual({ name: "landing" });
  });

  it("maps demo paths to the demo route", () => {
    expect(getRouteForPath("/demo")).toEqual({ name: "demo" });
  });

  it("maps /docs to the first docs article", () => {
    expect(getRouteForPath("/docs")).toEqual({
      name: "docs",
      slug: "installation",
    });
  });

  it("maps known docs article paths to docs routes", () => {
    expect(getRouteForPath("/docs/theming")).toEqual({
      name: "docs",
      slug: "theming",
    });
  });

  it("maps contributor docs article paths to docs routes", () => {
    expect(getRouteForPath("/docs/contributor-architecture")).toEqual({
      name: "docs",
      slug: "contributor-architecture",
    });
  });

  it("falls back unknown docs article paths to the first docs article", () => {
    expect(getRouteForPath("/docs/not-real")).toEqual({
      name: "docs",
      slug: "installation",
    });
  });
});
