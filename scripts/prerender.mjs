import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const rootDirectory = process.cwd();
const outputDirectory = path.join(rootDirectory, "dist");
const serverDirectory = path.join(rootDirectory, "dist-ssr");
const template = readFileSync(path.join(outputDirectory, "index.html"), "utf8");
const serverEntryUrl = pathToFileURL(
  path.join(serverDirectory, "entry-server.js"),
).href;
const server = await import(serverEntryUrl);

function escapeAttribute(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function getLastModified(route) {
  let source = "src/pages/landing-page.tsx";

  if (route.name === "demo") {
    source = "src/pages/demo-page.tsx";
  } else if (route.name === "docs") {
    const manifestSource = readFileSync(
      path.join(rootDirectory, "src/docs/docs-manifest.ts"),
      "utf8",
    );
    const slugIndex = manifestSource.indexOf(`slug: "${route.slug}"`);
    const sourceMatch =
      slugIndex >= 0
        ? /sourceFile:\s*"([^"]+)"/.exec(manifestSource.slice(slugIndex))
        : null;
    source = sourceMatch
      ? `src/docs/content/${sourceMatch[1]}`
      : "src/docs/docs-manifest.ts";
  } else if (route.name === "resource") {
    source = "src/pages/resource-page.tsx";
  } else if (route.name === "not-found") {
    source = "src/pages/not-found-page.tsx";
  }

  try {
    const committedDate = execFileSync(
      "git",
      ["log", "-1", "--format=%cs", "--", source],
      {
        cwd: rootDirectory,
        encoding: "utf8",
      },
    ).trim();
    if (committedDate) {
      return committedDate;
    }
  } catch {
    // Untracked or generated source files use their file modification date.
  }

  try {
    return statSync(path.join(rootDirectory, source))
      .mtime.toISOString()
      .slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function createHead(route, dateModified) {
  const seo = server.getSeoForRoute(route);
  const canonicalUrl = `https://gigatable.dev${seo.canonicalPath}`;
  const imageUrl = `https://gigatable.dev${seo.image}`;
  const jsonLd = JSON.stringify(
    server.getJsonLdForRoute(route, dateModified),
  ).replaceAll("<", "\\u003c");

  return `
    <meta name="description" content="${escapeAttribute(seo.description)}" />
    <meta name="robots" content="${escapeAttribute(seo.robots)}" />
    <link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />
    <meta property="og:title" content="${escapeAttribute(seo.title)}" />
    <meta property="og:description" content="${escapeAttribute(seo.description)}" />
    <meta property="og:url" content="${escapeAttribute(canonicalUrl)}" />
    <meta property="og:type" content="${seo.type}" />
    <meta property="og:site_name" content="Gigatable" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:image" content="${escapeAttribute(imageUrl)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:alt" content="${escapeAttribute(seo.imageAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttribute(seo.title)}" />
    <meta name="twitter:description" content="${escapeAttribute(seo.description)}" />
    <meta name="twitter:image" content="${escapeAttribute(imageUrl)}" />
    <meta name="twitter:image:alt" content="${escapeAttribute(seo.imageAlt)}" />
    <script type="application/ld+json" data-gigatable-seo>${jsonLd}</script>
    <title>${escapeAttribute(seo.title)}</title>`;
}

function createDocument(route, body, dateModified) {
  const withoutDefaultMetadata = template
    .replace(/\s*<meta\s+name="description"[\s\S]*?\/>/, "")
    .replace(/\s*<meta\s+name="robots"[\s\S]*?\/>/, "")
    .replace(/\s*<title>[\s\S]*?<\/title>/, "");

  return withoutDefaultMetadata
    .replace("</head>", `${createHead(route, dateModified)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

function outputPathForCanonical(canonicalPath) {
  if (canonicalPath === "/") {
    return path.join(outputDirectory, "index.html");
  }

  return path.join(
    outputDirectory,
    canonicalPath.replace(/^\/|\/$/g, ""),
    "index.html",
  );
}

const sitemapEntries = [];
for (const item of server.getPrerenderRoutes()) {
  const dateModified = getLastModified(item.route);
  const body = await server.render(item.canonicalPath);
  const outputPath = outputPathForCanonical(item.canonicalPath);
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(
    outputPath,
    createDocument(item.route, body, dateModified),
    "utf8",
  );
  sitemapEntries.push({
    canonicalPath: item.canonicalPath,
    dateModified,
  });
}

const notFoundRoute = { name: "not-found" };
const notFoundBody = await server.render("/404.html");
writeFileSync(
  path.join(outputDirectory, "404.html"),
  createDocument(notFoundRoute, notFoundBody, getLastModified(notFoundRoute)),
  "utf8",
);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map(
    ({ canonicalPath, dateModified }) => `  <url>
    <loc>https://gigatable.dev${canonicalPath}</loc>
    <lastmod>${dateModified}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
writeFileSync(path.join(outputDirectory, "sitemap.xml"), sitemap, "utf8");

writeFileSync(
  path.join(outputDirectory, "robots.txt"),
  `User-agent: *
Allow: /

Sitemap: https://gigatable.dev/sitemap.xml
`,
  "utf8",
);

rmSync(serverDirectory, { recursive: true, force: true });
console.log(`Prerendered ${sitemapEntries.length} canonical routes.`);
