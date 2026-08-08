import { loader } from "fumadocs-core/source";
import { remarkMdxMermaid } from "fumadocs-core/mdx-plugins";
import { pageSchema } from "fumadocs-core/source/schema";
import { applyMdxPreset } from "fumadocs-mdx/config";
import { defineDocs } from "fumadocs-mdx/macro";
import { z } from "zod";
import {
  remarkGithubAlerts,
  remarkPackageManagerTabs,
} from "./remark-plugins";

export const docsFrontmatterSchema = pageSchema.extend({
  summary: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string(),
  section: z.enum([
    "start",
    "guides",
    "customization",
    "reference",
    "contributing",
  ]),
  sectionTitle: z.string(),
  keywords: z.array(z.string()),
  audience: z.enum(["consumer", "contributor"]),
});

const docs = defineDocs({
  dir: "src/docs/content",
  docs: {
    files: [
      "overview.md",
      "installation.md",
      "agent-skill.md",
      "quickstart.md",
      "columns-editing.md",
      "selection-navigation.md",
      "clipboard-paste.md",
      "fill-handle.md",
      "history-clearing.md",
      "column-resizing.md",
      "virtualization-performance.md",
      "theming.md",
      "column-metadata.md",
      "custom-inputs.md",
      "optional-cells.md",
      "composition.md",
      "context-quick-edit.md",
      "gigatable-api.md",
      "use-gigatable-api.md",
      "editable-cell-api.md",
      "hooks-context-api.md",
      "types.md",
      "keyboard-shortcuts.md",
      "contributor-overview.md",
      "contributor-file-map.md",
      "contributor-architecture.md",
      "contributor-interactions.md",
      "contributor-theming-distribution.md",
    ],
    async: true,
    lastModified: true,
    schema: docsFrontmatterSchema,
    mdxOptions: applyMdxPreset({
      remarkPlugins: (plugins) => [
        remarkPackageManagerTabs,
        remarkGithubAlerts,
        remarkMdxMermaid,
        ...plugins,
      ],
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    files: ["**/meta.json"],
  },
});

export const docsSource = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  url(slugs) {
    if (slugs.length === 0 || slugs[0] === "overview") return "/docs/";
    return `/docs/${slugs.join("/")}/`;
  },
});

function withTrailingSlash(url: string) {
  return url.endsWith("/") ? url : `${url}/`;
}

for (const page of docsSource.getPages()) {
  page.url = withTrailingSlash(page.url);
}

function canonicalizePageTree(node: unknown): void {
  if (!node || typeof node !== "object") return;

  const item = node as { children?: unknown[]; url?: string };
  if (typeof item.url === "string" && item.url.startsWith("/docs")) {
    item.url = withTrailingSlash(item.url);
  }

  item.children?.forEach(canonicalizePageTree);
}

export const docsPageTree = docsSource.pageTree;
canonicalizePageTree(docsPageTree);

export function getDocsPage(slugs?: string[]) {
  return docsSource.getPage(slugs?.length ? slugs : ["overview"]);
}

export function getPublishedDocs() {
  return docsSource.getPages();
}
