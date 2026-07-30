import { describe, expect, it } from "vitest";
import { historyStateReducer } from "./use-history-state";

describe("historyStateReducer", () => {
  it("resets the present value and discards undo and redo entries", () => {
    expect(
      historyStateReducer(
        {
          past: [["old"]],
          present: ["current"],
          future: [["future"]],
        },
        { type: "CLEAR", initialPresent: ["replacement"] },
        20,
      ),
    ).toEqual({
      past: [],
      present: ["replacement"],
      future: [],
    });
  });

  it("records a batched mutation as one undo entry", () => {
    const previous: Array<{ a: number | null; b: number | null }> = [
      { a: 1, b: 2 },
    ];
    const cleared: Array<{ a: number | null; b: number | null }> = [
      { a: null, b: null },
    ];
    const next = historyStateReducer(
      { past: [], present: previous, future: [] },
      { type: "SET", newPresent: cleared },
      20,
    );

    expect(next.past).toEqual([previous]);
    expect(next.present).toBe(cleared);
  });
});
