import packageMetadata from "../../package.json";
import { docsManifest, defaultDocsSlug } from "../docs/docs-manifest";
import { getCanonicalPath, type SiteRoute } from "./routes";

export const siteOrigin = "https://gigatable.dev";
export const siteName = "Gigatable";
export const defaultRobots =
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

export interface PageSeo {
  canonicalPath: string;
  description: string;
  image: string;
  imageAlt: string;
  robots: string;
  title: string;
  type: "article" | "website";
}

const resourceSeo = {
  "editable-tanstack-table": {
    title: "Build an Editable Data Grid with TanStack Table | Gigatable",
    description:
      "Build an editable, virtualized React grid with TanStack Table. Add custom cell editors, range selection, Excel copy/paste, fill handles and undo/redo.",
    image: "/og/editable-tanstack-table.png",
    imageAlt:
      "Gigatable guide to building an editable data grid with TanStack Table",
    type: "article" as const,
  },
  "excel-copy-paste": {
    title: "React Data Grid with Excel Copy and Paste | Gigatable",
    description:
      "Add Excel-compatible copy/paste to an editable React data grid with typed parsing, rectangular ranges, repeated paste, fill handles and undo history.",
    image: "/og/excel-copy-paste.png",
    imageAlt:
      "Excel-compatible copy and paste in the Gigatable React data grid",
    type: "article" as const,
  },
};

export function getSeoForRoute(route: SiteRoute): PageSeo {
  const canonicalPath = getCanonicalPath(route);

  if (route.name === "landing") {
    return {
      canonicalPath,
      title: "Open-Source React Data Grid with Excel-Like UX | Gigatable",
      description:
        "Build editable, virtualized React grids with selection, Excel-compatible copy/paste, fill and undo/redo. Install the TypeScript source with npx gigatable init.",
      image: "/og/gigatable.png",
      imageAlt:
        "Gigatable, an open-source React data grid with Excel-like interactions",
      robots: defaultRobots,
      type: "website",
    };
  }

  if (route.name === "demo") {
    return {
      canonicalPath,
      title: "Interactive React Data Grid Demo | Gigatable",
      description:
        "Try cell selection, inline editing, Excel-compatible copy/paste, fill handles, column resizing, keyboard navigation and undo/redo in a virtualized React grid.",
      image: "/og/demo.png",
      imageAlt: "Interactive Gigatable React data grid demo",
      robots: defaultRobots,
      type: "website",
    };
  }

  if (route.name === "docs") {
    const doc =
      docsManifest.find((entry) => entry.slug === route.slug) ??
      docsManifest[0];
    return {
      canonicalPath,
      title: doc.seoTitle,
      description: doc.seoDescription,
      image: "/og/docs.png",
      imageAlt: "Gigatable React data grid documentation",
      robots: defaultRobots,
      type: "article",
    };
  }

  if (route.name === "resource") {
    return {
      canonicalPath,
      ...resourceSeo[route.slug],
      robots: defaultRobots,
    };
  }

  return {
    canonicalPath,
    title: "Page Not Found | Gigatable",
    description:
      "The requested Gigatable page could not be found. Visit the React data grid documentation or interactive demo.",
    image: "/og/gigatable.png",
    imageAlt: "Gigatable React data grid",
    robots: "noindex,nofollow",
    type: "website",
  };
}

function breadcrumbItems(route: SiteRoute) {
  const items = [{ name: "Gigatable", path: "/" }];

  if (route.name === "docs") {
    items.push({ name: "Docs", path: "/docs/" });
    if (route.slug !== defaultDocsSlug) {
      const doc = docsManifest.find((entry) => entry.slug === route.slug);
      items.push({
        name: doc?.title ?? route.slug,
        path: getCanonicalPath(route),
      });
    }
  }

  if (route.name === "resource") {
    const labels = {
      "editable-tanstack-table":
        "Build an Editable Data Grid with TanStack Table",
      "excel-copy-paste": "React Data Grid with Excel Copy and Paste",
    } as const;
    items.push({
      name: labels[route.slug],
      path: getCanonicalPath(route),
    });
  }

  return items;
}

