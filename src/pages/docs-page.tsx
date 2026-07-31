import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  extractMarkdownHeadings,
  getAdjacentDocs,
  getDocBySlug,
  getDocPath,
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
import { SupportLink } from "../site/support-link";
import { ThemeSelector } from "../site/theme";
import {
  CodeBlock,
  PackageManagerTabs,
  type GigatableCliCommand,
} from "../docs/code-block";
import { DocsNavigation, DocsSearchButton } from "../docs/docs-navigation";
import { SearchDialog } from "../docs/search-dialog";
import { PageActionsMenu } from "../docs/page-actions-menu";

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

function removeCalloutMarker(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) {
      return child;
    }

    return React.cloneElement(child, {
      children: React.Children.map(child.props.children, (nestedChild) =>
        typeof nestedChild === "string"
          ? nestedChild.replace(/^\s*\[!(NOTE|TIP|WARNING)]\s*/i, "")
          : nestedChild,
      ),
    });
  });
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
    <figure className="docs-mermaid" aria-label="Architecture diagram">
      Rendering diagram...
    </figure>
  );
}

export function DocsPage({ navigate, slug }: DocsPageProps) {
  const doc = getDocBySlug(slug);
  const headings = React.useMemo(
    () => extractMarkdownHeadings(doc.content),
    [doc.content],
  );
  const adjacent = getAdjacentDocs(doc.slug);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const mobileMenuButtonRef = React.useRef<HTMLButtonElement>(null);
  const mobileNavRef = React.useRef<HTMLDivElement>(null);
  const [activeHeading, setActiveHeading] = React.useState(
    headings[0]?.id ?? "",
  );

  const closeMobileNav = React.useCallback((restoreFocus = true) => {
    setMobileNavOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => mobileMenuButtonRef.current?.focus());
    }
  }, []);

  React.useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  React.useEffect(() => {
    const navigation = mobileNavRef.current;
    if (!mobileNavOpen || !navigation) {
      return;
    }

    const focusable = Array.from(
      navigation.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileNav();
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeMobileNav, mobileNavOpen]);

  React.useEffect(() => {
    setActiveHeading(headings[0]?.id ?? "");
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));
    if (!elements.length || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (visible?.target.id) {
          setActiveHeading(visible.target.id);
        }
      },
      { rootMargin: "-90px 0px -68% 0px", threshold: [0, 1] },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [doc.slug, headings]);

  const packageManagerMarker = /<!-- package-manager-tabs(?::add-cells)? -->/g;
  const packageManagerCommands: GigatableCliCommand[] = Array.from(
    doc.content.matchAll(packageManagerMarker),
    (match) => (match[0].includes(":add-cells") ? "add cells" : "init"),
  );
  const markdownSegments = doc.content.split(packageManagerMarker);
  const visibleMarkdownSegments = markdownSegments.map((segment, index) =>
    index === 0 ? segment : segment.replace(/^\s*```bash\n[\s\S]*?```\n/, ""),
  );

  const renderMarkdown = (content: string, key: string) => (
    <ReactMarkdown
      key={key}
      remarkPlugins={[remarkGfm]}
      components={{
        h1: () => null,
        h2: ({ children, ...props }) => {
          const title = textFromChildren(children);
          return (
            <h2 id={getMarkdownHeadingId(title)} {...props}>
              {children}
              <a
                className="docs-heading-anchor"
                href={`#${getMarkdownHeadingId(title)}`}
                aria-label={`Link to ${title}`}
              >
                #
              </a>
            </h2>
          );
        },
        h3: ({ children, ...props }) => {
          const title = textFromChildren(children);
          return (
            <h3 id={getMarkdownHeadingId(title)} {...props}>
              {children}
              <a
                className="docs-heading-anchor"
                href={`#${getMarkdownHeadingId(title)}`}
                aria-label={`Link to ${title}`}
              >
                #
              </a>
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
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noreferrer" : undefined}
              {...props}
            >
              {children}
            </a>
          );
        },
        table: ({ children, ...props }) => (
          <div className="docs-table-scroll">
            <table {...props}>{children}</table>
          </div>
        ),
        blockquote: ({ children }) => {
          const label = textFromChildren(children).match(
            /^\s*\[!(NOTE|TIP|WARNING)]/i,
          )?.[1];
          return (
            <blockquote
              className={label ? `docs-callout is-${label.toLowerCase()}` : ""}
            >
              {label ? <strong>{label}</strong> : null}
              <div className={label ? "docs-callout-content" : undefined}>
                {label ? removeCalloutMarker(children) : children}
              </div>
            </blockquote>
          );
        },
        pre: ({ children }) => <>{children}</>,
        code: ({ className, children, ...props }) => {
          const code = String(children).replace(/\n$/, "");
          const language = className?.replace("language-", "");

          if (language === "mermaid") {
            return <MermaidBlock chart={code} />;
          }

          if (language || code.includes("\n")) {
            return <CodeBlock code={code} language={language} />;
          }

          return (
            <code className={className} translate="no" {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );

  return (
    <div className="docs-app">
      <a href="#docs-main" className="site-skip-link">
        Skip to Documentation
      </a>
      <header className="docs-header">
        <div className="docs-header-inner">
          <div className="docs-header-brand">
            <button
              ref={mobileMenuButtonRef}
              type="button"
              className="docs-mobile-menu-button"
              aria-label="Open documentation navigation"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen(true)}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <SiteLink href="/" navigate={navigate} className="docs-logo">
              <span />
              <span>Gigatable</span>
            </SiteLink>
            <nav aria-label="Primary">
              <SiteLink href="/docs/" navigate={navigate} aria-current="page">
                Docs
              </SiteLink>
              <SiteLink href="/demo" navigate={navigate}>
                Demo
              </SiteLink>
            </nav>
          </div>
          <div className="docs-header-actions">
            <DocsSearchButton onClick={() => setSearchOpen(true)} />
            <SupportLink className="site-support-link" />
            <ThemeSelector compact />
            <GitHubLink className="site-icon-button" />
          </div>
        </div>
      </header>

      <div className="docs-layout">
        <aside className="docs-sidebar">
          <DocsSearchButton onClick={() => setSearchOpen(true)} />
          <DocsNavigation current={doc} navigate={navigate} />
        </aside>

        <main id="docs-main" className="docs-main">
          <article>
            <nav className="docs-breadcrumbs" aria-label="Breadcrumb">
              <SiteLink href="/" navigate={navigate}>
                Gigatable
              </SiteLink>
              <span aria-hidden="true">/</span>
              {doc.slug === "overview" ? (
                <span>Docs</span>
              ) : (
                <>
                  <SiteLink href="/docs/" navigate={navigate}>
                    Docs
                  </SiteLink>
                  <span aria-hidden="true">/</span>
                  <span>{doc.title}</span>
                </>
              )}
            </nav>
            <header className="docs-article-header">
              <div>
                <span>{doc.sectionTitle}</span>
                <h1>
                  {doc.slug === "overview"
                    ? "Gigatable React Data Grid Documentation"
                    : doc.title}
                </h1>
                <p>{doc.seoDescription}</p>
              </div>
              <PageActionsMenu doc={doc} />
            </header>

            {headings.length ? (
              <details className="docs-mobile-outline">
                <summary>On This Page</summary>
                <nav aria-label="On this page">
                  {headings.map((heading) => (
                    <a key={heading.id} href={`#${heading.id}`}>
                      {heading.title.replace(/`/g, "")}
                    </a>
                  ))}
                </nav>
              </details>
            ) : null}

            <div className="docs-content">
              {visibleMarkdownSegments.map((segment, index) => (
                <React.Fragment key={`${doc.slug}-${index}`}>
                  {renderMarkdown(segment, `${doc.slug}-${index}`)}
                  {index < visibleMarkdownSegments.length - 1 ? (
                    <PackageManagerTabs
                      command={packageManagerCommands[index]}
                    />
                  ) : null}
                </React.Fragment>
              ))}
            </div>

            <footer className="docs-article-footer">
              <div className="docs-pagination">
                {adjacent.previous ? (
                  <SiteLink
                    href={getDocPath(adjacent.previous.slug)}
                    navigate={navigate}
                  >
                    <span>Previous</span>
                    <strong>{adjacent.previous.title}</strong>
                  </SiteLink>
                ) : (
                  <span />
                )}
                {adjacent.next ? (
                  <SiteLink
                    href={getDocPath(adjacent.next.slug)}
                    navigate={navigate}
                  >
                    <span>Next</span>
                    <strong>{adjacent.next.title}</strong>
                  </SiteLink>
                ) : null}
              </div>
              <div className="docs-contribute-links">
                <a href={doc.editUrl} target="_blank" rel="noreferrer">
                  Edit This Page
                </a>
                <a href="/llms.txt" target="_blank" rel="noreferrer">
                  llms.txt
                </a>
                <a href="/llms-full.txt" target="_blank" rel="noreferrer">
                  llms-full.txt
                </a>
              </div>
            </footer>
          </article>
        </main>

        <aside className="docs-outline">
          <h2>On This Page</h2>
          <nav aria-label="On this page">
            {headings.map((heading) => (
              <a
                key={`${heading.id}-${heading.title}`}
                href={`#${heading.id}`}
                aria-current={
                  activeHeading === heading.id ? "location" : undefined
                }
                data-level={heading.level}
              >
                {heading.title.replace(/`/g, "")}
              </a>
            ))}
          </nav>
        </aside>
      </div>

      {mobileNavOpen ? (
        <div
          ref={mobileNavRef}
          className="docs-mobile-nav"
          role="dialog"
          aria-label="Documentation navigation"
          aria-modal="true"
        >
          <button
            className="docs-mobile-backdrop"
            type="button"
            aria-label="Close documentation navigation"
            onClick={() => closeMobileNav()}
          />
          <aside>
            <div>
              <strong>Documentation</strong>
              <button
                type="button"
                aria-label="Close documentation navigation"
                onClick={() => closeMobileNav()}
              >
                ×
              </button>
            </div>
            <DocsSearchButton
              onClick={() => {
                closeMobileNav(false);
                setSearchOpen(true);
              }}
            />
            <DocsNavigation
              current={doc}
              navigate={navigate}
              onNavigate={() => closeMobileNav(false)}
            />
          </aside>
        </div>
      ) : null}

      <SearchDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        navigate={navigate}
      />
    </div>
  );
}
