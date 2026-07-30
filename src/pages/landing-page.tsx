import type { CSSProperties } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { EditableCell, Gigatable, themes, useGigatable } from "../gigatable";
import type { EditableCellInputProps } from "../gigatable";
import { PackageManagerTabs } from "../docs/code-block";
import { GitHubLink } from "../site/github-link";
import { ParticleField } from "../site/particle-field";
import { SiteLink } from "../site/site-link";
import { SupportLink } from "../site/support-link";
import { ThemeSelector } from "../site/theme";

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
    ph: 7,
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
    aria-label="Cell value"
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
  { accessorKey: "project", header: "Project", size: 210 },
  { accessorKey: "storage", header: "Storage", size: 132 },
  {
    accessorKey: "ph",
    header: "pH",
    size: 96,
    cell: (cell) => <EditableCell {...cell} renderInput={PreviewTextInput} />,
    meta: {
      editable: true,
      parsePastedValue: (value) => Number(value),
    },
  },
  {
    accessorKey: "viability",
    header: "Viability",
    size: 136,
    cell: (cell) => <EditableCell {...cell} renderInput={PreviewTextInput} />,
    meta: {
      editable: true,
      parsePastedValue: (value) => Number(value),
    },
  },
  { accessorKey: "status", header: "Status", size: 190 },
];

const features = [
  {
    index: "01",
    title: "Select Like a Spreadsheet",
    description:
      "Click, drag, Shift-select, and navigate with the keyboard across virtualized rows.",
    code: "allowCellSelection\nallowRangeSelection",
  },
  {
    index: "02",
    title: "Edit Domain Values",
    description:
      "Bring your own inputs, parse clipboard values, and clear cells with typed defaults.",
    code: "meta: { editable: true }",
  },
  {
    index: "03",
    title: "Move Data With TSV",
    description:
      "Round-trip rectangular selections through Excel and Google Sheets.",
    code: "allowPaste\nonPasteComplete",
  },
  {
    index: "04",
    title: "Fill Any Direction",
    description:
      "Repeat values vertically or horizontally with eligible-column and preview hooks.",
    code: 'fillDirection="both"',
  },
  {
    index: "05",
    title: "Undo Every Mutation",
    description:
      "Edits, paste, fill, and clearing become coherent history entries.",
    code: "history: true\nmaxHistorySize: 50",
  },
  {
    index: "06",
    title: "Compose the Renderer",
    description:
      "Replace the body, cells, footer, or virtualizer without losing interactions.",
    code: "<Gigatable.Cell />",
  },
];

const architecture = [
  ["React 19", "Concurrent-ready UI"],
  ["TanStack Table", "Headless table state"],
  ["TanStack Virtual", "Only visible rows mount"],
  ["TypeScript", "Typed from input to theme"],
];

