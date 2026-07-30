import {
  docsNav,
  extractMarkdownHeadings,
  getDocPath,
  type DocsNavItem,
  type DocsSlug,
} from "./docs";

export interface DocsSearchRecord {
  slug: DocsSlug;
  sectionTitle: string;
  pageTitle: string;
  heading: string | null;
  headingId: string | null;
  excerpt: string;
  searchText: string;
}

export interface DocsSearchResult extends DocsSearchRecord {
  score: number;
}

export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[|>*_~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function excerptFor(content: string, heading: string | null): string {
  const plain = stripMarkdown(content);
  if (!heading) {
    return plain.slice(0, 180);
  }

  const index = plain.toLowerCase().indexOf(heading.toLowerCase());
  const start = Math.max(0, index);
  return plain.slice(start, start + 180);
}

export function buildDocsSearchIndex(
  documents: Array<DocsNavItem> = docsNav,
): Array<DocsSearchRecord> {
  return documents.flatMap((doc) => {
    const pageRecord: DocsSearchRecord = {
      slug: doc.slug,
      sectionTitle: doc.sectionTitle,
      pageTitle: doc.title,
      heading: null,
      headingId: null,
      excerpt: excerptFor(doc.content, null),
      searchText: [
        doc.title,
        doc.description,
        ...doc.keywords,
        stripMarkdown(doc.content),
      ]
        .join(" ")
        .toLowerCase(),
    };

    return [
      pageRecord,
      ...extractMarkdownHeadings(doc.content).map((heading) => ({
        slug: doc.slug,
        sectionTitle: doc.sectionTitle,
        pageTitle: doc.title,
        heading: heading.title.replace(/`/g, ""),
        headingId: heading.id,
        excerpt: excerptFor(doc.content, heading.title.replace(/`/g, "")),
        searchText: [doc.title, doc.description, heading.title, ...doc.keywords]
          .join(" ")
          .toLowerCase(),
      })),
    ];
  });
}

function scoreRecord(record: DocsSearchRecord, terms: Array<string>): number {
  const title = record.pageTitle.toLowerCase();
  const heading = record.heading?.toLowerCase() ?? "";
  let score = 0;

  for (const term of terms) {
    if (!record.searchText.includes(term)) {
      return 0;
    }
    if (title === term || heading === term) {
      score += 30;
    } else if (title.startsWith(term) || heading.startsWith(term)) {
      score += 18;
    } else if (title.includes(term) || heading.includes(term)) {
      score += 10;
    } else {
      score += 3;
    }
  }

  return score + (record.heading ? 0 : 2);
}

export function searchDocs(
  query: string,
  index: Array<DocsSearchRecord>,
  limit = 12,
): Array<DocsSearchResult> {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) {
    return [];
  }

  return index
    .map((record) => ({ ...record, score: scoreRecord(record, terms) }))
    .filter((record) => record.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getSearchResultHref(result: DocsSearchRecord): string {
  const hash = result.headingId ? `#${result.headingId}` : "";
  return `${getDocPath(result.slug)}${hash}`;
}
