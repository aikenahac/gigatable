import { describe, expect, it } from "vitest";
import { getCanonicalPath, getHashTargetId, getRouteForPath } from "./routes";

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

  it("maps the legacy overview alias to the canonical docs overview", () => {
    const aliasRoute = getRouteForPath("/docs/overview/");

    expect(aliasRoute).toEqual({ name: "docs", slug: "overview" });
    expect(getCanonicalPath(aliasRoute)).toBe("/docs/");
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

  it("returns a not-found route for unknown docs articles", () => {
    expect(getRouteForPath("/docs/not-real")).toEqual({
      name: "not-found",
    });
  });

  it("maps the high-intent resource pages", () => {
    expect(getRouteForPath("/guides/editable-tanstack-table/")).toEqual({
      name: "resource",
      slug: "editable-tanstack-table",
    });
    expect(getRouteForPath("/features/excel-copy-paste/")).toEqual({
      name: "resource",
      slug: "excel-copy-paste",
    });
  });

  it("maps the comparison hub and supported alternatives", () => {
    expect(getRouteForPath("/compare/")).toEqual({
      name: "comparison",
      slug: "overview",
    });
    expect(getRouteForPath("/compare/ag-grid/")).toEqual({
      name: "comparison",
      slug: "ag-grid",
    });
    expect(getRouteForPath("/compare/mui-x-data-grid/")).toEqual({
      name: "comparison",
      slug: "mui-x-data-grid",
    });
    expect(getRouteForPath("/compare/handsontable/")).toEqual({
      name: "comparison",
      slug: "handsontable",
    });
  });

  it("rejects unknown comparison pages", () => {
    expect(getRouteForPath("/compare/not-real/")).toEqual({
      name: "not-found",
    });
  });

  it("uses the clean demo URL and trailing slashes for article routes", () => {
    expect(getCanonicalPath(getRouteForPath("/docs"))).toBe("/docs/");
    expect(getCanonicalPath(getRouteForPath("/docs/theming"))).toBe(
      "/docs/theming/",
    );
    expect(getCanonicalPath(getRouteForPath("/demo"))).toBe("/demo");
    expect(getCanonicalPath(getRouteForPath("/compare/ag-grid"))).toBe(
      "/compare/ag-grid/",
    );
  });

  it("decodes deep-link heading targets safely", () => {
    expect(getHashTargetId("#parse-domain-values")).toBe("parse-domain-values");
    expect(getHashTargetId("#custom%20heading")).toBe("custom heading");
    expect(getHashTargetId("#broken%")).toBe("broken%");
    expect(getHashTargetId("")).toBe("");
  });
});
