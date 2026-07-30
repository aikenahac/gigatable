import { describe, expect, it } from "vitest";
import { docsManifest } from "../docs/docs-manifest";
import {
  canonicalRoutes,
  getJsonLdForRoute,
  getSeoForRoute,
  siteOrigin,
} from "./seo";

describe("SEO registry", () => {
  it("owns 31 unique canonical routes", () => {
    const canonicals = canonicalRoutes.map(
      (route) => getSeoForRoute(route).canonicalPath,
    );

    expect(canonicals).toHaveLength(31);
    expect(new Set(canonicals).size).toBe(31);
    expect(canonicals).toContain("/");
    expect(canonicals).toContain("/docs/");
    expect(canonicals).toContain("/features/excel-copy-paste/");
    expect(canonicals).not.toContain("/compare/open-source-react-data-grids/");
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
      "Open-Source React Data Grid with Excel-Like UX | Gigatable",
    );
    expect(homepage.description).toBe(
      "Build editable, virtualized React grids with selection, Excel-compatible copy/paste, fill and undo/redo. Install the TypeScript source with npx gigatable init.",
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

    expect(homepage).toContain("SoftwareSourceCode");
    expect(homepage).not.toContain("aggregateRating");
    expect(guide.map((entry) => entry["@type"])).toEqual([
      "TechArticle",
      "BreadcrumbList",
    ]);
  });
});
