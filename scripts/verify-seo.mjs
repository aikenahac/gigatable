import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const rootDirectory = process.cwd();
const outputDirectory = path.join(rootDirectory, "dist");
const sitemap = readFileSync(path.join(outputDirectory, "sitemap.xml"), "utf8");
const canonicalUrls = [
  ...sitemap.matchAll(/<loc>(https:\/\/gigatable\.dev([^<]+))<\/loc>/g),
].map((match) => ({ url: match[1], route: match[2] }));

const errors = [];
const titles = new Set();
const descriptions = new Set();

function routeFile(route) {
  if (route === "/") {
    return path.join(outputDirectory, "index.html");
  }

  if (!route.endsWith("/")) {
    return path.join(outputDirectory, `${route.replace(/^\//, "")}.html`);
  }

  return path.join(
    outputDirectory,
    route.replace(/^\/|\/$/g, ""),
    "index.html",
  );
}

function attribute(html, pattern) {
  return pattern.exec(html)?.[1]?.trim() ?? "";
}

for (const { route, url } of canonicalUrls) {
  const file = routeFile(route);
  if (!existsSync(file)) {
    errors.push(`${route}: generated HTML is missing`);
    continue;
  }

  const html = readFileSync(file, "utf8");
  const title = attribute(html, /<title>([^<]+)<\/title>/);
  const description = attribute(
    html,
    /<meta name="description" content="([^"]+)"/,
  );
  const canonical = attribute(html, /<link rel="canonical" href="([^"]+)"/);
  const robots = attribute(html, /<meta name="robots" content="([^"]+)"/);
  const ogImage = attribute(
    html,
    /<meta property="og:image" content="([^"]+)"/,
  );
  const ogImageAlt = attribute(
    html,
    /<meta property="og:image:alt" content="([^"]+)"/,
  );
  const markdownAlternate = attribute(
    html,
    /<link rel="alternate" type="text\/markdown" href="([^"]+)"/,
  );
  const h1Count = (html.match(/<h1(?:\s[^>]*)?>/g) ?? []).length;

  if (!title) errors.push(`${route}: title is missing`);
  if (!description) errors.push(`${route}: description is missing`);
  if (titles.has(title)) errors.push(`${route}: duplicate title "${title}"`);
  if (descriptions.has(description)) {
    errors.push(`${route}: duplicate description`);
  }
  if (canonical !== url) {
    errors.push(`${route}: canonical is "${canonical}", expected "${url}"`);
  }
  if (!robots.startsWith("index,follow")) {
    errors.push(`${route}: unexpected robots value "${robots}"`);
  }
  if (!ogImage.endsWith(".png")) {
    errors.push(`${route}: Open Graph image is not a PNG`);
  }
  if (!ogImageAlt) {
    errors.push(`${route}: Open Graph image alt is missing`);
  }
  if (!/<meta property="og:image:width" content="1200"/.test(html)) {
    errors.push(`${route}: Open Graph image width is not 1200`);
  }
  if (!/<meta property="og:image:height" content="630"/.test(html)) {
    errors.push(`${route}: Open Graph image height is not 630`);
  }
  if (h1Count !== 1) {
    errors.push(`${route}: rendered HTML has ${h1Count} H1 elements`);
  }
  if (!/<script type="application\/ld\+json"/.test(html)) {
    errors.push(`${route}: JSON-LD is missing`);
  }
  if (route !== "/demo" && !markdownAlternate) {
    errors.push(`${route}: Markdown alternate is missing`);
  }
  if (markdownAlternate) {
    const markdownUrl = new URL(markdownAlternate);
    const markdownFile = path.join(
      outputDirectory,
      markdownUrl.pathname.replace(/^\//, ""),
    );
    if (!existsSync(markdownFile)) {
      errors.push(`${route}: Markdown alternate does not exist`);
    }
  }
  if (!/<body>[\s\S]{500,}<\/body>/.test(html)) {
    errors.push(`${route}: rendered body is unexpectedly small`);
  }

  titles.add(title);
  descriptions.add(description);
}

