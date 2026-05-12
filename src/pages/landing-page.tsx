import { useState, type CSSProperties } from "react";
import { EditableCell, Gigatable, themes, useGigatable } from "../gigatable";
import type { EditableCellInputProps } from "../gigatable";
import { ParticleField } from "../site/particle-field";
import { GitHubLink } from "../site/github-link";
import { SiteLink } from "../site/site-link";
import type { ColumnDef } from "@tanstack/react-table";

interface LandingPageProps {
  navigate: (href: string) => void;
}

interface PreviewStrain extends Record<string, unknown> {
  id: string;
  name: string;
  project: string;
  storage: string;
  ph: number;
  viability: number;
  status: string;
}

const previewData: Array<PreviewStrain> = [
  {
    id: "GT-042",
    name: "Astra Lager",
    project: "Future Brew",
    storage: "banked",
    ph: 6.8,
    viability: 97,
    status: "Ready",
  },
  {
    id: "GT-057",
    name: "Kilo Flora",
    project: "BioPioneer",
    storage: "banked",
    ph: 7.1,
    viability: 98,
    status: "Validated",
  },
  {
    id: "GT-063",
    name: "Nova Ale",
    project: "Gen Revolution",
    storage: "unbanked",
    ph: 6.6,
    viability: 94,
    status: "Review",
  },
  {
    id: "GT-088",
    name: "Helio Culture",
    project: "Quantum Flora",
    storage: "banked",
    ph: 7.4,
    viability: 96,
    status: "Ready",
  },
  {
    id: "GT-104",
    name: "Vera Cell",
    project: "Project Zero",
    storage: "banked",
    ph: 6.9,
    viability: 99,
    status: "Validated",
  },
  {
    id: "GT-118",
    name: "Orbit Malt",
    project: "Super Project",
    storage: "unbanked",
    ph: 7.2,
    viability: 95,
    status: "Queued",
  },
  {
    id: "GT-124",
    name: "Lumen Koji",
    project: "Bright Cellar",
    storage: "banked",
    ph: 6.7,
    viability: 96,
    status: "Ready",
  },
  {
    id: "GT-131",
    name: "Cinder Bloom",
    project: "Thermo Vault",
    storage: "banked",
    ph: 7.0,
    viability: 97,
    status: "Validated",
  },
  {
    id: "GT-149",
    name: "Echo Spore",
    project: "Signal Lab",
    storage: "unbanked",
    ph: 6.5,
    viability: 93,
    status: "Review",
  },
];

const PreviewTextInput = ({
  value,
  onChange,
  onBlur,
  onKeyDown,
}: EditableCellInputProps<unknown>) => (
  <input
    autoFocus
    value={String(value ?? "")}
    onChange={onChange}
    onBlur={onBlur}
    onKeyDown={onKeyDown}
  />
);

const previewColumns: Array<ColumnDef<PreviewStrain>> = [
  { accessorKey: "id", header: "ID", size: 96 },
  {
    accessorKey: "name",
    header: "Name",
    size: 190,
    cell: (cell) => <EditableCell {...cell} renderInput={PreviewTextInput} />,
    meta: { editable: true },
  },
  { accessorKey: "project", header: "Project", size: 220 },
  { accessorKey: "storage", header: "Storage", size: 132 },
  {
    accessorKey: "ph",
    header: "pH",
    size: 96,
    cell: (cell) => <EditableCell {...cell} renderInput={PreviewTextInput} />,
    meta: { editable: true },
  },
  {
    accessorKey: "viability",
    header: "Viability",
    size: 136,
    cell: (cell) => <EditableCell {...cell} renderInput={PreviewTextInput} />,
    meta: { editable: true },
  },
  { accessorKey: "status", header: "Status", size: 298 },
];

const featureStats = [
  ["100k+", "Virtualized Rows"],
  ["TSV", "Copy & Paste"],
  ["Typed", "Theme API"],
  ["Undo", "History Stack"],
];

const installCommand = "npx gigatable init";

