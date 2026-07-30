import type { CSSProperties } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { EditableCell, Gigatable, themes, useGigatable } from "../gigatable";
import type { EditableCellInputProps } from "../gigatable";
import { PackageManagerTabs } from "../docs/code-block";
import { GitHubLink } from "../site/github-link";
import { ParticleField } from "../site/particle-field";
import { SiteLink } from "../site/site-link";
import { SupportLink } from "../site/support-link";
import { ThemeSelector, useSiteTheme } from "../site/theme";
import { trackEvent } from "../site/analytics";

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
    title: "Cell and Range Selection",
    description:
      "Click, drag, Shift-select, and move through rectangular ranges with familiar keyboard controls.",
    code: "allowCellSelection\nallowRangeSelection",
  },
  {
    index: "02",
    title: "Keyboard Navigation",
    description:
      "Move with Arrow keys, Tab, Home, and End—even when the target row or column is virtualized.",
    code: "Arrow · Tab · Home · End",
  },
  {
    index: "03",
    title: "Custom Editable Cells",
    description:
      "Bring your own inputs, parse clipboard values, and clear cells with typed defaults.",
    code: "meta: { editable: true }",
  },
  {
    index: "04",
    title: "Excel-Compatible Clipboard",
    description:
      "Copy and paste TSV rectangles between your app, Excel, and Google Sheets.",
    code: "allowPaste\nparsePastedValue",
  },
  {
    index: "05",
    title: "Typed and Repeated Paste",
    description:
      "Convert clipboard strings into domain values and repeat smaller data across selected ranges.",
    code: "onPasteComplete\npasteByColumnId",
  },
  {
    index: "06",
    title: "Fill in Any Direction",
    description:
      "Repeat values vertically or horizontally with eligible-column and preview hooks.",
    code: 'fillDirection="both"',
  },
  {
    index: "07",
    title: "Undo, Redo, and Clear",
    description:
      "Edits, paste, fill, and range clearing become coherent history entries.",
    code: "history: true\nmaxHistorySize: 50",
  },
  {
    index: "08",
    title: "Resize and Virtualize",
    description:
      "Resize columns while row and column windows keep the rendered DOM focused on visible data.",
    code: "allowColumnResizing\nTanStack Virtual",
  },
  {
    index: "09",
    title: "Theme and Compose",
    description:
      "Replace table layers, inputs, themes, and virtualizers without losing the interaction model.",
    code: "themes · CSS variables\n<Gigatable.Cell />",
  },
];

const architecture = [
  ["React 19", "Concurrent-ready UI"],
  ["TanStack Table", "Headless table state"],
  ["TanStack Virtual", "Only visible rows mount"],
  ["TypeScript", "Typed from input to theme"],
];

const useCases = [
  [
    "Internal Tools",
    "Turn operational records into keyboard-friendly data-entry workflows.",
  ],
  [
    "Admin Panels",
    "Edit domain values directly instead of opening a form for every row.",
  ],
  [
    "Inventory & Operations",
    "Paste spreadsheet batches, validate typed columns, and undo mistakes.",
  ],
  [
    "Laboratory Data Entry",
    "Compose domain-specific editors around wide, virtualized datasets.",
  ],
  [
    "Custom CRUD Interfaces",
    "Keep business rules in React while users work in a grid.",
  ],
];

const faqs = [
  [
    "What is Gigatable?",
    "Gigatable is an open-source React data grid built on TanStack Table and TanStack Virtual. Its CLI copies the TypeScript implementation into your application.",
  ],
  [
    "Is Gigatable a spreadsheet?",
    "No. It is a data grid with spreadsheet interactions such as editing, range selection, clipboard paste, fill, and history. It is not a workbook engine and does not provide formulas or XLSX file handling.",
  ],
  [
    "How is it different from TanStack Table?",
    "TanStack Table supplies headless row, column, and state models. Gigatable keeps that model and adds a rendered, virtualized grid plus editing, selection, clipboard, fill, and history behavior.",
  ],
  [
    "Can users copy and paste data from Excel or Google Sheets?",
    "Yes. Gigatable reads and writes rectangular TSV clipboard data. Columns can parse incoming strings into numbers, dates, enums, or other application values.",
  ],
  [
    "How does source installation work?",
    "Run npx gigatable init. The CLI validates the project, copies the component source, and installs TanStack Table, TanStack Virtual, and clsx.",
  ],
  [
    "Is Gigatable free for commercial projects?",
    "Yes. Gigatable is released under the MIT license for personal and commercial use.",
  ],
  [
    "How does it handle large datasets?",
    "The default renderer virtualizes rows and columns so only the visible windows are mounted. Real performance still depends on your data operations and cell renderers.",
  ],
];