export function getJsonLdForRoute(
  route: SiteRoute,
  dateModified?: string,
): Array<Record<string, unknown>> {
  const seo = getSeoForRoute(route);
  const canonicalUrl = `${siteOrigin}${seo.canonicalPath}`;
  const graph: Array<Record<string, unknown>> = [];

  if (route.name === "landing") {
    graph.push(
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${siteOrigin}/#website`,
        name: siteName,
        url: `${siteOrigin}/`,
        description: seo.description,
        inLanguage: "en",
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        "@id": `${siteOrigin}/#software`,
        name: siteName,
        description: seo.description,
        url: `${siteOrigin}/`,
        codeRepository: "https://github.com/aikenahac/gigatable",
        downloadUrl: "https://www.npmjs.com/package/gigatable",
        programmingLanguage: "TypeScript",
        runtimePlatform: "React 19",
        version: packageMetadata.version,
        license: "https://github.com/aikenahac/gigatable/blob/master/LICENSE",
        isAccessibleForFree: true,
        author: {
          "@type": "Person",
          name: "Aiken Tine Ahac",
        },
        sponsor: {
          "@type": "Organization",
          name: "Preskok ThinkTank",
          url: "https://thinktank.preskok.si/en/",
        },
      },
    );
  }

  if (route.name === "docs" || route.name === "resource") {
    graph.push({
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: seo.title.split(" | ")[0],
      description: seo.description,
      mainEntityOfPage: canonicalUrl,
      url: canonicalUrl,
      image: `${siteOrigin}${seo.image}`,
      inLanguage: "en",
      ...(dateModified ? { dateModified } : {}),
      author: {
        "@type": "Person",
        name: "Aiken Tine Ahac",
      },
      about: {
        "@id": `${siteOrigin}/#software`,
      },
      isPartOf: {
        "@id": `${siteOrigin}/#website`,
      },
    });
  }

  if (route.name === "demo") {
    graph.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: seo.title.split(" | ")[0],
      description: seo.description,
      url: canonicalUrl,
      image: `${siteOrigin}${seo.image}`,
      inLanguage: "en",
      about: {
        "@id": `${siteOrigin}/#software`,
      },
      isPartOf: {
        "@id": `${siteOrigin}/#website`,
      },
    });
  }

  const breadcrumbs = breadcrumbItems(route);
  if (breadcrumbs.length > 1) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${siteOrigin}${item.path}`,
      })),
    });
  }

  return graph;
}

function ensureMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) =>
    element?.setAttribute(key, value),
  );
}

function ensureLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) =>
    element?.setAttribute(key, value),
  );
}

export function applySeoToDocument(route: SiteRoute) {
  const seo = getSeoForRoute(route);
  const canonicalUrl = `${siteOrigin}${seo.canonicalPath}`;
  const imageUrl = `${siteOrigin}${seo.image}`;

  document.title = seo.title;
  ensureMeta('meta[name="description"]', {
    name: "description",
    content: seo.description,
  });
  ensureMeta('meta[name="robots"]', {
    name: "robots",
    content: seo.robots,
  });
  ensureLink('link[rel="canonical"]', {
    rel: "canonical",
    href: canonicalUrl,
  });

  const openGraph = {
    "og:title": seo.title,
    "og:description": seo.description,
    "og:url": canonicalUrl,
    "og:type": seo.type,
    "og:site_name": siteName,
    "og:locale": "en_US",
    "og:image": imageUrl,
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:type": "image/png",
    "og:image:alt": seo.imageAlt,
  };
  Object.entries(openGraph).forEach(([property, content]) =>
    ensureMeta(`meta[property="${property}"]`, { property, content }),
  );

  const twitter = {
    "twitter:card": "summary_large_image",
    "twitter:title": seo.title,
    "twitter:description": seo.description,
    "twitter:image": imageUrl,
    "twitter:image:alt": seo.imageAlt,
  };
  Object.entries(twitter).forEach(([name, content]) =>
    ensureMeta(`meta[name="${name}"]`, { name, content }),
  );

  let jsonLd = document.head.querySelector<HTMLScriptElement>(
    "script[data-gigatable-seo]",
  );
  if (!jsonLd) {
    jsonLd = document.createElement("script");
    jsonLd.type = "application/ld+json";
    jsonLd.dataset.gigatableSeo = "";
    document.head.appendChild(jsonLd);
  }
  jsonLd.textContent = JSON.stringify(getJsonLdForRoute(route));
}

export const canonicalRoutes: Array<SiteRoute> = [
  { name: "landing" },
  { name: "demo" },
  ...docsManifest.map(
    (entry): SiteRoute => ({ name: "docs", slug: entry.slug }),
  ),
  { name: "resource", slug: "editable-tanstack-table" },
  { name: "resource", slug: "excel-copy-paste" },
];
