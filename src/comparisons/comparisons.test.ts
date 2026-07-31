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
      expect(comparison.pricing.gigatable).toContain("$0");
      expect(comparison.pricing.alternativeHeadline).toContain("$");
      expect(comparison.pricing.alternative).toContain("$");
      expect(
        comparison.rows.every(
          (row) =>
            row.gigatable.label.length > 0 &&
            row.gigatable.detail.length > 0 &&
            row.alternative.label.length > 0 &&
            row.alternative.detail.length > 0,
        ),
      ).toBe(true);
      expect(comparison.chooseGigatable.length).toBeGreaterThanOrEqual(3);
      expect(comparison.chooseAlternative.length).toBeGreaterThanOrEqual(3);
      expect(comparison.sources.length).toBeGreaterThanOrEqual(3);
      expect(
        comparison.sources.every((source) => source.url.startsWith("https://")),
      ).toBe(true);
    }
  });

  it("makes paid spreadsheet features and list prices explicit", () => {
    const agGrid = comparisons.find(
      (comparison) => comparison.slug === "ag-grid",
    );
    const mui = comparisons.find(
      (comparison) => comparison.slug === "mui-x-data-grid",
    );
    const handsontable = comparisons.find(
      (comparison) => comparison.slug === "handsontable",
    );

    expect(agGrid?.pricing.alternative).toContain("$999");
    expect(
      agGrid?.rows
        .filter((row) =>
          [
            "Cell and range selection",
            "Excel-style copy and paste",
            "Fill handle",
          ].includes(row.dimension),
        )
        .every((row) => row.alternative.access === "paid"),
    ).toBe(true);

    expect(mui?.pricing.alternative).toContain("$599");
    expect(
      mui?.rows
        .filter((row) =>
          [
            "Cell and range selection",
            "Clipboard paste and drag-fill",
            "Undo and redo",
          ].includes(row.dimension),
        )
        .every((row) => row.alternative.access === "paid"),
    ).toBe(true);

    expect(handsontable?.pricing.alternative).toContain("$999");
    expect(
      handsontable?.rows.every((row) => row.alternative.access === "paid"),
    ).toBe(true);
  });
});
