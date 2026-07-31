import packageMetadata from "../../package.json";
import { comparisons, getComparison } from "../comparisons/comparisons";
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
  markdownPath?: string;
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
    markdownPath: "/guides/editable-tanstack-table.md",
    type: "article" as const,
  },
  "excel-copy-paste": {
    title: "React Data Grid with Excel Copy and Paste | Gigatable",
    description:
      "Add Excel-compatible copy/paste to an editable React data grid with typed parsing, rectangular ranges, repeated paste, fill handles and undo history.",
    image: "/og/excel-copy-paste.png",
    imageAlt:
      "Excel-compatible copy and paste in the Gigatable React data grid",
    markdownPath: "/features/excel-copy-paste.md",
    type: "article" as const,
  },
};

export function getSeoForRoute(route: SiteRoute): PageSeo {
  const canonicalPath = getCanonicalPath(route);

  if (route.name === "landing") {
    return {
      canonicalPath,
      title: "Gigatable React Data Grid | Excel-Like, Source-Installed",
      description:
        "Gigatable is the source-installed React data grid for TanStack Table, with editable cells, Excel-compatible copy/paste, fill, virtualization and undo/redo.",
      image: "/og/gigatable.png",
      imageAlt:
        "Gigatable, an open-source React data grid with Excel-like interactions",
      markdownPath: "/gigatable.md",
      robots: defaultRobots,
      type: "website",
    };
  }

  if (route.name === "demo") {
    return {
      canonicalPath,
      title: "Interactive React Data Grid Demo | Gigatable",
      description:
        "Explore Biobank Registry, Support Operations and Production Schedule demos, including a live selectable 100–100,000-row virtualization performance dashboard.",
      image: "/og/demo.png",
      imageAlt:
        "Gigatable Biobank, Support Operations and Production Schedule demo",
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
      markdownPath: `/docs/${doc.slug}.md`,
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

  if (route.name === "comparison") {
    if (route.slug === "overview") {
      return {
        canonicalPath,
        title: "Compare React Data Grids | Gigatable Decision Guide",
        description:
          "Compare Gigatable with AG Grid, MUI X Data Grid and Handsontable by source ownership, licensing, TanStack control, spreadsheet interactions and product fit.",
        image: "/og/gigatable.png",
        imageAlt: "Compare Gigatable with other React data grids",
        markdownPath: "/compare/index.md",
        robots: defaultRobots,
        type: "article",
      };
    }

    const comparison = getComparison(route.slug);
    return {
      canonicalPath,
      title: `${comparison.seoTitle} | Gigatable`,
      description: comparison.seoDescription,
      image: "/og/gigatable.png",
      imageAlt: `${comparison.title} for React applications`,
      markdownPath: `/compare/${route.slug}.md`,
      robots: defaultRobots,
      type: "article",
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

  if (route.name === "comparison") {
    items.push({ name: "Compare", path: "/compare/" });
    if (route.slug !== "overview") {
      items.push({
        name: getComparison(route.slug).alternative,
        path: getCanonicalPath(route),
      });
    }
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
        "@type": "SoftwareApplication",
        "@id": `${siteOrigin}/#software`,
        name: siteName,
        alternateName: "Gigatable React Data Grid",
        description: seo.description,
        disambiguatingDescription:
          "Gigatable is a source-installed React data grid and is not Google Cloud Bigtable or the separate React GigaTable package.",
        url: `${siteOrigin}/`,
        sameAs: [
          "https://github.com/aikenahac/gigatable",
          "https://www.npmjs.com/package/gigatable",
        ],
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        softwareRequirements:
          "React 19+, TypeScript, Tailwind CSS v4, and a modern browser",
        downloadUrl: "https://www.npmjs.com/package/gigatable",
        softwareVersion: packageMetadata.version,
        license: "https://github.com/aikenahac/gigatable/blob/master/LICENSE",
        isAccessibleForFree: true,
        isBasedOn: {
          "@type": "SoftwareApplication",
          name: "TanStack Table",
          url: "https://tanstack.com/table/latest",
        },
        author: {
          "@type": "Person",
          "@id": `${siteOrigin}/#author`,
          name: "Aiken Tine Ahac",
          url: "https://aiken.si",
        },
        sponsor: {
          "@type": "Organization",
          name: "Preskok ThinkTank",
          url: "https://thinktank.preskok.si/en/",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        "@id": `${siteOrigin}/#source`,
        name: "Gigatable TypeScript source",
        description:
          "Application-owned React and TypeScript source for the Gigatable data grid.",
        url: "https://github.com/aikenahac/gigatable",
        codeRepository: "https://github.com/aikenahac/gigatable",
        programmingLanguage: "TypeScript",
        runtimePlatform: "React 19",
        version: packageMetadata.version,
        license: "https://github.com/aikenahac/gigatable/blob/master/LICENSE",
        isAccessibleForFree: true,
        isPartOf: {
          "@id": `${siteOrigin}/#software`,
        },
        author: {
          "@type": "Person",
          "@id": `${siteOrigin}/#author`,
          name: "Aiken Tine Ahac",
        },
      },
    );
  }

  if (
    route.name === "docs" ||
    route.name === "resource" ||
    route.name === "comparison"
  ) {
    const datePublished =
      route.name === "comparison" && route.slug !== "overview"
        ? getComparison(route.slug).verifiedOn
        : undefined;
    graph.push({
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: seo.title.split(" | ")[0],
      description: seo.description,
      mainEntityOfPage: canonicalUrl,
      url: canonicalUrl,
      image: `${siteOrigin}${seo.image}`,
      inLanguage: "en",
      ...(datePublished ? { datePublished } : {}),
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
  const existingMarkdown = document.head.querySelector<HTMLLinkElement>(
    'link[rel="alternate"][type="text/markdown"]',
  );
  if (seo.markdownPath) {
    ensureLink('link[rel="alternate"][type="text/markdown"]', {
      rel: "alternate",
      type: "text/markdown",
      href: `${siteOrigin}${seo.markdownPath}`,
    });
  } else {
    existingMarkdown?.remove();
  }

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
  { name: "comparison", slug: "overview" },
  ...comparisons.map(
    (comparison): SiteRoute => ({
      name: "comparison",
      slug: comparison.slug,
    }),
  ),
];

const allowedCrawlers = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
];

const blockedTrainingCrawlers = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "meta-externalagent",
];

function crawlerGroup(userAgent: string, allowed: boolean) {
  return `User-agent: ${userAgent}
Content-Signal: search=${allowed ? "yes" : "no"},ai-input=${
    allowed ? "yes" : "no"
  },ai-train=no,use=reference
${allowed ? "Allow" : "Disallow"}: /`;
}

export function getRobotsTxt() {
  return `User-agent: *
Content-Signal: search=yes,ai-input=yes,ai-train=no,use=reference
Allow: /

${allowedCrawlers.map((crawler) => crawlerGroup(crawler, true)).join("\n\n")}

${blockedTrainingCrawlers
  .map((crawler) => crawlerGroup(crawler, false))
  .join("\n\n")}

Sitemap: ${siteOrigin}/sitemap.xml
`;
}
