const origin = (process.argv[2] ?? "https://gigatable.dev").replace(/\/$/, "");

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
const publicPaths = [
  "/",
  "/docs/",
  "/compare/",
  "/compare/ag-grid/",
  "/compare/mui-x-data-grid/",
  "/compare/handsontable/",
  "/llms.txt",
  "/gigatable.md",
];
const markdownPaths = [
  "/gigatable.md",
  "/docs/overview.md",
  "/compare/index.md",
  "/compare/ag-grid.md",
];
const errors = [];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const robotsResponse = await fetch(`${origin}/robots.txt`);
const robots = await robotsResponse.text();
if (!robotsResponse.ok) {
  errors.push(`robots.txt returned ${robotsResponse.status}`);
}
if (robots.includes("BEGIN Cloudflare Managed content")) {
  errors.push("Cloudflare managed robots.txt is still enabled");
}
if (
  !robots.includes(
    "Content-Signal: search=yes,ai-input=yes,ai-train=no,use=reference",
  )
) {
  errors.push("robots.txt is missing the selected Content-Signal policy");
}

for (const crawler of allowedCrawlers) {
  const group = new RegExp(
    `User-agent: ${escapeRegExp(crawler)}[\\s\\S]*?(?=\\n\\nUser-agent:|\\n\\nSitemap:|$)`,
  ).exec(robots)?.[0];
  if (!group?.includes("Allow: /") || group.includes("Disallow: /")) {
    errors.push(`robots.txt does not explicitly allow ${crawler}`);
  }

  for (const path of publicPaths) {
    const response = await fetch(`${origin}${path}`, {
      headers: { "User-Agent": crawler },
      redirect: "follow",
    });
    if (!response.ok) {
      errors.push(`${crawler} received ${response.status} for ${path}`);
    }
  }
}

for (const crawler of blockedTrainingCrawlers) {
  const group = new RegExp(
    `User-agent: ${escapeRegExp(crawler)}[\\s\\S]*?(?=\\n\\nUser-agent:|\\n\\nSitemap:|$)`,
  ).exec(robots)?.[0];
  if (!group?.includes("Disallow: /")) {
    errors.push(`robots.txt does not block training crawler ${crawler}`);
  }
}

for (const path of markdownPaths) {
  const response = await fetch(`${origin}${path}`);
  if (!response.ok) {
    errors.push(`${path} returned ${response.status}`);
  }
  const robotsHeader = response.headers.get("x-robots-tag") ?? "";
  if (!robotsHeader.includes("noindex") || !robotsHeader.includes("follow")) {
    errors.push(`${path} has unexpected X-Robots-Tag "${robotsHeader}"`);
  }
}

if (errors.length) {
  console.error(`AI discovery verification failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Verified ${publicPaths.length} public paths for ${allowedCrawlers.length} retrieval crawlers, ${blockedTrainingCrawlers.length} training exclusions, and Markdown indexing headers.`,
);
