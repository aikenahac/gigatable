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
  });

  it("emits concise and full LLM documentation", () => {
    expect(
      assets.find((asset) => asset.fileName === "llms.txt")?.source,
    ).toContain("/docs/quickstart.md");
    expect(
      assets.find((asset) => asset.fileName === "llms-full.txt")?.source,
    ).toContain("# Clipboard & Paste");
  });
});
