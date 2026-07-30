import { lazy, Suspense, useState } from "react";
import { SiteLink } from "../site/site-link";
import { SupportLink } from "../site/support-link";

const StandardDemoTable = lazy(() =>
  import("./standard-demo-table").then((module) => ({
    default: module.StandardDemoTable,
  })),
);
const AdvancedDemoTable = lazy(() =>
  import("./advanced-demo-table").then((module) => ({
    default: module.AdvancedDemoTable,
  })),
);

interface DemoPageProps {
  navigate: (href: string) => void;
}

export function DemoPage({ navigate }: DemoPageProps) {
  const [advanced, setAdvanced] = useState(false);

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      <header className="border-b border-[#d9e1ec] bg-white">
        <div className="mx-auto flex max-w-[1480px] flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <SiteLink
              href="/"
              navigate={navigate}
              className="text-sm font-semibold text-[#2563eb]"
            >
              Gigatable
            </SiteLink>
            <h1 className="mt-1 text-2xl font-semibold">
              Interactive React data grid demo
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#475569]">
              Try cell and range selection, inline editing, Excel-compatible
              copy/paste, fill handles, column resizing, keyboard navigation,
              virtualization, and undo/redo.
            </p>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <SupportLink className="demo-support-link" />
            <SiteLink
              href="/docs/"
              navigate={navigate}
              className="rounded-md border border-[#cfd8e5] px-3 py-2 font-medium text-[#334155] hover:border-[#94a3b8]"
            >
              Docs
            </SiteLink>
            <SiteLink
              href="/"
              navigate={navigate}
              className="rounded-md bg-[#0f172a] px-3 py-2 font-medium text-white hover:bg-[#1e293b]"
            >
              Landing
            </SiteLink>
          </nav>
        </div>
      </header>
      <section className="mx-auto max-w-[1480px] px-5 py-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2 text-xs font-medium text-[#475569]">
            <span className="rounded bg-[#e0f2fe] px-2 py-1 text-[#075985]">
              Virtualized rows and columns
            </span>
            <span className="rounded bg-[#dcfce7] px-2 py-1 text-[#166534]">
              Editable cells
            </span>
            <span className="rounded bg-[#fef3c7] px-2 py-1 text-[#92400e]">
              Excel-compatible TSV
            </span>
            <span className="rounded bg-[#ede9fe] px-2 py-1 text-[#5b21b6]">
              Fill and history
            </span>
          </div>
          <button
            type="button"
            onClick={() => setAdvanced((current) => !current)}
            className="inline-flex h-8 items-center rounded-md border border-[#cfd8e5] bg-white px-3 text-xs font-semibold text-[#334155]"
          >
            {advanced ? "Standard demo" : "Advanced composition"}
          </button>
        </div>
        <Suspense
          fallback={
            <div className="demo-table-loading" role="status">
              Loading the interactive 1,000-row, 300-column dataset…
            </div>
          }
        >
          {advanced ? <AdvancedDemoTable /> : <StandardDemoTable />}
        </Suspense>
        <aside className="demo-seo-links">
          <p>
            Ready to build? Read the{" "}
            <SiteLink href="/docs/quickstart/" navigate={navigate}>
              React data grid quickstart
            </SiteLink>
            , inspect{" "}
            <SiteLink href="/features/excel-copy-paste/" navigate={navigate}>
              Excel-compatible copy and paste
            </SiteLink>
            , or{" "}
            <SiteLink href="/docs/installation/" navigate={navigate}>
              install the TypeScript source
            </SiteLink>
            .
          </p>
        </aside>
      </section>
    </main>
  );
}
