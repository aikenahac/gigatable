import overviewContent from "./content/overview.md?raw";
import installationContent from "./content/installation.md?raw";
import agentSkillContent from "./content/agent-skill.md?raw";
import quickstartContent from "./content/quickstart.md?raw";
import columnsEditingContent from "./content/columns-editing.md?raw";
import selectionNavigationContent from "./content/selection-navigation.md?raw";
import clipboardPasteContent from "./content/clipboard-paste.md?raw";
import fillHandleContent from "./content/fill-handle.md?raw";
import historyClearingContent from "./content/history-clearing.md?raw";
import columnResizingContent from "./content/column-resizing.md?raw";
import virtualizationPerformanceContent from "./content/virtualization-performance.md?raw";
import themingContent from "./content/theming.md?raw";
import columnMetadataContent from "./content/column-metadata.md?raw";
import customInputsContent from "./content/custom-inputs.md?raw";
import compositionContent from "./content/composition.md?raw";
import contextQuickEditContent from "./content/context-quick-edit.md?raw";
import gigatableApiContent from "./content/gigatable-api.md?raw";
import useGigatableApiContent from "./content/use-gigatable-api.md?raw";
import editableCellApiContent from "./content/editable-cell-api.md?raw";
import hooksContextApiContent from "./content/hooks-context-api.md?raw";
import typesContent from "./content/types.md?raw";
import keyboardShortcutsContent from "./content/keyboard-shortcuts.md?raw";
import contributorOverviewContent from "./content/contributor-overview.md?raw";
import contributorFileMapContent from "./content/contributor-file-map.md?raw";
import contributorArchitectureContent from "./content/contributor-architecture.md?raw";
import contributorInteractionsContent from "./content/contributor-interactions.md?raw";
import contributorThemingDistributionContent from "./content/contributor-theming-distribution.md?raw";
import {
  defaultDocsSlug,
  docsManifest,
  isDocsSlug,
  type DocsSectionId,
  type DocsSlug,
} from "./docs-manifest";

export {
  defaultDocsSlug,
  docsManifest,
  isDocsSlug,
  type DocsSectionId,
  type DocsSlug,
};

const contentBySlug: Record<DocsSlug, string> = {
  overview: overviewContent,
  installation: installationContent,
  "agent-skill": agentSkillContent,
  quickstart: quickstartContent,
  "columns-editing": columnsEditingContent,
  "selection-navigation": selectionNavigationContent,
  "clipboard-paste": clipboardPasteContent,
  "fill-handle": fillHandleContent,
  "history-clearing": historyClearingContent,
  "column-resizing": columnResizingContent,
  "virtualization-performance": virtualizationPerformanceContent,
  theming: themingContent,
  "column-metadata": columnMetadataContent,
  "custom-inputs": customInputsContent,
  composition: compositionContent,
  "context-quick-edit": contextQuickEditContent,
  "gigatable-api": gigatableApiContent,
  "use-gigatable-api": useGigatableApiContent,
  "editable-cell-api": editableCellApiContent,
  "hooks-context-api": hooksContextApiContent,
  types: typesContent,
  "keyboard-shortcuts": keyboardShortcutsContent,
  "contributor-overview": contributorOverviewContent,
  "contributor-file-map": contributorFileMapContent,
  "contributor-architecture": contributorArchitectureContent,
  "contributor-interactions": contributorInteractionsContent,
  "contributor-theming-distribution": contributorThemingDistributionContent,
};

export interface DocsNavItem {
  slug: DocsSlug;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  section: DocsSectionId;
  sectionTitle: string;
  sourceFile: string;
  editUrl: string;
  keywords: readonly string[];
  audience: "consumer" | "contributor";
  content: string;
}

export interface DocsSection {
  id: DocsSectionId;
  title: string;
  items: Array<DocsNavItem>;
}

export interface MarkdownHeading {
  id: string;
  level: 2 | 3;
  title: string;
}

export const docsNav: Array<DocsNavItem> = docsManifest.map((entry) => ({
  ...entry,
  editUrl: `https://github.com/aikenahac/gigatable/edit/master/src/docs/content/${entry.sourceFile}`,
  content: contentBySlug[entry.slug],
}));

export const docsSections: Array<DocsSection> = Array.from(
  docsNav.reduce((sections, item) => {
    const section = sections.get(item.section) ?? {
      id: item.section,
      title: item.sectionTitle,
      items: [],
    };
    section.items.push(item);
    sections.set(item.section, section);
    return sections;
  }, new Map<DocsSectionId, DocsSection>()),
  ([, section]) => section,
);

export function getDocBySlug(slug: string): DocsNavItem {
  return docsNav.find((item) => item.slug === slug) ?? docsNav[0];
}

export function getDocPath(slug: DocsSlug): string {
  return slug === defaultDocsSlug ? "/docs/" : `/docs/${slug}/`;
}

export function getAdjacentDocs(slug: DocsSlug) {
  const index = docsNav.findIndex((item) => item.slug === slug);
  return {
    previous: index > 0 ? docsNav[index - 1] : null,
    next: index >= 0 && index < docsNav.length - 1 ? docsNav[index + 1] : null,
  };
}

export function getMarkdownHeadingId(title: string): string {
  return title
    .toLowerCase()
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractMarkdownHeadings(
  content: string,
): Array<MarkdownHeading> {
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