export function LandingPage({ navigate }: LandingPageProps) {
  const { table, paste, applyFill, applyHorizontalFill, undo, redo } =
    useGigatable({
      columns: previewColumns,
      data: previewData,
      history: true,
      enableColumnResizing: true,
      columnResizeMode: "onChange",
    });
  return (
    <main className="landing-page">
      <a href="#landing-content" className="site-skip-link">
        Skip to Main Content
      </a>
      <div className="landing-ambient" aria-hidden="true">
        <ParticleField />
        <div />
      </div>

      <header className="landing-header">
        <SiteLink href="/" navigate={navigate} className="landing-logo">
          <span />
          <span>Gigatable</span>
        </SiteLink>
        <nav aria-label="Primary">
          <SiteLink href="/docs" navigate={navigate}>
            Docs
          </SiteLink>
          <SiteLink href="/demo" navigate={navigate}>
            Demo
          </SiteLink>
          <SupportLink className="site-support-link" />
          <ThemeSelector compact />
          <GitHubLink className="site-icon-button" />
        </nav>
      </header>

      <div id="landing-content">
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <div className="landing-eyebrow">
              <span />
              Source-installed React data grid
            </div>
            <h1>
              Excel-grade grids.
              <br />
              <span>Your source. Your rules.</span>
            </h1>
            <p>
              Selection, editing, TSV clipboard, directional fill, history,
              resizing, and virtualized rows—delivered as TypeScript source you
              own.
            </p>
            <div className="landing-hero-actions">
              <SiteLink href="/docs" navigate={navigate}>
                Start Building
                <span aria-hidden="true">→</span>
              </SiteLink>
              <SiteLink href="/demo" navigate={navigate}>
                Explore the Demo
              </SiteLink>
            </div>
            <div className="landing-proof">
              <span>React 19+</span>
              <span>Tailwind v4</span>
              <span>MIT</span>
              <span>Source owned</span>
            </div>
          </div>

          <div className="landing-install-card">
            <div>
              <span>01</span>
              <strong>Install the Source</strong>
            </div>
            <PackageManagerTabs compact />
            <p>
              The CLI validates your TypeScript project, copies Gigatable, and
              installs only 3 runtime dependencies.
            </p>
            <div className="landing-file-tree" translate="no">
              <span>src/gigatable/</span>
              <span>├── data-table/</span>
              <span>├── table/</span>
              <span>├── theme/</span>
              <span>└── index.ts</span>
            </div>
          </div>
        </section>

        <section className="landing-showcase" aria-labelledby="showcase-title">
          <div className="landing-section-heading">
            <div>
              <span>Interactive Proof</span>
              <h2 id="showcase-title">The product is the demo.</h2>
            </div>
            <p>
              Click a cell, edit a value, paste TSV, drag the fill handle, or
              resize a column. This is the same component installed into your
              app.
            </p>
          </div>

          <div className="landing-grid-frame">
            <div className="landing-window-bar">
              <div aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <strong>strain-library.tsx</strong>
              <span className="landing-live-status">Live</span>
            </div>
            <div
              className="gt-landing-preview"
              style={{ "--gt-table-height": "390px" } as CSSProperties}
            >
              <Gigatable
                theme={themes.giga}
                table={table}
                allowCellSelection
                allowRangeSelection
                allowQuickEdit
                allowHistory
                allowPaste
                allowFillHandle
                fillDirection="both"
                allowColumnResizing
                paste={paste}
                applyFill={applyFill}
                applyHorizontalFill={applyHorizontalFill}
                undo={undo}
                redo={redo}
              />
            </div>
            <div className="landing-grid-guide">
              <span>Click to select</span>
              <span>Double-click to edit</span>
              <span>Drag to fill</span>
              <span>Cmd/Ctrl+Z to undo</span>
            </div>
          </div>
        </section>

        <section className="landing-features" aria-labelledby="features-title">
          <div className="landing-section-heading">
            <div>
              <span>Spreadsheet Behavior</span>
              <h2 id="features-title">Small API. Serious interactions.</h2>
            </div>
            <p>
              Enable only what your product needs. Every behavior stays
              explicit, typed, and customizable.
            </p>
          </div>
          <div className="landing-feature-grid">
            {features.map((feature) => (
              <article key={feature.index}>
                <span>{feature.index}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <pre>
                  <code translate="no">{feature.code}</code>
                </pre>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-source" aria-labelledby="source-title">
          <div className="landing-source-copy">
            <span>Own the Implementation</span>
            <h2 id="source-title">A dependency you can actually change.</h2>
            <p>
              Gigatable follows the shadcn model: install the component into
              your repository, review every line, then adapt it to your domain
              without waiting on a vendor roadmap.
            </p>
            <ul>
              <li>Local TypeScript source with a public barrel</li>
              <li>Typed TanStack metadata augmentation</li>
              <li>Preset themes and CSS custom properties</li>
              <li>Composable rendering and custom virtualizers</li>
            </ul>
            <SiteLink href="/docs/composition" navigate={navigate}>
              Explore Composition <span aria-hidden="true">→</span>
            </SiteLink>
          </div>
          <div className="landing-source-code">
            <div>
              <span>people-grid.tsx</span>
              <span>TSX</span>
            </div>
            <pre>
              <code translate="no">{`const grid = useGigatable({
  columns,
  data,
  history: true,
});

return (
  <Gigatable
    table={grid.table}
    allowCellSelection
    allowRangeSelection
    allowPaste
    paste={grid.paste}
    theme={themes.giga}
  />
);`}</code>
            </pre>
          </div>
        </section>

        <section className="landing-architecture" aria-label="Architecture">
          {architecture.map(([title, description]) => (
            <div key={title}>
              <strong>{title}</strong>
              <span>{description}</span>
            </div>
          ))}
        </section>

        <section className="landing-final-cta">
          <div>
            <span>Ready to ship a better grid?</span>
            <h2>Start with source. End with your product.</h2>
          </div>
          <div>
            <SiteLink href="/docs/installation" navigate={navigate}>
              Install Gigatable
            </SiteLink>
            <SiteLink href="/demo" navigate={navigate}>
              Open Full Demo
            </SiteLink>
          </div>
        </section>

        <footer className="landing-footer">
          <div>
            <SiteLink href="/" navigate={navigate} className="landing-logo">
              <span />
              <span>Gigatable</span>
            </SiteLink>
            <p>Excel-grade data interactions for React, installed as source.</p>
          </div>
          <div className="landing-sponsor">
            <span>Supported by</span>
            <a
              href="https://thinktank.preskok.si/en/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/preskok_thinktank.png"
                alt="Preskok ThinkTank"
                width="220"
                height="56"
                loading="lazy"
              />
            </a>
          </div>
          <nav aria-label="Footer">
            <SiteLink href="/docs" navigate={navigate}>
              Documentation
            </SiteLink>
            <SiteLink href="/demo" navigate={navigate}>
              Demo
            </SiteLink>
            <a
              href="https://github.com/aikenahac/gigatable"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a href="/llms.txt" target="_blank" rel="noreferrer">
              llms.txt
            </a>
          </nav>
        </footer>
      </div>
    </main>
  );
}
