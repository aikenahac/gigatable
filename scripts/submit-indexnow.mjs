import { readFileSync } from "node:fs";
import path from "node:path";

const host = "gigatable.dev";
const key = "bf041a352cb68d028ce075b5a8a898a2";
const keyLocation = `https://${host}/${key}.txt`;
const sitemapPath = path.resolve("dist/sitemap.xml");
const sitemap = readFileSync(sitemapPath, "utf8");
const urlList = [
  ...sitemap.matchAll(/<loc>(https:\/\/gigatable\.dev\/[^<]*)<\/loc>/g),
].map(([, url]) => url);

if (urlList.length !== 36) {
  throw new Error(
    `Expected 36 canonical URLs in ${sitemapPath}, found ${urlList.length}`,
  );
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  body: JSON.stringify({
    host,
    key,
    keyLocation,
    urlList,
  }),
});

if (!response.ok) {
  throw new Error(
    `IndexNow returned ${response.status}: ${await response.text()}`,
  );
}

console.log(
  `Submitted ${urlList.length} canonical Gigatable URLs to IndexNow.`,
);
