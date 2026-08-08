import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const outputDirectory = path.resolve(process.cwd(), "dist");
const parity = JSON.parse(
  readFileSync("src/docs/content-parity.json", "utf8"),
);
const errors = [];

for (const [sourceFile, expectedHash] of Object.entries(parity)) {
  const slug = sourceFile.replace(/\.md$/, "");
  const markdownFile = path.join(outputDirectory, "docs", sourceFile);
  const htmlFile =
    slug === "overview"
      ? path.join(outputDirectory, "docs/index.html")
      : path.join(outputDirectory, "docs", slug, "index.html");

  if (!existsSync(markdownFile) || !existsSync(htmlFile)) {
    errors.push(`${slug}: static Markdown or HTML is missing`);
    continue;
  }

  const markdown = readFileSync(markdownFile, "utf8");
  const digest = createHash("sha256").update(markdown).digest("hex");
  if (digest !== expectedHash) errors.push(`${slug}: Markdown body changed`);
  if (markdown.startsWith("---\n")) {
    errors.push(`${slug}: public Markdown still contains frontmatter`);
  }

  const html = readFileSync(htmlFile, "utf8");
  if ((html.match(/<h1(?:\s|>)/g) ?? []).length !== 1) {
    errors.push(`${slug}: expected exactly one rendered H1`);
  }
  if (!html.includes("Copy Markdown") || !html.includes(">Open<")) {
    errors.push(`${slug}: native Fumadocs page actions are missing`);
  }

  for (const match of html.matchAll(/href="(\/docs(?:\/[a-z-]+)?)"/g)) {
    if (!match[1].endsWith("/")) {
      errors.push(`${slug}: non-canonical docs link ${match[1]}`);
    }
  }
}

const installation = readFileSync(
  path.join(outputDirectory, "docs/installation/index.html"),
  "utf8",
);
if ((installation.match(/role="tab"/g) ?? []).length < 8) {
  errors.push("installation: package manager tabs were not compiled");
}
const overview = readFileSync(
  path.join(outputDirectory, "docs/index.html"),
  "utf8",
);
if (!overview.includes("--callout-color") || !overview.includes(">TIP<")) {
  errors.push("overview: Fumadocs TIP callout is missing");
}
if (overview.includes("standard-demo-table") || overview.includes("mermaid.core")) {
  errors.push("overview: heavy demo or Mermaid runtime leaked into docs preload");
}

const architecture = readFileSync(
  path.join(outputDirectory, "docs/contributor-architecture/index.html"),
  "utf8",
);
if ((architecture.match(/class="docs-mermaid"/g) ?? []).length !== 2) {
  errors.push("architecture: Mermaid diagrams were not compiled");
}

const searchIndex = JSON.parse(
  readFileSync(path.join(outputDirectory, "api/search"), "utf8"),
);
const strings = [];
function collectStrings(value) {
  if (typeof value === "string") strings.push(value);
  else if (Array.isArray(value)) value.forEach(collectStrings);
  else if (value && typeof value === "object") {
    Object.values(value).forEach(collectStrings);
  }
}
collectStrings(searchIndex);
const searchUrls = new Set(
  strings.filter((value) => /^\/docs\/(?:[a-z-]+\/)?$/.test(value)),
);
if (searchUrls.size !== 28) {
  errors.push(`static search contains ${searchUrls.size} docs, expected 28`);
}

const overviewRedirect = readFileSync(
  path.join(outputDirectory, "docs/overview/index.html"),
  "utf8",
);
if (!overviewRedirect.includes("url=/docs/")) {
  errors.push("/docs/overview/ does not redirect to /docs/");
}

if (errors.length) {
  console.error(`Fumadocs migration verification failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(
  "Verified 28 parity-pinned docs, native actions/transforms, canonical links, lazy bundles, and static search.",
);
