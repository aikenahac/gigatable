import {
  getSeoForRoute,
  siteName,
  siteOrigin,
} from "../site/seo";
import { getRouteForPath } from "../site/routes";

export function loadSiteData(request: Request) {
  const pathname = new URL(request.url).pathname;
  const route = getRouteForPath(pathname);
  const seo = getSeoForRoute(route);

  return { pathname, route, seo };
}

export function buildSiteMeta(seo: ReturnType<typeof getSeoForRoute>) {
  const canonicalUrl = `${siteOrigin}${seo.canonicalPath}`;
  const imageUrl = `${siteOrigin}${seo.image}`;

  return [
    { title: seo.title },
    { name: "description", content: seo.description },
    { name: "robots", content: seo.robots },
    { tagName: "link" as const, rel: "canonical", href: canonicalUrl },
    ...(seo.markdownPath
      ? [
          {
            tagName: "link" as const,
            rel: "alternate",
            type: "text/markdown",
            href: `${siteOrigin}${seo.markdownPath}`,
          },
        ]
      : []),
    { property: "og:title", content: seo.title },
    { property: "og:description", content: seo.description },
    { property: "og:url", content: canonicalUrl },
    { property: "og:type", content: seo.type },
    { property: "og:site_name", content: siteName },
    { property: "og:locale", content: "en_US" },
    { property: "og:image", content: imageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:alt", content: seo.imageAlt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: seo.title },
    { name: "twitter:description", content: seo.description },
    { name: "twitter:image", content: imageUrl },
    { name: "twitter:image:alt", content: seo.imageAlt },
  ];
}
