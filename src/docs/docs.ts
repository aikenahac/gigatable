import installationContent from "./content/installation.md?raw";
import usageContent from "./content/usage.md?raw";
import themingContent from "./content/theming.md?raw";
import apiContent from "./content/api.md?raw";
import typesContent from "./content/types.md?raw";
import contributorOverviewContent from "./content/contributor-overview.md?raw";
import contributorFileMapContent from "./content/contributor-file-map.md?raw";
import contributorArchitectureContent from "./content/contributor-architecture.md?raw";
import contributorInteractionsContent from "./content/contributor-interactions.md?raw";
import contributorThemingDistributionContent from "./content/contributor-theming-distribution.md?raw";

export const docsSlugs = [
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
] as const;

export type DocsSlug = (typeof docsSlugs)[number];
export type DocsSectionId = "usage" | "contributor";

export interface DocsNavItem {
  slug: DocsSlug;
  title: string;
  description: string;
  content: string;
}

export interface DocsSection {
  id: DocsSectionId;
  title: string;
  description: string;
  items: Array<DocsNavItem>;
}

export interface MarkdownHeading {
  id: string;
  level: 2 | 3;
  title: string;
}

export const docsSections: Array<DocsSection> = [
  {
    id: "usage",
    title: "Usage",
    description: "Install and use Gigatable in an application.",
    items: [
      {
        slug: "installation",
        title: "Installation",
        description: "Install Gigatable with npx, pnpm, yarn, or bun.",
        content: installationContent,
      },
      {
        slug: "usage",
        title: "Usage",
        description:
          "Wire the hook, component, editable cells, and feature flags.",
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
    ],
  },
  {
    id: "contributor",
    title: "Contributor",
    description: "Understand how the Gigatable source is organized and built.",
    items: [
      {
        slug: "contributor-overview",
        title: "Internals Overview",
        description:
          "Source-of-truth layout, exported surface, and package boundaries.",
        content: contributorOverviewContent,
      },
      {
        slug: "contributor-file-map",
        title: "File Map",
        description:
          "Module ownership and where to make common implementation changes.",
        content: contributorFileMapContent,
      },
      {
        slug: "contributor-architecture",
        title: "Architecture",
        description:
          "How the hook, renderer, TanStack Table, and virtualizer cooperate.",
        content: contributorArchitectureContent,
      },
      {
        slug: "contributor-interactions",
        title: "Interactions",
        description:
          "Selection, editing, clipboard, fill handle, and history internals.",
        content: contributorInteractionsContent,
      },
      {
        slug: "contributor-theming-distribution",
        title: "Theming and Distribution",
        description:
          "Theme variables, type augmentation, CLI sync, and release flow.",
        content: contributorThemingDistributionContent,
      },
    ],
  },
];

export const docsNav: Array<DocsNavItem> = docsSections.flatMap(
  (section) => section.items,
);

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
