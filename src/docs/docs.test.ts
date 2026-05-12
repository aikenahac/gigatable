import { describe, expect, it } from "vitest";
import { docsNav, extractMarkdownHeadings, getDocBySlug } from "./docs";

describe("docsNav", () => {
  it("orders package-consumer docs from installation through types", () => {
    expect(docsNav.map((item) => item.slug)).toEqual([
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
