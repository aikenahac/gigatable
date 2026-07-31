import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BadgeCell } from "./badge-cell";
import { buildCalendarDays, shiftIsoDate } from "./date-cell";
import { normalizeNumberCellValue } from "./number-cell";
import { ProgressCell } from "./progress-cell";

describe("optional display cells", () => {
  it("renders a semantic badge label", () => {
    const markup = renderToStaticMarkup(
      <BadgeCell label="Within SLA" tone="success" />,
    );
    expect(markup).toContain("Within SLA");
  });

  it("clamps and labels progress accessibly", () => {
    const markup = renderToStaticMarkup(
      <ProgressCell value={120} max={100} label="Resolution progress" />,
    );
    expect(markup).toContain('role="progressbar"');
    expect(markup).toContain('aria-label="Resolution progress"');
    expect(markup).toContain('aria-valuenow="100"');
    expect(markup).toContain("100%");
  });
});

describe("optional numeric cell", () => {
  it("preserves valid numeric values and clamps configured bounds", () => {
    expect(normalizeNumberCellValue("42.5", 0, 100)).toBe(42.5);
    expect(normalizeNumberCellValue(150, 0, 100)).toBe(100);
    expect(normalizeNumberCellValue(-10, 0, 100)).toBe(0);
  });

  it("rejects empty and invalid drafts", () => {
    expect(normalizeNumberCellValue("", 0, 100)).toBeNull();
    expect(normalizeNumberCellValue("not a number", 0, 100)).toBeNull();
  });
});

describe("optional calendar cell", () => {
  it("builds a stable six-week calendar grid", () => {
    const days = buildCalendarDays("2026-08-01");
    expect(days).toHaveLength(42);
    expect(days[0]).toBe("2026-07-26");
    expect(days[41]).toBe("2026-09-05");
  });

  it("supports day-based keyboard navigation across month boundaries", () => {
    expect(shiftIsoDate("2026-08-01", -1)).toBe("2026-07-31");
    expect(shiftIsoDate("2026-08-29", 7)).toBe("2026-09-05");
  });
});
