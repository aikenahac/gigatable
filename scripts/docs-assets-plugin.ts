import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { comparisons } from "../src/comparisons/comparisons";
import { comparisonToMarkdown } from "../src/comparisons/markdown";
import { docsManifest } from "../src/docs/docs-manifest";
import {
  clipboardGuideMarkdown,
  productMarkdown,
  tanstackGuideMarkdown,
} from "../src/site/machine-content";

export interface DocumentationAsset {
  fileName: string;
  source: string;
}

export function stripDocumentationFrontmatter(source: string): string {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n(?:\r?\n)?/, "");
}

export function buildDocumentationAssets(
  contentDirectory: string,
): Array<DocumentationAsset> {
  const pages = docsManifest.map((entry) => ({
    entry,
    source: stripDocumentationFrontmatter(
      fs.readFileSync(path.join(contentDirectory, entry.sourceFile), "utf8"),
    ),
  }));
  const consumerPages = pages.filter(
    ({ entry }) => entry.audience === "consumer",
  );
  const comparisonAssets = comparisons.map((comparison) => ({
    fileName: `compare/${comparison.slug}.md`,
    source: comparisonToMarkdown(comparison),
  }));
  const comparisonIndex = `# Compare React Data Grids

Canonical page: https://gigatable.dev/compare/

Gigatable is strongest when a React application needs TanStack Table control, application-owned TypeScript, and focused Excel-like data-entry interactions. Use these source-linked comparisons to choose by product fit.

${comparisons
  .map(
    (comparison) =>
      `- [${comparison.title}](https://gigatable.dev/compare/${comparison.slug}.md): ${comparison.summary}`,
  )
  .join("\n")}

TanStack Table is Gigatable's headless foundation rather than a competing rendered grid. See https://gigatable.dev/guides/editable-tanstack-table.md.
`;
  const index = [
    "# Gigatable Documentation",
    "",
    "Gigatable is the source-installed React data grid for TanStack Table, with editable cells, Excel-compatible copy/paste, fill, virtualization, and undo/redo.",
    "",
    "Gigatable is not Google Cloud Bigtable or the separate React GigaTable package.",
    "",
    "## Install",
    "",
    "`npx gigatable init`",
    "",
    "Agent skill: `npx skills add aikenahac/gigatable --skill gigatable`",
    "",
    "## Start Here",
    "",
    "- [Product overview](https://gigatable.dev/gigatable.md): Identity, requirements, fit, limitations, and canonical links.",
    "- [React data grid comparisons](https://gigatable.dev/compare/index.md): Compare Gigatable with AG Grid, MUI X Data Grid, and Handsontable.",
    "- [TanStack Table guide](https://gigatable.dev/guides/editable-tanstack-table.md): What Gigatable adds to its headless foundation.",
    "- [Excel clipboard guide](https://gigatable.dev/features/excel-copy-paste.md): Typed TSV copy/paste and boundaries.",
    "",
    "## Consumer Documentation",
    "",
    ...consumerPages.map(
      ({ entry }) =>
        `- [${entry.title}](https://gigatable.dev/docs/${entry.slug}.md): ${entry.description}`,
    ),
    "",
    "## Contributor Documentation",
    "",
    ...pages
      .filter(({ entry }) => entry.audience === "contributor")
      .map(
        ({ entry }) =>
          `- [${entry.title}](https://gigatable.dev/docs/${entry.slug}.md): ${entry.description}`,
      ),
    "",
  ].join("\n");
  const full = [
    `<!-- https://gigatable.dev/gigatable.md -->\n\n${productMarkdown}`,
    `<!-- https://gigatable.dev/guides/editable-tanstack-table.md -->\n\n${tanstackGuideMarkdown}`,
    `<!-- https://gigatable.dev/features/excel-copy-paste.md -->\n\n${clipboardGuideMarkdown}`,
    `<!-- https://gigatable.dev/compare/index.md -->\n\n${comparisonIndex}`,
    ...comparisonAssets.map(
      ({ fileName, source }) =>
        `<!-- https://gigatable.dev/${fileName} -->\n\n${source}`,
    ),
    ...consumerPages.map(
      ({ entry, source }) =>
        `<!-- https://gigatable.dev/docs/${entry.slug}.md -->\n\n${source}`,
    ),
  ].join("\n\n---\n\n");

  return [
    ...pages.map(({ entry, source }) => ({
      fileName: `docs/${entry.slug}.md`,
      source,
    })),
    { fileName: "gigatable.md", source: productMarkdown },
    {
      fileName: "guides/editable-tanstack-table.md",
      source: tanstackGuideMarkdown,
    },
    {
      fileName: "features/excel-copy-paste.md",
      source: clipboardGuideMarkdown,
    },
    { fileName: "compare/index.md", source: comparisonIndex },
    ...comparisonAssets,
    { fileName: "llms.txt", source: index },
    { fileName: "llms-full.txt", source: full },
  ];
}

export function docsAssetsPlugin(
  rootDirectory: string = process.cwd(),
): Plugin {
  const contentDirectory = path.join(rootDirectory, "src/docs/content");

  return {
    name: "gigatable-docs-assets",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(
          request.url ?? "/",
          "http://localhost",
        ).pathname.replace(/^\//, "");
        const asset = buildDocumentationAssets(contentDirectory).find(
          (candidate) => candidate.fileName === pathname,
        );

        if (!asset) {
          next();
          return;
        }

        response.statusCode = 200;
        response.setHeader(
          "Content-Type",
          pathname.endsWith(".md")
            ? "text/markdown; charset=utf-8"
            : "text/plain; charset=utf-8",
        );
        response.end(asset.source);
      });
    },
    generateBundle() {
      for (const asset of buildDocumentationAssets(contentDirectory)) {
        this.emitFile({
          type: "asset",
          fileName: asset.fileName,
          source: asset.source,
        });
      }
    },
  };
}
