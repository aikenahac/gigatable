import installationContent from "./content/installation.md?raw";
import usageContent from "./content/usage.md?raw";
import themingContent from "./content/theming.md?raw";
import apiContent from "./content/api.md?raw";
import typesContent from "./content/types.md?raw";

export const docsSlugs = [
  "installation",
  "usage",
  "theming",
  "api",
  "types",
] as const;

export type DocsSlug = (typeof docsSlugs)[number];

export interface DocsNavItem {
  slug: DocsSlug;
  title: string;
  description: string;
  content: string;
}

export interface MarkdownHeading {
  id: string;
  level: 2 | 3;
  title: string;
}

export const docsNav: Array<DocsNavItem> = [
  {
    slug: "installation",
    title: "Installation",
    description: "Install Gigatable with npx, pnpm, yarn, or bun.",
    content: installationContent,
  },
  {
    slug: "usage",
    title: "Usage",
    description: "Wire the hook, component, editable cells, and feature flags.",
    content: usageContent,
  },
  {
    slug: "theming",
    title: "Theming",
    description: "Customize presets, partial themes, and CSS variables.",
    content: themingContent,
  },
  {
    slug: "api",
    title: "API Reference",
    description: "Reference props, hook options, callbacks, and shortcuts.",
    content: apiContent,
  },
  {
    slug: "types",
    title: "Types",
    description: "Use the exported TypeScript types and TanStack metadata.",
    content: typesContent,
  },
];

export const defaultDocsSlug = docsNav[0].slug;

export function isDocsSlug(slug: string): slug is DocsSlug {
  return docsSlugs.includes(slug as DocsSlug);
}

export function getDocBySlug(slug: string): DocsNavItem {
  return docsNav.find((item) => item.slug === slug) ?? docsNav[0];
}

export function getMarkdownHeadingId(title: string): string {
  return title
    .toLowerCase()
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractMarkdownHeadings(content: string): Array<MarkdownHeading> {
  const headings: Array<MarkdownHeading> = [];

  content.split("\n").forEach((line) => {
    const match = /^(##|###)\s+(.+)$/.exec(line.trim());

    if (!match) {
      return;
    }

    const level = match[1].length as 2 | 3;
    const title = match[2].trim();

    headings.push({ id: getMarkdownHeadingId(title), level, title });
  });

  return headings;
}
