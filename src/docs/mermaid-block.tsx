import React from "react";
import {
  applyViewBoxToSvg,
  getViewBoxForTransform,
  getInitialTransform,
  getResetTransform,
  panTransform,
  parseSvgViewBox,
  zoomTransform,
} from "./mermaid-pan-zoom";

export function MermaidBlock({ chart }: { chart: string }) {
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const figureRef = React.useRef<HTMLElement | null>(null);
  const [svg, setSvg] = React.useState("");
  const [error, setError] = React.useState("");
  const [transform, setTransform] = React.useState(getInitialTransform);
  const [viewportSize, setViewportSize] = React.useState({
    width: 1,
    height: 1,
  });
  const [isPanning, setIsPanning] = React.useState(false);
  const panStartRef = React.useRef<{
    pointerId: number;
    clientX: number;
    clientY: number;
  } | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    async function renderDiagram() {
      try {
        const mermaid = (await import("mermaid")).default;

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "dark",
          themeVariables: {
            background: "#050812",
            primaryColor: "#0f172a",
            primaryTextColor: "#e2e8f0",
            primaryBorderColor: "#22d3ee",
            lineColor: "#67e8f9",
            secondaryColor: "#111827",
            tertiaryColor: "#0b1220",
          },
        });

        const result = await mermaid.render(`gigatable-docs-${id}`, chart);

        if (isMounted) {
          setSvg(result.svg);
          setError("");
          setTransform(getResetTransform());
        }
      } catch (renderError) {
        if (isMounted) {
          setSvg("");
          setError(
            renderError instanceof Error
              ? renderError.message
              : "Unable to render diagram.",
          );
        }
      }
    }

    void renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [chart, id]);

  React.useEffect(() => {
    const element = figureRef.current;

    if (!element) {
      return;
    }

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setViewportSize({
        width: Math.max(1, rect.width),
        height: Math.max(1, rect.height),
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [svg]);

  const zoomDiagram = React.useCallback(
    (clientX: number, clientY: number, deltaY: number) => {
      const element = figureRef.current;

      if (!element) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const origin = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
      const zoomFactor = deltaY < 0 ? 1.12 : 1 / 1.12;

      setTransform((current) =>
        zoomTransform(current, current.scale * zoomFactor, origin),
      );
    },
    [],
  );

  React.useEffect(() => {
    const element = figureRef.current;

    if (!element || !svg) {
      return;
    }

    const handleNativeWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      zoomDiagram(event.clientX, event.clientY, event.deltaY);
    };

    element.addEventListener("wheel", handleNativeWheel, { passive: false });

    return () => {
      element.removeEventListener("wheel", handleNativeWheel);
    };
  }, [svg, zoomDiagram]);

  const handleWheel = React.useCallback(
    (event: React.WheelEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();

      zoomDiagram(event.clientX, event.clientY, event.deltaY);
    },
    [zoomDiagram],
  );

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.button !== 0) {
        return;
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      panStartRef.current = {
        pointerId: event.pointerId,
        clientX: event.clientX,
        clientY: event.clientY,
      };
      setIsPanning(true);
    },
    [],
  );

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const panStart = panStartRef.current;

      if (!panStart || panStart.pointerId !== event.pointerId) {
        return;
      }

      const deltaX = event.clientX - panStart.clientX;
      const deltaY = event.clientY - panStart.clientY;

      panStartRef.current = {
        ...panStart,
        clientX: event.clientX,
        clientY: event.clientY,
      };
      setTransform((current) => panTransform(current, deltaX, deltaY));
    },
    [],
  );

  const endPan = React.useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (panStartRef.current?.pointerId === event.pointerId) {
      panStartRef.current = null;
      setIsPanning(false);
    }
  }, []);

  const handleDoubleClick = React.useCallback(() => {
    setTransform(getResetTransform());
  }, []);

  if (error) {
    return (
      <pre className="docs-mermaid-fallback">
        <code>{chart}</code>
      </pre>
    );
  }

  if (svg) {
    const baseViewBox = parseSvgViewBox(svg);
    const currentViewBox = baseViewBox
      ? getViewBoxForTransform(baseViewBox, viewportSize, transform)
      : null;
    const transformedSvg = currentViewBox
      ? applyViewBoxToSvg(svg, currentViewBox)
      : svg;

    return (
      <figure
        ref={figureRef}
        className={isPanning ? "docs-mermaid is-panning" : "docs-mermaid"}
        aria-label="Architecture diagram"
        data-scale={transform.scale.toFixed(2)}
        data-viewbox={
          currentViewBox
            ? [
                currentViewBox.minX,
                currentViewBox.minY,
                currentViewBox.width,
                currentViewBox.height,
              ].join(" ")
            : undefined
        }
        onDoubleClick={handleDoubleClick}
        onPointerCancel={endPan}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPan}
        onWheel={handleWheel}
        title="Scroll to zoom, drag to pan, double-click to reset"
      >
        <div
          className="docs-mermaid-canvas"
          dangerouslySetInnerHTML={{ __html: transformedSvg }}
        />
      </figure>
    );
  }

  return (
    <figure className="docs-mermaid" aria-label="Architecture diagram">
      Rendering diagram...
    </figure>
  );
}

