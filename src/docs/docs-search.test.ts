import { describe, expect, it } from "vitest";
import {
  buildDocsSearchIndex,
  getSearchResultHref,
  searchDocs,
  stripMarkdown,
} from "./docs-search";

describe("documentation search", () => {
  const index = buildDocsSearchIndex();

  it("indexes pages and headings", () => {
    expect(index.some((record) => record.slug === "clipboard-paste")).toBe(
      true,
    );
    expect(
      index.some(
        (record) =>
          record.slug === "clipboard-paste" &&
          record.headingId === "parse-domain-values",
      ),
    ).toBe(true);
  });

  it("ranks title matches before body matches", () => {
    const results = searchDocs("fill handle", index);

    expect(results[0].slug).toBe("fill-handle");
  });

  it("builds deep links for heading results", () => {
    const result = searchDocs("parse domain values", index).find(
      (candidate) => candidate.headingId === "parse-domain-values",
    );

    expect(result && getSearchResultHref(result)).toBe(
      "/docs/clipboard-paste#parse-domain-values",
    );
  });

  it("removes Markdown syntax from excerpts", () => {
    expect(stripMarkdown("Use **typed** [`themes`](/docs/theming).")).toBe(
      "Use typed themes.",
    );
  });
});