export function LandingPage({ navigate }: LandingPageProps) {
  const [copiedInstallCommand, setCopiedInstallCommand] = useState(false);
  const { table, paste, applyFill, undo, redo } = useGigatable({
    columns: previewColumns,
    data: previewData,
    history: true,
  });

  const copyInstallCommand = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = installCommand;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopiedInstallCommand(true);
    window.setTimeout(() => setCopiedInstallCommand(false), 1400);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#05070d] text-slate-100">
      <ParticleField />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(34,211,238,0.14),transparent_30%),linear-gradient(180deg,rgba(5,7,13,0.18),rgba(5,7,13,0.88)_62%,#05070d)]" />
      <div className="relative z-10">
        <header className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <SiteLink
            href="/"
            navigate={navigate}
            className="inline-flex items-center gap-2 rounded-md text-sm font-bold uppercase tracking-[0.18em] text-cyan-100 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
            <span>Gigatable</span>
          </SiteLink>
          <nav className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1 text-sm shadow-2xl shadow-black/20 backdrop-blur">
            <GitHubLink className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]" />
            <SiteLink
              href="/docs"
              navigate={navigate}
              className="rounded-full px-4 py-2 font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
            >
              Docs
            </SiteLink>
            <SiteLink
              href="/demo"
              navigate={navigate}
              className="rounded-full bg-cyan-300 px-4 py-2 font-semibold text-slate-950 shadow-[0_0_24px_rgba(103,232,249,0.25)] transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
            >
              Demo
            </SiteLink>
          </nav>
        </header>

        <section className="mx-auto flex w-full max-w-7xl px-5 pb-14 pt-10 sm:px-8 md:pt-16 lg:min-h-[calc(72vh-80px)] lg:px-10 lg:pb-20 lg:pt-14">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200 shadow-[0_0_40px_rgba(34,211,238,0.12)]">
              React + TanStack Table + Virtual
            </div>
            <h1 className="mx-auto max-w-[820px] text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl">
              Excel-grade grids for React.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Gigatable gives you cell selection, editable cells, TSV
              copy/paste, fill handle, undo/redo, and virtualized rows as
              source you install directly into your app.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <SiteLink
                href="/docs"
                navigate={navigate}
                className="inline-flex h-12 items-center justify-center rounded-md bg-white px-5 text-sm font-bold text-slate-950 shadow-[0_18px_60px_rgba(255,255,255,0.12)] transition-transform hover:-translate-y-0.5 hover:bg-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
              >
                Read The Docs
              </SiteLink>
              <SiteLink
                href="/demo"
                navigate={navigate}
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/15 bg-white/[0.04] px-5 text-sm font-bold text-slate-100 backdrop-blur transition-transform hover:-translate-y-0.5 hover:border-cyan-300/60 hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
              >
                Open Demo
              </SiteLink>
            </div>
            <div className="mx-auto mt-5 flex max-w-xl items-center gap-2 rounded-lg border border-white/10 bg-slate-950/70 p-1.5 text-left shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur">
              <div className="min-w-0 flex-1 overflow-hidden px-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200/80">
                  Install
                </div>
                <code className="mt-1 block truncate font-mono text-sm font-semibold text-slate-100 sm:text-base">
                  {installCommand}
                </code>
              </div>
              <button
                type="button"
                onClick={copyInstallCommand}
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-cyan-300/20 bg-cyan-300/10 px-4 text-sm font-bold text-cyan-100 transition-colors hover:border-cyan-200/60 hover:bg-cyan-300/20 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
                aria-label="Copy install command"
              >
                {copiedInstallCommand ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {featureStats.map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-3 backdrop-blur"
                >
                  <div className="text-sm font-bold text-cyan-200">{value}</div>
                  <div className="mt-1 truncate text-xs font-medium text-slate-400">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 pb-10 sm:px-8 lg:px-10">
          <div className="rounded-xl border border-white/10 bg-slate-950/75 p-3 shadow-[0_34px_140px_rgba(0,0,0,0.58)] backdrop-blur-xl">
            <div className="mb-3 flex flex-col gap-3 px-1 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  <span className="font-bold uppercase tracking-[0.16em] text-slate-300">
                    Live Preview
                  </span>
                </div>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                  Try the same selection, paste, fill, and edit surface that
                  ships as source into your app.
                </p>
              </div>
              <span className="font-medium tabular-nums">
                {previewData.length} Rows / {previewColumns.length} Columns
              </span>
            </div>
            <div
              className="gt-landing-preview overflow-hidden rounded-lg border border-slate-700/70 bg-[#050812]"
              style={{ "--gt-table-height": "318px" } as CSSProperties}
            >
              <Gigatable
                theme={themes.giga}
                table={table}
                allowCellSelection
                allowRangeSelection
                allowHistory
                allowPaste
                allowFillHandle
                paste={paste}
                applyFill={applyFill}
                undo={undo}
                redo={redo}
              />
            </div>
            <div className="mt-3 grid gap-2 text-xs text-slate-400 sm:grid-cols-3">
              <div className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">
                Select cells
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">
                Paste TSV
              </div>
              <div className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">
                Fill down
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8 lg:px-10">
          <div className="rounded-xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur">
            <div className="mb-5 text-center text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Sponsors
            </div>
            <div className="flex justify-center">
              <a
                href="https://thinktank.preskok.si/en/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-lg border border-white/10 bg-white p-4 shadow-2xl shadow-black/20 transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d]"
              >
                <img
                  src="/preskok_thinktank.png"
                  alt="Preskok ThinkTank"
                  className="h-14 w-auto object-contain"
                />
              </a>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#06101a]/90 backdrop-blur">
          <div className="mx-auto grid max-w-7xl gap-4 px-5 py-10 sm:px-8 md:grid-cols-3 lg:px-10">
            {[
              ["Installable source", "Run `npx gigatable init` and own the copied component code."],
              ["Spreadsheet behavior", "Selection, ranges, paste, fill, and history are built in."],
              ["Themeable surface", "Use presets, partial overrides, or write your own theme."],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-lg border border-white/10 bg-white/[0.035] p-5"
              >
                <h2 className="text-base font-bold text-white">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
