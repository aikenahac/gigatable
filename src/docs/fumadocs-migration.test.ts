import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import parityHashes from "./content-parity.json";
import { docsManifest } from "./docs-manifest";
import {
  remarkGithubAlerts,
  remarkPackageManagerTabs,
} from "./remark-plugins";
import { stripDocumentationFrontmatter } from "../../scripts/docs-assets-plugin";

const contentDirectory = path.resolve(process.cwd(), "src/docs/content");

describe("Fumadocs documentation source", () => {
  it("publishes exactly the approved 28 pages in the existing order", () => {
    expect(docsManifest).toHaveLength(28);
    expect(docsManifest[0].slug).toBe("overview");
    expect(Array.from(new Set(docsManifest.map((page) => page.sectionTitle)))).toEqual([
      "Start",
      "Guides",
      "Customization",
      "Reference",
      "Contributing",
    ]);

    const markdownFiles = readdirSync(contentDirectory)
      .filter((file) => file.endsWith(".md"))
      .sort();
    const publishedFiles: string[] = docsManifest
      .map((page) => page.sourceFile)
      .sort();

    expect(markdownFiles).toHaveLength(30);
    expect(markdownFiles.filter((file) => !publishedFiles.includes(file))).toEqual([
      "api.md",
      "usage.md",
    ]);
  });

  it("keeps every pre-migration Markdown body byte-for-byte unchanged", () => {
    expect(Object.keys(parityHashes)).toHaveLength(28);

    for (const page of docsManifest) {
      const source = readFileSync(
        path.join(contentDirectory, page.sourceFile),
        "utf8",
      );
      const body = stripDocumentationFrontmatter(source);
      const digest = createHash("sha256").update(body).digest("hex");

      expect(digest, page.sourceFile).toBe(
        parityHashes[page.sourceFile as keyof typeof parityHashes],
      );
      expect(source).toMatch(/^---\n/);
    }
  });
});

describe("Fumadocs Markdown transforms", () => {
  it("turns the four package manager commands into persistent native tabs", () => {
    const tree = {
      type: "root",
      children: [
        { type: "html", value: "<!-- package-manager-tabs -->" },
        {
          type: "code",
          lang: "bash",
          value:
            "npx gigatable init\npnpm dlx gigatable init\nyarn dlx gigatable init\nbunx gigatable init",
        },
      ],
    };

    remarkPackageManagerTabs()(tree);

    expect(tree.children).toHaveLength(4);
    const tabs = tree.children as Array<{ meta?: string }>;
    expect(tabs.map((node) => node.meta)).toEqual([
      'tab="npm" tab-group="gigatable-package-manager"',
      'tab="pnpm"',
      'tab="yarn"',
      'tab="bun"',
    ]);
  });

  it.each([
    ["NOTE", "info"],
    ["TIP", "idea"],
    ["WARNING", "warning"],
  ])("turns %s alerts into labelled Fumadocs callouts", (label, type) => {
    const tree = {
      type: "root",
      children: [
        {
          type: "blockquote",
          children: [
            {
              type: "paragraph",
              children: [{ type: "text", value: `[!${label}] Keep this text.` }],
            },
          ],
        },
      ],
    };

    remarkGithubAlerts()(tree);

    expect(tree.children[0]).toMatchObject({
      type: "mdxJsxFlowElement",
      name: "Callout",
      attributes: [
        { name: "title", value: label },
        { name: "type", value: type },
      ],
    });
    expect(tree.children[0].children[0].children[0].value).toBe(
      "Keep this text.",
    );
  });
});
