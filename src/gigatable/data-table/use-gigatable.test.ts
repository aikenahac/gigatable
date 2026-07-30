import type { Cell, RowData, TableMeta } from "@tanstack/react-table";
import { describe, expect, it, vi } from "vitest";
import {
  mergeGigatableMeta,
  parsePastedCellValue,
  resolveClearedValue,
} from "./use-gigatable";

type TestRow = RowData & { value: string };

describe("mergeGigatableMeta", () => {
  it("preserves consumer metadata while installing mutation handlers", () => {
    const updateCellData = vi.fn();
    const clearCellData = vi.fn();
    const consumerMeta = {
      customBehavior: "kept",
    } as TableMeta<TestRow> & { customBehavior: string };

    const result = mergeGigatableMeta(
      consumerMeta,
      updateCellData,
      clearCellData,
    ) as TableMeta<TestRow> & { customBehavior: string };

    expect(result.customBehavior).toBe("kept");
    expect(result.updateCellData).toBe(updateCellData);
    expect(result.clearCellData).toBe(clearCellData);
  });
});

describe("parsePastedCellValue", () => {
  it("returns the transformed value, including null", () => {
    const cell = {
      column: {
        columnDef: {
          meta: {
            parsePastedValue: (value: string) =>
              value === "" ? null : Number(value),
          },
        },
      },
    } as unknown as Cell<TestRow, unknown>;

    expect(parsePastedCellValue("42", cell)).toBe(42);
    expect(parsePastedCellValue("", cell)).toBeNull();
  });
});

describe("resolveClearedValue", () => {
  it("defaults to null and supports a per-column resolver", () => {
    expect(resolveClearedValue<TestRow>(undefined)).toBeNull();

    const cell = {
      column: {
        columnDef: {
          meta: { getClearedValue: () => "" },
        },
      },
    } as unknown as Cell<TestRow, unknown>;
    expect(resolveClearedValue(cell)).toBe("");
  });
});
