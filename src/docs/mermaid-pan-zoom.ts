export interface DiagramTransform {
  scale: number;
  x: number;
  y: number;
}

export interface DiagramPoint {
  x: number;
  y: number;
}

export interface DiagramSize {
  width: number;
  height: number;
}

export interface SvgViewBox {
  minX: number;
  minY: number;
  width: number;
  height: number;
}

export const MIN_MERMAID_SCALE = 0.5;
export const MAX_MERMAID_SCALE = 4;

export function getInitialTransform(): DiagramTransform {
  return { scale: 1, x: 0, y: 0 };
}

export function getResetTransform(): DiagramTransform {
  return getInitialTransform();
}

export function clampScale(scale: number): number {
  return Math.min(MAX_MERMAID_SCALE, Math.max(MIN_MERMAID_SCALE, scale));
}

export function zoomTransform(
  transform: DiagramTransform,
  nextScale: number,
  origin: DiagramPoint,
): DiagramTransform {
  const scale = clampScale(nextScale);
  const scaleRatio = scale / transform.scale;

  return {
    scale,
    x: origin.x - (origin.x - transform.x) * scaleRatio,
    y: origin.y - (origin.y - transform.y) * scaleRatio,
  };
}

export function panTransform(
  transform: DiagramTransform,
  deltaX: number,
  deltaY: number,
): DiagramTransform {
  return {
    ...transform,
    x: transform.x + deltaX,
    y: transform.y + deltaY,
  };
}

export function parseSvgViewBox(svg: string): SvgViewBox | null {
  const match = /\sviewBox=["']([^"']+)["']/.exec(svg);

  if (!match) {
    return null;
  }

  const [minX, minY, width, height] = match[1]
    .trim()
    .split(/[\s,]+/)
    .map(Number);

  if (
    [minX, minY, width, height].some((value) => !Number.isFinite(value)) ||
    width <= 0 ||
    height <= 0
  ) {
    return null;
  }

  return { minX, minY, width, height };
}

export function getViewBoxForTransform(
  baseViewBox: SvgViewBox,
  viewportSize: DiagramSize,
  transform: DiagramTransform,
): SvgViewBox {
  const scale = clampScale(transform.scale);
  const width = baseViewBox.width / scale;
  const height = baseViewBox.height / scale;
  const minX =
    baseViewBox.minX - (transform.x / Math.max(1, viewportSize.width)) * width;
  const minY =
    baseViewBox.minY - (transform.y / Math.max(1, viewportSize.height)) * height;

  return { minX, minY, width, height };
}

export function applyViewBoxToSvg(svg: string, viewBox: SvgViewBox): string {
  const value = [
    viewBox.minX,
    viewBox.minY,
    viewBox.width,
    viewBox.height,
  ].join(" ");

  return svg.replace(/\sviewBox=["'][^"']+["']/, ` viewBox="${value}"`);
}