export function LandingPage({ navigate }: LandingPageProps) {
  const { resolvedTheme } = useSiteTheme();
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
          <SiteLink href="/docs/" navigate={navigate}>
            Docs
          </SiteLink>
          <SiteLink href="/demo/" navigate={navigate}>
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
              Open-source React data grid · MIT licensed
            </div>
            <h1>
              Excel-like React data grids.
              <br />
              <span>Your source. Your rules.</span>
            </h1>
            <p>
              Gigatable adds editable cells, range selection, Excel-compatible
              copy/paste, fill handles, resizing, virtualization and undo/redo
              to TanStack Table—with TypeScript source installed directly in
              your app.
            </p>
            <div className="landing-hero-actions">
              <SiteLink
                href="/docs/installation/"
                navigate={navigate}
                onClick={() => trackEvent("Installation CTA Clicked")}
              >
                Install Gigatable
                <span aria-hidden="true">→</span>
              </SiteLink>
              <SiteLink
                href="/demo/"
                navigate={navigate}
                onClick={() => trackEvent("Demo Opened")}
              >
                Try the Interactive Demo
              </SiteLink>
            </div>
            <div className="landing-proof">
              <span>React 19+</span>
              <span>TypeScript</span>
              <span>Tailwind CSS v4</span>
              <span>3 runtime dependencies</span>
              <span>MIT</span>
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
              <h2 id="showcase-title">
                An interactive React data grid, not a static mockup
              </h2>
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
                theme={resolvedTheme === "dark" ? themes.giga : themes.light}
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
              <h2 id="features-title">
                Spreadsheet interactions without a spreadsheet dependency
              </h2>
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

        <section className="landing-tanstack" aria-labelledby="tanstack-title">
          <div>
            <span>TanStack Control</span>
            <h2 id="tanstack-title">
              Build on TanStack Table without rebuilding Excel-like UX
            </h2>
          </div>
          <div>
            <p>
              Filtering, sorting, visibility, sizing, and controlled state stay
              in the TanStack model you already know. Gigatable adds the
              interaction and rendering layer around that model.
            </p>
            <p>
              Need different markup, editors, themes, or virtualization? The
              installed source and compound API are yours to adapt.
            </p>
            <SiteLink
              href="/guides/editable-tanstack-table/"
              navigate={navigate}
            >
              Read the TanStack Guide <span aria-hidden="true">→</span>
            </SiteLink>
          </div>
        </section>

        <section className="landing-source" aria-labelledby="source-title">
          <div className="landing-source-copy">
            <span>Own the Implementation</span>
            <h2 id="source-title">
              Source-installed means the grid belongs to your app
            </h2>
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
            <SiteLink href="/docs/composition/" navigate={navigate}>
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

        <section
          className="landing-use-cases"
          aria-labelledby="use-cases-title"
        >
          <div className="landing-section-heading">
            <div>
              <span>Product Workflows</span>
              <h2 id="use-cases-title">
                Made for data-heavy product workflows
              </h2>
            </div>
            <p>
              Gigatable is designed for applications where users need to enter,
              review, and move structured data quickly.
            </p>
          </div>
          <div className="landing-use-cases-grid">
            {useCases.map(([title, description]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="landing-resources"
          aria-labelledby="resources-title"
        >
          <div className="landing-section-heading">
            <div>
              <span>Go Deeper</span>
              <h2 id="resources-title">
                Choose and build the right React grid
              </h2>
            </div>
            <p>
              Follow a TanStack implementation guide or inspect Excel-compatible
              clipboard behavior in detail.
            </p>
          </div>
          <div className="landing-resource-grid">
            <SiteLink
              href="/guides/editable-tanstack-table/"
              navigate={navigate}
            >
              <span>Implementation Guide</span>
              <strong>Build an Editable Grid with TanStack Table</strong>
            </SiteLink>
            <SiteLink href="/features/excel-copy-paste/" navigate={navigate}>
              <span>Feature Guide</span>
              <strong>Excel-Compatible Copy and Paste</strong>
            </SiteLink>
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

        <section className="landing-faq" aria-labelledby="faq-title">
          <div className="landing-faq-heading">
            <span>Common Questions</span>
            <h2 id="faq-title">React data grid questions, answered</h2>
          </div>
          <div className="landing-faq-list">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="landing-final-cta">
          <div>
            <span>Ready to ship a better grid?</span>
            <h2>Install your React data grid as source</h2>
          </div>
          <div>
            <SiteLink
              href="/docs/installation/"
              navigate={navigate}
              onClick={() => trackEvent("Installation CTA Clicked")}
            >
              Install Gigatable
            </SiteLink>
            <SiteLink
              href="/demo/"
              navigate={navigate}
              onClick={() => trackEvent("Demo Opened")}
            >
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
            <p>
              Open-source React data grid interactions, installed as source.
            </p>
          </div>
          <div className="landing-credits">
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
            <span className="landing-maker">
              Made by{" "}
              <a href="https://aiken.si" target="_blank" rel="noreferrer">
                Aiken T. Ahac
              </a>
            </span>
          </div>
          <nav aria-label="Footer">
            <SiteLink href="/docs/" navigate={navigate}>
              Documentation
            </SiteLink>
            <SiteLink href="/demo/" navigate={navigate}>
              Demo
            </SiteLink>
            <a
              href="https://github.com/aikenahac/gigatable"
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("GitHub Opened")}
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
