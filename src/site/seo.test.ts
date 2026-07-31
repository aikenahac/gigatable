import { describe, expect, it } from "vitest";
import { docsManifest } from "../docs/docs-manifest";
import {
  canonicalRoutes,
  getJsonLdForRoute,
  getRobotsTxt,
  getSeoForRoute,
  siteOrigin,
} from "./seo";

describe("SEO registry", () => {
  it("owns 36 unique canonical routes", () => {
    const canonicals = canonicalRoutes.map(
      (route) => getSeoForRoute(route).canonicalPath,
    );

    expect(canonicals).toHaveLength(36);
    expect(new Set(canonicals).size).toBe(36);
    expect(canonicals).toContain("/");
    expect(canonicals).toContain("/docs/");
    expect(canonicals).toContain("/features/excel-copy-paste/");
    expect(canonicals).toContain("/compare/");
    expect(canonicals).toContain("/compare/ag-grid/");
    expect(canonicals).toContain("/compare/mui-x-data-grid/");
    expect(canonicals).toContain("/compare/handsontable/");
  });

  it("gives every canonical route unique search metadata", () => {
    const metadata = canonicalRoutes.map(getSeoForRoute);

    expect(new Set(metadata.map((entry) => entry.title)).size).toBe(
      metadata.length,
    );
    expect(new Set(metadata.map((entry) => entry.description)).size).toBe(
      metadata.length,
    );
    expect(
      metadata.every(
        (entry) =>
          entry.robots.startsWith("index,follow") &&
          entry.image.endsWith(".png"),
      ),
    ).toBe(true);
  });

  it("uses the planned homepage positioning exactly", () => {
    const homepage = getSeoForRoute({ name: "landing" });

    expect(homepage.title).toBe(
      "Gigatable React Data Grid | Excel-Like, Source-Installed",
    );
    expect(homepage.description).toBe(
      "Gigatable is the source-installed React data grid for TanStack Table, with editable cells, Excel-compatible copy/paste, fill, virtualization and undo/redo.",
    );
    expect(`${siteOrigin}${homepage.canonicalPath}`).toBe(
      "https://gigatable.dev/",
    );
  });

  it("keeps documentation labels separate from SEO titles", () => {
    const quickstart = docsManifest.find(
      (entry) => entry.slug === "quickstart",
    );

    expect(quickstart?.title).toBe("Quickstart");
    expect(quickstart?.seoTitle).toBe("React Data Grid Quickstart | Gigatable");
  });

  it("generates visible-content structured data without rating claims", () => {
    const homepage = JSON.stringify(getJsonLdForRoute({ name: "landing" }));
    const guide = getJsonLdForRoute({
      name: "resource",
      slug: "editable-tanstack-table",
    });

    expect(homepage).toContain("SoftwareApplication");
    expect(homepage).toContain("SoftwareSourceCode");
    expect(homepage).toContain("not Google Cloud Bigtable");
    expect(homepage).toContain("https://www.npmjs.com/package/gigatable");
    expect(homepage).not.toContain("aggregateRating");
    expect(guide.map((entry) => entry["@type"])).toEqual([
      "TechArticle",
      "BreadcrumbList",
    ]);
  });

  it("publishes Markdown alternatives for content routes", () => {
    expect(getSeoForRoute({ name: "landing" }).markdownPath).toBe(
      "/gigatable.md",
    );
    expect(
      getSeoForRoute({ name: "comparison", slug: "ag-grid" }).markdownPath,
    ).toBe("/compare/ag-grid.md");
    expect(getSeoForRoute({ name: "demo" }).markdownPath).toBeUndefined();
  });

  it("allows search retrieval while blocking training crawlers", () => {
    const robots = getRobotsTxt();

    expect(robots).toContain(
      "Content-Signal: search=yes,ai-input=yes,ai-train=no,use=reference",
    );
    expect(robots).toMatch(/User-agent: OAI-SearchBot[\s\S]*?Allow: \//);
    expect(robots).toMatch(/User-agent: Claude-SearchBot[\s\S]*?Allow: \//);
    expect(robots).toMatch(/User-agent: GPTBot[\s\S]*?Disallow: \//);
    expect(robots).toMatch(/User-agent: ClaudeBot[\s\S]*?Disallow: \//);
  });
});
