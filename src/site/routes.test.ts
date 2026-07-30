import { describe, expect, it } from "vitest";
import { getHashTargetId, getRouteForPath } from "./routes";

describe("getRouteForPath", () => {
  it("maps the root path to the landing route", () => {
    expect(getRouteForPath("/")).toEqual({ name: "landing" });
  });

  it("maps demo paths to the demo route", () => {
    expect(getRouteForPath("/demo")).toEqual({ name: "demo" });
  });

  it("maps /docs to the documentation overview", () => {
    expect(getRouteForPath("/docs")).toEqual({
      name: "docs",
      slug: "overview",
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
      slug: "overview",
    });
  });

  it("decodes deep-link heading targets safely", () => {
    expect(getHashTargetId("#parse-domain-values")).toBe("parse-domain-values");
    expect(getHashTargetId("#custom%20heading")).toBe("custom heading");
    expect(getHashTargetId("#broken%")).toBe("broken%");
    expect(getHashTargetId("")).toBe("");
  });
});
