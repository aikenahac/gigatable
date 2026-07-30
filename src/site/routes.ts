import {
  defaultDocsSlug,
  isDocsSlug,
  type DocsSlug,
} from "../docs/docs-manifest";

export const resourceSlugs = [
  "editable-tanstack-table",
  "excel-copy-paste",
] as const;

export type ResourceSlug = (typeof resourceSlugs)[number];

export type SiteRoute =
  | { name: "landing" }
  | { name: "demo" }
  | { name: "docs"; slug: DocsSlug }
  | { name: "resource"; slug: ResourceSlug }
  | { name: "not-found" };

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.replace(/\/+$/, "");
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
    return isDocsSlug(slug) ? { name: "docs", slug } : { name: "not-found" };
  }

  if (path === "/guides/editable-tanstack-table") {
    return { name: "resource", slug: "editable-tanstack-table" };
  }

  if (path === "/features/excel-copy-paste") {
    return { name: "resource", slug: "excel-copy-paste" };
  }

  return { name: "not-found" };
}

export function getCanonicalPath(route: SiteRoute): string {
  if (route.name === "landing") {
    return "/";
  }

  if (route.name === "demo") {
    return "/demo/";
  }

  if (route.name === "docs") {
    return route.slug === defaultDocsSlug ? "/docs/" : `/docs/${route.slug}/`;
  }

  if (route.name === "resource") {
    if (route.slug === "editable-tanstack-table") {
      return "/guides/editable-tanstack-table/";
    }

    return "/features/excel-copy-paste/";
  }

  return "/404.html";
}

export function getHashTargetId(hash: string): string {
  if (!hash || hash === "#") {
    return "";
  }

  try {
    return decodeURIComponent(hash.replace(/^#/, ""));
  } catch {
    return hash.replace(/^#/, "");
  }
}
