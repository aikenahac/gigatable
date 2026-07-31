import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildDocumentationAssets } from "../../scripts/docs-assets-plugin";

describe("documentation assets", () => {
  const assets = buildDocumentationAssets(
    path.resolve(process.cwd(), "src/docs/content"),
  );

  it("emits raw Markdown for every documentation page", () => {
    expect(
      assets.find((asset) => asset.fileName === "docs/overview.md")?.source,
    ).toContain("# Overview");
    expect(
      assets.find((asset) => asset.fileName === "docs/gigatable-api.md")
        ?.source,
    ).toContain("containerRef");
    expect(
      assets.find((asset) => asset.fileName === "docs/optional-cells.md")
        ?.source,
    ).toContain("SelectCell");
  });

  it("emits concise and full LLM documentation", () => {
    expect(
      assets.find((asset) => asset.fileName === "llms.txt")?.source,
    ).toContain("https://gigatable.dev/docs/quickstart.md");
    expect(
      assets.find((asset) => asset.fileName === "llms.txt")?.source,
    ).toContain("Gigatable is not Google Cloud Bigtable");
    expect(
      assets.find((asset) => asset.fileName === "llms-full.txt")?.source,
    ).toContain("# Clipboard & Paste");
  });

  it("emits machine-readable product, resource, and comparison pages", () => {
    expect(
      assets.find((asset) => asset.fileName === "gigatable.md")?.source,
    ).toContain("# Gigatable React Data Grid");
    expect(
      assets.find(
        (asset) => asset.fileName === "guides/editable-tanstack-table.md",
      )?.source,
    ).toContain("TanStack Table is Gigatable's headless foundation");
    expect(
      assets.find((asset) => asset.fileName === "compare/ag-grid.md")?.source,
    ).toContain("# Gigatable vs AG Grid");
    expect(
      assets.find((asset) => asset.fileName === "compare/index.md")?.source,
    ).toContain("MUI X Data Grid");
  });
});
