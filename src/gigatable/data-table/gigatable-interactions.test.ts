import type { Column, Row } from "@tanstack/react-table";
import { describe, expect, it } from "vitest";
import {
  getEditableSelectionCoordinates,
  repeatPasteToSelection,
} from "./gigatable";

type TestRow = { a: unknown; b: unknown; c: unknown };

const rows = ["r0", "r1", "r2"].map(
  (id, index) => ({ id, index }) as Row<TestRow>,
);
const columns = ["a", "b", "c"].map((id) => ({ id }) as Column<TestRow>);

describe("selection-backed editing behavior", () => {
  it("filters read-only cells while preserving one batched coordinate list", () => {
    expect(
      getEditableSelectionCoordinates(
        {
          start: { rowId: "r0", columnId: "a" },
          end: { rowId: "r1", columnId: "c" },
        },
        rows,
        columns,
        (columnId) => columnId !== "b",
      ),
    ).toEqual([
      { rowIndex: 0, columnId: "a" },
      { rowIndex: 0, columnId: "c" },
      { rowIndex: 1, columnId: "a" },
      { rowIndex: 1, columnId: "c" },
    ]);
  });

  it("supports all-columns-editable through the eligibility callback", () => {
    expect(
      getEditableSelectionCoordinates(
        {
          start: { rowId: "r1", columnId: "a" },
          end: { rowId: "r1", columnId: "c" },
        },
        rows,
        columns,
        () => true,
      ),
    ).toHaveLength(3);
  });
});

describe("selected-range paste repetition", () => {
  it("tiles a smaller paste matrix across the selected range", () => {
    expect(
      repeatPasteToSelection(
        "1\t2",
        {
          start: { rowId: "r0", columnId: "a" },
          end: { rowId: "r2", columnId: "c" },
        },
        rows.map((row) => row.id),
        columns.map((column) => column.id),
      ),
    ).toBe("1\t2\t1\n1\t2\t1\n1\t2\t1");
  });

  it("keeps the original paste when it already covers the selection", () => {
    expect(
      repeatPasteToSelection(
        "1\t2\n3\t4",
        {
          start: { rowId: "r0", columnId: "a" },
          end: { rowId: "r0", columnId: "a" },
        },
        rows.map((row) => row.id),
        columns.map((column) => column.id),
      ),
    ).toBe("1\t2\n3\t4");
  });
});
