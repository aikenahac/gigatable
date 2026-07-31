import { describe, expect, it } from "vitest";
import { comparisons, comparisonSlugs } from "./comparisons";

describe("comparison definitions", () => {
  it("covers the selected alternatives exactly", () => {
    expect(comparisonSlugs).toEqual([
      "ag-grid",
      "mui-x-data-grid",
      "handsontable",
    ]);
    expect(comparisons.map((comparison) => comparison.slug)).toEqual(
      comparisonSlugs,
    );
  });

  it("contains balanced guidance, current verification, and official sources", () => {
    for (const comparison of comparisons) {
      expect(comparison.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(comparison.rows.length).toBeGreaterThanOrEqual(5);
      expect(comparison.chooseGigatable.length).toBeGreaterThanOrEqual(3);
      expect(comparison.chooseAlternative.length).toBeGreaterThanOrEqual(3);
      expect(comparison.sources.length).toBeGreaterThanOrEqual(3);
      expect(
        comparison.sources.every((source) => source.url.startsWith("https://")),
      ).toBe(true);
    }
  });
});