if (canonicalUrls.length !== 36) {
  errors.push(`sitemap has ${canonicalUrls.length} routes, expected 36`);
}
if (
  (sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) ?? []).length !==
  canonicalUrls.length
) {
  errors.push("sitemap does not have a file-derived lastmod for every route");
}

const notFound = readFileSync(path.join(outputDirectory, "404.html"), "utf8");
if (!/<meta name="robots" content="noindex,nofollow"/.test(notFound)) {
  errors.push("404.html: noindex,nofollow is missing");
}

const robotsTxt = readFileSync(
  path.join(outputDirectory, "robots.txt"),
  "utf8",
);
for (const expected of [
  "Content-Signal: search=yes,ai-input=yes,ai-train=no,use=reference",
  "User-agent: OAI-SearchBot",
  "User-agent: Claude-SearchBot",
  "User-agent: GPTBot",
  "User-agent: ClaudeBot",
]) {
  if (!robotsTxt.includes(expected)) {
    errors.push(`robots.txt: missing ${expected}`);
  }
}
const indexNowKey = "bf041a352cb68d028ce075b5a8a898a2";
const indexNowKeyPath = path.join(outputDirectory, `${indexNowKey}.txt`);
if (
  !existsSync(indexNowKeyPath) ||
  readFileSync(indexNowKeyPath, "utf8").trim() !== indexNowKey
) {
  errors.push("IndexNow verification key is missing or invalid");
}
if (!/<h1(?:\s[^>]*)?>[\s\S]+?<\/h1>/.test(notFound)) {
  errors.push("404.html: rendered H1 is missing");
}

for (const image of [
  "gigatable",
  "docs",
  "demo",
  "editable-tanstack-table",
  "excel-copy-paste",
]) {
  if (!existsSync(path.join(outputDirectory, "og", `${image}.png`))) {
    errors.push(`/og/${image}.png: social image is missing`);
  }
}

const htmlFiles = [];
function collectHtml(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) collectHtml(target);
    if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(target);
  }
}
collectHtml(outputDirectory);

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith("/") && !href.startsWith("#")) {
      continue;
    }

    const [rawPath, rawHash] = href.split("#", 2);
    const currentRoutePath =
      file === path.join(outputDirectory, "index.html")
        ? "/"
        : path.basename(file) !== "index.html"
          ? `/${path
              .relative(outputDirectory, file)
              .replaceAll(path.sep, "/")
              .replace(/\.html$/, "")}`
          : `/${path
              .relative(outputDirectory, path.dirname(file))
              .split(path.sep)
              .join("/")}/`;
    const targetPath = (rawPath || currentRoutePath).split("?")[0];
    const cleanUrlFile = path.join(
      outputDirectory,
      `${targetPath.replace(/^\//, "")}.html`,
    );
    const targetFile = targetPath.endsWith("/")
      ? routeFile(targetPath)
      : existsSync(path.join(outputDirectory, targetPath))
        ? path.join(outputDirectory, targetPath)
        : existsSync(cleanUrlFile)
          ? cleanUrlFile
          : routeFile(`${targetPath}/`);

    if (!existsSync(targetFile)) {
      errors.push(`${path.relative(outputDirectory, file)}: broken ${href}`);
      continue;
    }

    if (rawHash && targetFile.endsWith(".html")) {
      const targetHtml =
        targetFile === file ? html : readFileSync(targetFile, "utf8");
      const decodedHash = decodeURIComponent(rawHash);
      if (!targetHtml.includes(`id="${decodedHash}"`)) {
        errors.push(
          `${path.relative(outputDirectory, file)}: missing fragment ${href}`,
        );
      }
    }
  }
}

if (errors.length) {
  console.error(`SEO verification failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Verified ${canonicalUrls.length} canonical HTML routes, 404 handling, social images, sitemap coverage, and internal links.`,
);
