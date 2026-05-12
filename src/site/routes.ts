import { defaultDocsSlug, isDocsSlug } from "../docs/docs";
import type { DocsSlug } from "../docs/docs";

export type SiteRoute =
  | { name: "landing" }
  | { name: "demo" }
  | { name: "docs"; slug: DocsSlug };

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname || "/";
}

export function getRouteForPath(pathname: string): SiteRoute {
  const path = normalizePath(pathname);

  if (path === "/") {
    return { name: "landing" };
  }

  if (path === "/demo") {
    return { name: "demo" };
  }

  if (path === "/docs") {
    return { name: "docs", slug: defaultDocsSlug };
  }

  if (path.startsWith("/docs/")) {
    const slug = path.replace("/docs/", "");
    return {
      name: "docs",
      slug: isDocsSlug(slug) ? slug : defaultDocsSlug,
    };
  }

  return { name: "landing" };
}
