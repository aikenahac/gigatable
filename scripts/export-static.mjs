import { execFileSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

const rootDirectory = process.cwd();
const clientDirectory = path.join(rootDirectory, "build/client");
const outputDirectory = path.join(rootDirectory, "dist");

const nestedNotFound = path.join(clientDirectory, "404.html/index.html");
const notFoundHtml = readFileSync(nestedNotFound, "utf8");
rmSync(path.join(clientDirectory, "404.html"), {
  recursive: true,
  force: true,
});
writeFileSync(path.join(clientDirectory, "404.html"), notFoundHtml, "utf8");

const manifestSource = readFileSync(
  path.join(rootDirectory, "src/docs/docs-manifest.ts"),
  "utf8",
);
const docs = [...manifestSource.matchAll(/slug: "([^"]+)"[\s\S]*?sourceFile: "([^"]+)"/g)].map(
  ([, slug, sourceFile]) => ({
    canonicalPath: slug === "overview" ? "/docs/" : `/docs/${slug}/`,
    source: `src/docs/content/${sourceFile}`,
  }),
);
const comparisonsSource = readFileSync(
  path.join(rootDirectory, "src/comparisons/comparisons.ts"),
  "utf8",
);
const comparisonSlugs = [
  ...comparisonsSource.matchAll(/slug: "(ag-grid|mui-x-data-grid|handsontable)"/g),
].map((match) => match[1]);

const routes = [
  { canonicalPath: "/", source: "src/pages/landing-page.tsx" },
  { canonicalPath: "/demo", source: "src/pages/demo-page.tsx" },
  ...docs,
  {
    canonicalPath: "/guides/editable-tanstack-table/",
    source: "src/pages/resource-page.tsx",
  },
  {
    canonicalPath: "/features/excel-copy-paste/",
    source: "src/pages/resource-page.tsx",
  },
  { canonicalPath: "/compare/", source: "src/comparisons/comparisons.ts" },
  ...comparisonSlugs.map((slug) => ({
    canonicalPath: `/compare/${slug}/`,
    source: "src/comparisons/comparisons.ts",
  })),
];

function lastModified(source) {
  try {
    const committedDate = execFileSync(
      "git",
      ["log", "-1", "--format=%cs", "--", source],
      { cwd: rootDirectory, encoding: "utf8" },
    ).trim();
    if (committedDate) return committedDate;
  } catch {
    // New files use their filesystem modification date.
  }

  return statSync(path.join(rootDirectory, source))
    .mtime.toISOString()
    .slice(0, 10);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    ({ canonicalPath, source }) => `  <url>
    <loc>https://gigatable.dev${canonicalPath}</loc>
    <lastmod>${lastModified(source)}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

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
const crawlerGroup = (userAgent, allowed) => `User-agent: ${userAgent}
Content-Signal: search=${allowed ? "yes" : "no"},ai-input=${allowed ? "yes" : "no"},ai-train=no,use=reference
${allowed ? "Allow" : "Disallow"}: /`;
const robots = `User-agent: *
Content-Signal: search=yes,ai-input=yes,ai-train=no,use=reference
Allow: /

${allowedCrawlers.map((crawler) => crawlerGroup(crawler, true)).join("\n\n")}

${blockedTrainingCrawlers
  .map((crawler) => crawlerGroup(crawler, false))
  .join("\n\n")}

Sitemap: https://gigatable.dev/sitemap.xml
`;

if (routes.length !== 36 || docs.length !== 28) {
  throw new Error(
    `Expected 36 routes and 28 docs, found ${routes.length} and ${docs.length}.`,
  );
}

writeFileSync(path.join(clientDirectory, "sitemap.xml"), sitemap, "utf8");
writeFileSync(path.join(clientDirectory, "robots.txt"), robots, "utf8");

for (const { canonicalPath } of routes) {
  if (canonicalPath === "/" || canonicalPath.endsWith("/")) continue;

  const directoryIndex = path.join(
    clientDirectory,
    canonicalPath.replace(/^\//, ""),
    "index.html",
  );
  const cleanUrlFile = path.join(
    clientDirectory,
    `${canonicalPath.replace(/^\//, "")}.html`,
  );
  writeFileSync(cleanUrlFile, readFileSync(directoryIndex, "utf8"), "utf8");
}

rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(outputDirectory, { recursive: true });
cpSync(clientDirectory, outputDirectory, { recursive: true });

console.log(`Exported ${routes.length} canonical routes to dist/.`);
