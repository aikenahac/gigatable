import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  docsSections,
  extractMarkdownHeadings,
  getDocBySlug,
  getMarkdownHeadingId,
} from "../docs/docs";
import type { DocsSlug } from "../docs/docs";
import {
  applyViewBoxToSvg,
  getViewBoxForTransform,
  getInitialTransform,
  getResetTransform,
  panTransform,
  parseSvgViewBox,
  zoomTransform,
} from "../docs/mermaid-pan-zoom";
import { GitHubLink } from "../site/github-link";
import { SiteLink } from "../site/site-link";

interface DocsPageProps {
  navigate: (href: string) => void;
  slug: DocsSlug;
}

function textFromChildren(children: React.ReactNode): string {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }

      if (React.isValidElement<{ children?: React.ReactNode }>(child)) {
        return textFromChildren(child.props.children);
      }

      return "";
    })
    .join("");
}

function MermaidBlock({ chart }: { chart: string }) {
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
    <figure
      className="docs-mermaid"
      aria-label="Architecture diagram"
    >
      Rendering diagram...
    </figure>
  );
}

export function DocsPage({ navigate, slug }: DocsPageProps) {
  const doc = getDocBySlug(slug);
  const headings = extractMarkdownHeadings(doc.content);

  return (
    <main className="min-h-screen bg-[#05070d] text-slate-100 scheme-dark">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#05070d]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[96rem] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <div className="flex min-w-0 items-center gap-6">
            <SiteLink
              href="/"
              navigate={navigate}
              className="inline-flex items-center gap-2 rounded-md text-sm font-bold text-cyan-100 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.75)]" />
              <span>Gigatable</span>
            </SiteLink>
            <nav className="hidden items-center gap-1 rounded-md border border-white/10 bg-white/4 p-1 text-sm shadow-2xl shadow-black/20 md:flex">
              <SiteLink
                href="/docs"
                navigate={navigate}
                className="rounded bg-cyan-300/10 px-3 py-1.5 font-semibold text-cyan-100 shadow-sm transition-colors hover:bg-cyan-300/15 hover:text-white"
              >
                Docs
              </SiteLink>
              <SiteLink
                href="/demo"
                navigate={navigate}
                className="rounded px-3 py-1.5 font-semibold text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                Demo
              </SiteLink>
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <code className="hidden rounded-md border border-white/10 bg-slate-950/80 px-3 py-2 text-xs font-semibold text-cyan-100 shadow-sm sm:block">
              npx gigatable init
            </code>
            <GitHubLink className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/4 text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]" />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[96rem] grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_240px] lg:px-10">
        <aside className="border-b border-white/10 bg-slate-950/65 px-5 py-4 sm:px-8 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:border-b-0 lg:border-r lg:bg-transparent lg:px-0 lg:py-8 lg:pr-6">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            Documentation
          </div>
          <nav className="flex gap-4 overflow-x-auto pb-1 lg:block lg:space-y-6 lg:overflow-visible lg:pb-0">
            {docsSections.map((section) => (
              <div key={section.id} className="min-w-fit lg:min-w-0">
                <div className="mb-2 px-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                  {section.title}
                </div>
                <div className="flex gap-2 lg:block">
                  {section.items.map((item) => {
                    const isActive = item.slug === doc.slug;

                    return (
                      <SiteLink
                        key={item.slug}
                        href={`/docs/${item.slug}`}
                        navigate={navigate}
                        className={
                          isActive
                            ? "block min-w-fit rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm font-bold text-cyan-100 shadow-sm shadow-cyan-950/20"
                            : "block min-w-fit rounded-md px-3 py-2 text-sm font-semibold text-slate-400 transition-colors hover:bg-white/6 hover:text-slate-100 hover:shadow-sm"
                        }
                      >
                        {item.title}
                      </SiteLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <article className="min-w-0 border-x border-white/10 bg-[#080d18] px-5 py-8 shadow-[0_0_120px_rgba(0,0,0,0.28)] sm:px-8 md:py-12 lg:px-12">
          <div className="mb-10 border-b border-white/10 pb-8">
            <div className="text-sm font-bold text-cyan-200">
              Gigatable docs
            </div>
            <h1 className="mt-3 text-balance text-4xl font-bold tracking-[-0.025em] text-white sm:text-5xl">
              {doc.title}
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-slate-400">
              {doc.description}
            </p>
          </div>

          <div className="docs-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: () => null,
                h2: ({ children, ...props }) => {
                  const title = textFromChildren(children);
                  return (
                    <h2 id={getMarkdownHeadingId(title)} {...props}>
                      {children}
                    </h2>
                  );
                },
                h3: ({ children, ...props }) => {
                  const title = textFromChildren(children);
                  return (
                    <h3 id={getMarkdownHeadingId(title)} {...props}>
                      {children}
                    </h3>
                  );
                },
                a: ({ href, children, ...props }) => {
                  if (href?.startsWith("/")) {
                    return (
                      <SiteLink href={href} navigate={navigate} {...props}>
                        {children}
                      </SiteLink>
                    );
                  }

                  return (
                    <a href={href} {...props}>
                      {children}
                    </a>
                  );
                },
                pre: ({ children, ...props }) => {
                  const [child] = React.Children.toArray(children);

                  if (
                    React.isValidElement<{ className?: string }>(child) &&
                    child.props.className === "language-mermaid"
                  ) {
                    return <>{children}</>;
                  }

                  return <pre {...props}>{children}</pre>;
                },
                code: ({ className, children, ...props }) => {
                  const code = String(children).replace(/\n$/, "");

                  if (className === "language-mermaid") {
                    return <MermaidBlock chart={code} />;
                  }

                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {doc.content}
            </ReactMarkdown>
          </div>
        </article>

        <aside className="hidden px-5 py-8 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-64px)]">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            On this page
          </div>
          <nav className="mt-3 space-y-1">
            {headings.map((heading) => (
              <a
                key={`${heading.id}-${heading.title}`}
                href={`#${heading.id}`}
                className={
                  heading.level === 3
                    ? "block rounded-md py-1 pl-5 pr-2 text-sm font-medium text-slate-500 transition-colors hover:bg-white/6 hover:text-cyan-100"
                    : "block rounded-md px-2 py-1 text-sm font-semibold text-slate-400 transition-colors hover:bg-white/6 hover:text-cyan-100"
                }
              >
                {heading.title}
              </a>
            ))}
          </nav>
        </aside>
      </div>
    </main>
  );
}
