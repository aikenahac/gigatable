import { describe, expect, it } from "vitest";
import {
  docsNav,
  docsSections,
  extractMarkdownHeadings,
  getDocBySlug,
} from "./docs";

describe("docsNav", () => {
  it("orders package-consumer docs from installation through types", () => {
    const usageSection = docsSections.find((section) => section.id === "usage");

    expect(usageSection?.items.map((item) => item.slug)).toEqual([
      "installation",
      "usage",
      "theming",
      "api",
      "types",
    ]);
  });

  it("includes install commands in the installation article", () => {
    const installation = getDocBySlug("installation");

    expect(installation.content).toContain("npx gigatable init");
    expect(installation.content).toContain("pnpm dlx gigatable init");
    expect(installation.content).toContain("bunx gigatable init");
  });

  it("groups contributor docs separately from usage docs", () => {
    const contributorSection = docsSections.find(
      (section) => section.id === "contributor",
    );

    expect(docsSections.map((section) => section.title)).toEqual([
      "Usage",
      "Contributor",
    ]);
    expect(contributorSection?.items.map((item) => item.slug)).toEqual([
      "contributor-overview",
      "contributor-file-map",
      "contributor-architecture",
      "contributor-interactions",
      "contributor-theming-distribution",
    ]);
    expect(docsNav.map((item) => item.slug)).toEqual([
      "installation",
      "usage",
      "theming",
      "api",
      "types",
      "contributor-overview",
      "contributor-file-map",
      "contributor-architecture",
      "contributor-interactions",
      "contributor-theming-distribution",
    ]);
  });

  it("documents implementation ownership and state flow for contributors", () => {
    const overview = getDocBySlug("contributor-overview");
    const fileMap = getDocBySlug("contributor-file-map");
    const architecture = getDocBySlug("contributor-architecture");

    expect(overview.content).toContain("src/gigatable");
    expect(fileMap.content).toContain("Module ownership");
    expect(architecture.content).toContain("```mermaid");
    expect(architecture.content).toContain("useGigatable");
    expect(architecture.content).toContain("TanStack Virtual");
  });
});

describe("extractMarkdownHeadings", () => {
  it("extracts h2 and h3 headings with stable ids", () => {
    expect(
      extractMarkdownHeadings(`
# Page title

## Usage

### Editable cells

## API reference
      `),
    ).toEqual([
      { id: "usage", level: 2, title: "Usage" },
      { id: "editable-cells", level: 3, title: "Editable cells" },
      { id: "api-reference", level: 2, title: "API reference" },
    ]);
  });
});
