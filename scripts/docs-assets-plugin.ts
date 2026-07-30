import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { docsManifest } from "../src/docs/docs-manifest";

export interface DocumentationAsset {
  fileName: string;
  source: string;
}

export function buildDocumentationAssets(
  contentDirectory: string,
): Array<DocumentationAsset> {
  const pages = docsManifest.map((entry) => ({
    entry,
    source: fs.readFileSync(
      path.join(contentDirectory, entry.sourceFile),
      "utf8",
    ),
  }));
  const consumerPages = pages.filter(
    ({ entry }) => entry.audience === "consumer",
  );
  const index = [
    "# Gigatable Documentation",
    "",
    "Gigatable is an Excel-grade, source-installed data grid for React.",
    "",
    ...consumerPages.map(
      ({ entry }) =>
        `- [${entry.title}](/docs/${entry.slug}.md): ${entry.description}`,
    ),
    "",
    "## Contributor Documentation",
    "",
    ...pages
      .filter(({ entry }) => entry.audience === "contributor")
      .map(
        ({ entry }) =>
          `- [${entry.title}](/docs/${entry.slug}.md): ${entry.description}`,
      ),
    "",
  ].join("\n");
  const full = consumerPages
    .map(({ entry, source }) => `<!-- /docs/${entry.slug}.md -->\n\n${source}`)
    .join("\n\n---\n\n");

  return [
    ...pages.map(({ entry, source }) => ({
      fileName: `docs/${entry.slug}.md`,
      source,
    })),
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
