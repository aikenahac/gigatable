import { Gigatable, PasteResult, themes, useGigatable } from "../gigatable";
import { columns } from "../columns";
import { strains } from "../strains";
import { SiteLink } from "../site/site-link";
import type { CSSProperties } from "react";

interface DemoPageProps {
  navigate: (href: string) => void;
}

export function DemoPage({ navigate }: DemoPageProps) {
  const { table, paste, applyFill, undo, redo, canUndo, canRedo } = useGigatable({
    columns,
    data: strains,
    history: true,
  });

  const handlePasteComplete = (result: PasteResult) => {
    console.log(`Paste completed: ${result.totalChanges} cells changed`);
    console.log(JSON.stringify(result.changes));
  };

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
            <h1 className="mt-1 text-2xl font-semibold">Interactive demo</h1>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <SiteLink
              href="/docs"
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
              Virtualized rows
            </span>
            <span className="rounded bg-[#dcfce7] px-2 py-1 text-[#166534]">
              Editable cells
            </span>
            <span className="rounded bg-[#fef3c7] px-2 py-1 text-[#92400e]">
              TSV copy/paste
            </span>
            <span className="rounded bg-[#ede9fe] px-2 py-1 text-[#5b21b6]">
              Fill handle
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className="inline-flex h-8 items-center rounded-md border border-[#cfd8e5] bg-white px-3 text-xs font-semibold text-[#334155] shadow-sm transition-colors hover:border-[#94a3b8] hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-45"
            >
              Undo
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className="inline-flex h-8 items-center rounded-md border border-[#cfd8e5] bg-white px-3 text-xs font-semibold text-[#334155] shadow-sm transition-colors hover:border-[#94a3b8] hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-45"
            >
              Redo
            </button>
          </div>
        </div>
        <div
          className="demo-table-shell"
          style={
            { "--gt-table-height": "calc(100vh - 178px)" } as CSSProperties
          }
        >
          <Gigatable
            theme={themes.light}
            table={table}
            allowCellSelection
            allowRangeSelection
            allowHistory
            allowPaste
            allowFillHandle
            allColumnsEditable
            singleColumnCellSelection
            paste={paste}
            applyFill={applyFill}
            onPasteComplete={handlePasteComplete}
            undo={undo}
            redo={redo}
          />
        </div>
      </section>
    </main>
  );
}
