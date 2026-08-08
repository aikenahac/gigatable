import type { DocsSlug } from "./docs-manifest";

const repositoryUrl = "https://github.com/aikenahac/gigatable";

export function getDocsActionUrls(slug: DocsSlug, sourceFile: string) {
  return {
    editUrl: `${repositoryUrl}/edit/master/src/docs/content/${sourceFile}`,
    markdownUrl: `/docs/${slug}.md`,
  };
}
