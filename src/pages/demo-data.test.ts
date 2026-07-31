import { describe, expect, it } from "vitest";
import {
  REGISTRY_COLUMN_COUNT,
  REGISTRY_SIZE_OPTIONS,
  buildRegistryRows,
  getRegistryRowId,
} from "./standard-demo-table";
import { buildSupportTickets, supportColumns } from "./support-demo-table";
import {
  buildProductionWorkOrders,
  getProductionVirtualRange,
  PRODUCTION_REORDER_COLUMN_ID,
  productionColumns,
} from "./advanced-demo-table";
import {
  parseDemoDate,
  parseDemoNumber,
  parseDemoOption,
} from "./demo-editor-utils";

describe("real-world demo data", () => {
  it("supports every registry scale with 300 columns", () => {
    expect(REGISTRY_SIZE_OPTIONS).toEqual([
      100, 500, 1_000, 5_000, 10_000, 100_000,
    ]);
    expect(REGISTRY_COLUMN_COUNT).toBe(300);
  });

  it("creates 100,000 unique table row identities with shared source rows", () => {
    const rows = buildRegistryRows(100_000);
    const identities = new Set(
      rows.map((_row, index) => getRegistryRowId(index)),
    );

    expect(rows).toHaveLength(100_000);
    expect(identities.size).toBe(100_000);
    expect(rows[0]).toBe(rows[1_000]);
  });

  it("allows one repeated entry to be cloned without mutating its peer", () => {
    const rows = buildRegistryRows(5_000);
    const peer = rows[1_000];
    const edited = [...rows];
    edited[0] = { ...edited[0], name: "Edited registry entry" };

    expect(edited[0]).not.toBe(peer);
    expect(edited[1_000]).toBe(peer);
    expect(edited[1_000].name).not.toBe("Edited registry entry");
  });

  it("builds deterministic support and production scenarios", () => {
    expect(buildSupportTickets()).toHaveLength(250);
    expect(buildSupportTickets()).toEqual(buildSupportTickets());
    expect(buildProductionWorkOrders()).toHaveLength(300);
    expect(buildProductionWorkOrders()).toEqual(buildProductionWorkOrders());
  });

  it("keeps the final production work orders in the virtual range", () => {
    const range = getProductionVirtualRange(9_600, 680, 300);

    expect(range.end).toBe(300);
    expect(range.start).toBeLessThan(range.end);
  });

  it("keeps identifiers and row controls read-only", () => {
    const supportEditable = supportColumns.filter(
      (column) => column.meta?.editable,
    );
    const productionEditable = productionColumns.filter(
      (column) => column.meta?.editable,
    );

    expect(supportColumns).toHaveLength(10);
    expect(supportEditable).toHaveLength(9);
    expect(productionColumns).toHaveLength(12);
    expect(productionEditable).toHaveLength(10);
    expect(supportColumns[0].meta?.editable).not.toBe(true);
    expect(productionColumns[0].meta?.editable).not.toBe(true);
    expect(productionColumns[0].id).toBe(PRODUCTION_REORDER_COLUMN_ID);
    expect(productionColumns[0].enableHiding).toBe(false);
    expect(productionColumns[0].enableResizing).toBe(false);
    expect(productionColumns[1].meta?.editable).not.toBe(true);
    expect(
      supportColumns.find(
        (column) => "accessorKey" in column && column.accessorKey === "summary",
      )?.meta?.allowFill,
    ).toBe(false);
  });

  it("parses typed demo values without corrupting invalid input", () => {
    const options = [
      { value: "in_progress", label: "In progress" },
      { value: "resolved", label: "Resolved" },
    ] as const;

    expect(parseDemoOption("IN PROGRESS", options, "resolved")).toBe(
      "in_progress",
    );
    expect(parseDemoOption("unknown", options, "resolved")).toBe("resolved");
    expect(parseDemoNumber("125", 40, 0, 100)).toBe(100);
    expect(parseDemoNumber("invalid", 40, 0, 100)).toBe(40);
    expect(parseDemoDate("2026-08-15", "2026-07-01")).toBe("2026-08-15");
    expect(parseDemoDate("2026-02-31", "2026-07-01")).toBe("2026-07-01");
    expect(
      parseDemoDate("2027-01-01", "2026-07-01", "2026-07-01", "2026-12-31"),
    ).toBe("2026-07-01");
  });
});
