import { describe, expect, it } from "vitest";
import {
  applyViewBoxToSvg,
  clampScale,
  getViewBoxForTransform,
  getInitialTransform,
  parseSvgViewBox,
  getResetTransform,
  panTransform,
  zoomTransform,
} from "./mermaid-pan-zoom";

describe("mermaid pan and zoom transforms", () => {
  it("clamps scale to the supported range", () => {
    expect(clampScale(0.1)).toBe(0.5);
    expect(clampScale(2)).toBe(2);
    expect(clampScale(8)).toBe(4);
  });

  it("keeps the cursor anchored while zooming", () => {
    const transform = zoomTransform(
      getInitialTransform(),
      2,
      { x: 100, y: 50 },
    );

    expect(transform).toEqual({ scale: 2, x: -100, y: -50 });
  });

  it("pans by the pointer delta", () => {
    expect(panTransform({ scale: 2, x: -100, y: -50 }, 24, -12)).toEqual({
      scale: 2,
      x: -76,
      y: -62,
    });
  });

  it("resets to the initial transform", () => {
    expect(getResetTransform()).toEqual(getInitialTransform());
  });

  it("parses a Mermaid SVG viewBox", () => {
    expect(parseSvgViewBox('<svg viewBox="0 0 640 320"></svg>')).toEqual({
      minX: 0,
      minY: 0,
      width: 640,
      height: 320,
    });
  });

  it("converts pan and zoom state into a crisp SVG viewBox", () => {
    expect(
      getViewBoxForTransform(
        { minX: 0, minY: 0, width: 640, height: 320 },
        { width: 640, height: 320 },
        { scale: 2, x: -160, y: -80 },
      ),
    ).toEqual({
      minX: 80,
      minY: 40,
      width: 320,
      height: 160,
    });
  });

  it("writes the transformed viewBox back into the SVG", () => {
    expect(
      applyViewBoxToSvg('<svg viewBox="0 0 640 320"></svg>', {
        minX: 80,
        minY: 40,
        width: 320,
        height: 160,
      }),
    ).toBe('<svg viewBox="80 40 320 160"></svg>');
  });
});
