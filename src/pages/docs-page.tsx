import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  docsNav,
  extractMarkdownHeadings,
  getDocBySlug,
  getMarkdownHeadingId,
} from "../docs/docs";
import type { DocsSlug } from "../docs/docs";
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

export function DocsPage({ navigate, slug }: DocsPageProps) {
  const doc = getDocBySlug(slug);
  const headings = extractMarkdownHeadings(doc.content);

  return (
    <main className="min-h-screen bg-[#05070d] text-slate-100 [color-scheme:dark]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#05070d]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <div className="flex min-w-0 items-center gap-6">
            <SiteLink
              href="/"
              navigate={navigate}
              className="inline-flex items-center gap-2 rounded-md text-sm font-bold text-cyan-100 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.75)]" />
              <span>Gigatable</span>
            </SiteLink>
            <nav className="hidden items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] p-1 text-sm shadow-2xl shadow-black/20 md:flex">
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
            <GitHubLink className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]" />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[244px_minmax(0,1fr)_220px] lg:px-10">
        <aside className="border-b border-white/10 bg-slate-950/65 px-5 py-4 sm:px-8 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:border-b-0 lg:border-r lg:bg-transparent lg:px-0 lg:py-8 lg:pr-6">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            Documentation
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-1 lg:block lg:overflow-visible lg:pb-0">
            {docsNav.map((item) => {
              const isActive = item.slug === doc.slug;

              return (
                <SiteLink
                  key={item.slug}
                  href={`/docs/${item.slug}`}
                  navigate={navigate}
                  className={
                    isActive
                      ? "block min-w-fit rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm font-bold text-cyan-100 shadow-sm shadow-cyan-950/20"
                      : "block min-w-fit rounded-md px-3 py-2 text-sm font-semibold text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-slate-100 hover:shadow-sm"
                  }
                >
                  {item.title}
                </SiteLink>
              );
            })}
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
                    ? "block rounded-md py-1 pl-5 pr-2 text-sm font-medium text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-cyan-100"
                    : "block rounded-md px-2 py-1 text-sm font-semibold text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-cyan-100"
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
