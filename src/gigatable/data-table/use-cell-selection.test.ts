import { describe, expect, it } from "vitest";
import {
  constrainSelectionToColumn,
  isCellWithinSelection,
} from "./use-cell-selection";

const rows = ["row-1", "row-2", "row-3"];
const columns = ["name", "quantity", "price"];

describe("isCellWithinSelection", () => {
  it("keeps selected and fill-anchor cells in the selected range", () => {
    const selection = {
      start: { rowId: "row-1", columnId: "name" },
      end: { rowId: "row-3", columnId: "price" },
    };

    expect(
      isCellWithinSelection("row-1", "name", selection, rows, columns),
    ).toBe(true);
    expect(
      isCellWithinSelection("row-3", "name", selection, rows, columns),
    ).toBe(true);
  });
});

describe("constrainSelectionToColumn", () => {
  it("allows unrestricted range selection to span columns", () => {
    const selection = {
      start: { rowId: "row-1", columnId: "name" },
      end: { rowId: "row-3", columnId: "price" },
    };

    expect(constrainSelectionToColumn(selection, false)).toEqual(selection);
  });

  it("keeps single-column range selection in the start column", () => {
    expect(
      constrainSelectionToColumn(
        {
          start: { rowId: "row-1", columnId: "name" },
          end: { rowId: "row-3", columnId: "price" },
        },
        true,
      ),
    ).toEqual({
      start: { rowId: "row-1", columnId: "name" },
      end: { rowId: "row-3", columnId: "name" },
    });
  });

  it("leaves null selection unchanged", () => {
    expect(constrainSelectionToColumn(null, true)).toBeNull();
  });
});
