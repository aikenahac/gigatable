import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { CodeBlock } from "../docs/code-block";
import { EditableCell, Gigatable, themes, useGigatable } from "../gigatable";
import type { EditableCellInputProps } from "../gigatable";
import { GitHubLink } from "../site/github-link";
import { trackEvent } from "../site/analytics";
import { SiteLink } from "../site/site-link";
import { SupportLink } from "../site/support-link";
import { ThemeSelector } from "../site/theme";
import type { ResourceSlug } from "../site/routes";

interface ResourcePageProps {
  navigate: (href: string) => void;
  slug: ResourceSlug;
}

interface ResourceLayoutProps extends ResourcePageProps {
  category: string;
  children: ReactNode;
  description: string;
  title: string;
}

const quickstartCode = `const grid = useGigatable({
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
    allowFillHandle
    paste={grid.paste}
    applyFill={grid.applyFill}
    undo={grid.undo}
    redo={grid.redo}
  />
);`;

function ResourceLayout({
  category,
  children,
  description,
  navigate,
  title,
}: ResourceLayoutProps) {
  return (
    <div className="resource-page">
      <a href="#resource-main" className="site-skip-link">
        Skip to Content
      </a>
      <header className="resource-header">
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

      <main id="resource-main">
        <nav className="resource-breadcrumbs" aria-label="Breadcrumb">
          <SiteLink href="/" navigate={navigate}>
            Gigatable
          </SiteLink>
          <span aria-hidden="true">/</span>
          <span>{title}</span>
        </nav>
        <header className="resource-hero">
          <span>{category}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <div>
            <SiteLink
              href="/docs/installation/"
              navigate={navigate}
              className="resource-primary-action"
              onClick={() => trackEvent("Installation CTA Clicked")}
            >
              Install Gigatable
            </SiteLink>
            <SiteLink
              href="/demo/"
              navigate={navigate}
              onClick={() => trackEvent("Demo Opened")}
            >
              Open the Demo
            </SiteLink>
          </div>
        </header>
        <article className="resource-content">{children}</article>
      </main>

      <footer className="resource-footer">
        <strong>Gigatable</strong>
        <span>
          Open-source React data grid interactions, installed as TypeScript
          source.
        </span>
        <SiteLink href="/docs/" navigate={navigate}>
          Documentation
        </SiteLink>
      </footer>
    </div>
  );
}

function EditableTanStackGuide(props: ResourcePageProps) {
  return (
    <ResourceLayout
      {...props}
      category="Implementation Guide"
      title="Build an Editable Data Grid with TanStack Table"
      description="Add spreadsheet-grade editing and navigation to the TanStack Table model without giving up control of your React components, data flow, or source code."
    >
      <section>
        <h2>TanStack Table gives you the model, not the grid UI</h2>
        <p>
          TanStack Table is intentionally headless. It models rows, columns,
          sorting, filtering, sizing, and controlled state, while your
          application supplies the markup and interactions. A basic editable
          cell is straightforward; a coherent data grid also needs selection,
          keyboard movement, clipboard behavior, fill, history, focus
          management, and virtualization.
        </p>
        <p>
          Gigatable keeps the TanStack table instance as the source of truth and
          adds that interaction layer as React components and hooks you own.
          TanStack Table is therefore Gigatable&apos;s foundation, not a
          competing rendered grid.
        </p>
      </section>

      <section>
        <h2>Start with typed columns and explicit editors</h2>
        <p>
          Read-only columns remain normal TanStack column definitions. Editable
          columns render <code>EditableCell</code> and opt in through typed
          column metadata. Your editor controls validation, formatting, and
          domain-specific inputs.
        </p>
        <CodeBlock
          language="tsx"
          code={`const columns: ColumnDef<Person>[] = [
  { accessorKey: "id", header: "ID" },
  {
    accessorKey: "name",
    header: "Name",
    cell: (cell) => (
      <EditableCell {...cell} renderInput={TextInput} />
    ),
    meta: { editable: true },
  },
];`}
        />
      </section>

      <section>
        <h2>Add the interaction layer explicitly</h2>
        <p>
          Feature flags make the intended behavior visible at the call site. The
          hook owns data mutations and history; the renderer coordinates cells,
          selection, keyboard navigation, paste, fill, and virtualized
          scrolling.
        </p>
        <CodeBlock language="tsx" code={quickstartCode} />
      </section>

      <section>
        <h2>Understand the mutation flow</h2>
        <ol>
          <li>
            An editor, paste, fill, or clear action produces typed values.
          </li>
          <li>
            <code>useGigatable</code> updates the row array and records one
            coherent history entry.
          </li>
          <li>
            TanStack Table receives the new data and rebuilds its row model.
          </li>
          <li>Gigatable re-renders only the visible row and column windows.</li>
        </ol>
      </section>

      <section>
        <h2>Accessibility and performance still belong to the product</h2>
        <p>
          Gigatable provides keyboard movement, focusable cells, semantic table
          markup, and virtualized navigation. Your custom editors must still
          expose labels, visible focus, validation feedback, and predictable
          commit or cancellation behavior. Keep column and data references
          stable, and avoid expensive work inside cell renderers.
        </p>
      </section>

      <section>
        <h2>When source installation is the right tradeoff</h2>
        <p>
          Choose Gigatable when you want Excel-like data entry on top of
          TanStack Table and expect to adapt the implementation to your domain.
          Choose a full spreadsheet engine when formulas, workbook files, or
          pivoting are core requirements. Choose TanStack Table alone when your
          product needs a display table rather than spreadsheet interactions.
        </p>
        <p>
          Continue with the{" "}
          <SiteLink href="/docs/quickstart/" navigate={props.navigate}>
            quickstart
          </SiteLink>{" "}
          or inspect the{" "}
          <SiteLink href="/docs/columns-editing/" navigate={props.navigate}>
            columns and editing guide
          </SiteLink>
          , or use the{" "}
          <SiteLink href="/compare/" navigate={props.navigate}>
            React data grid comparison guide
          </SiteLink>
          .
        </p>
      </section>
    </ResourceLayout>
  );
}

interface ClipboardRow extends Record<string, unknown> {
  item: string;
  quantity: number;
  status: string;
}

function ResourceTextInput({
  value,
  onChange,
  onBlur,
  onKeyDown,
}: EditableCellInputProps<unknown>) {
  return (
    <input
      aria-label="Cell value"
      autoFocus
      value={String(value ?? "")}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    />
  );
}

const clipboardRows: Array<ClipboardRow> = [
  { item: "North warehouse", quantity: 24, status: "Ready" },
  { item: "South warehouse", quantity: 18, status: "Review" },
  { item: "Field inventory", quantity: 31, status: "Ready" },
  { item: "Returns", quantity: 7, status: "Hold" },
];

const clipboardColumns: Array<ColumnDef<ClipboardRow>> = [
  {
    accessorKey: "item",
    header: "Item",
    size: 338,
    cell: (cell) => <EditableCell {...cell} renderInput={ResourceTextInput} />,
    meta: { editable: true },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    size: 210,
    cell: (cell) => <EditableCell {...cell} renderInput={ResourceTextInput} />,
    meta: {
      editable: true,
      parsePastedValue: (value) => Number(value),
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 281,
    cell: (cell) => <EditableCell {...cell} renderInput={ResourceTextInput} />,
    meta: { editable: true },
  },
];

function ClipboardDemo() {
  const grid = useGigatable({
    columns: clipboardColumns,
    data: clipboardRows,
    history: true,
  });

  return (
    <div className="resource-grid-demo">
      <Gigatable
        table={grid.table}
        theme={themes.giga}
        allowCellSelection
        allowRangeSelection
        allowPaste
        allowFillHandle
        allowHistory
        paste={grid.paste}
        applyFill={grid.applyFill}
        undo={grid.undo}
        redo={grid.redo}
      />
    </div>
  );
}

function ExcelCopyPasteFeature(props: ResourcePageProps) {
  return (
    <ResourceLayout
      {...props}
      category="Spreadsheet Interaction"
      title="React Data Grid with Excel Copy and Paste"
      description="Move rectangular data between your React application, Excel, and Google Sheets while preserving typed application values and undo history."
    >
      <section>
        <h2>Try Excel-compatible clipboard workflows</h2>
        <p>
          Select a cell or rectangular range, then use the standard copy and
          paste shortcuts. Try pasting tab-separated rows from a spreadsheet
          into the grid below.
        </p>
        <ClipboardDemo />
      </section>

      <section>
        <h2>External TSV and internal column identity</h2>
        <p>
          Excel and Google Sheets place rectangular clipboard data in
          tab-separated form. Gigatable parses rows and columns from that text.
          Internal copies can also retain column identity so values return to
          compatible columns when the visible layout changes.
        </p>
      </section>

      <section>
        <h2>Parse clipboard strings into domain values</h2>
        <p>
          Clipboard text starts as strings. Define <code>parsePastedValue</code>{" "}
          in column metadata to convert numbers, dates, enums, or domain
          identifiers before they reach application state.
        </p>
        <CodeBlock
          language="tsx"
          code={`{
  accessorKey: "quantity",
  cell: (cell) => <EditableCell {...cell} />,
  meta: {
    editable: true,
    parsePastedValue: (value) => Number(value),
  },
}`}
        />
      </section>

      <section>
        <h2>Repeat, bound, and inspect rectangular paste</h2>
        <p>
          A smaller clipboard rectangle can repeat across a larger selected
          range. Paste stops at available rows and columns, skips ineligible
          targets, and returns a change list containing old and new values for
          every committed cell.
        </p>
      </section>

      <section>
        <h2>Paste and fill are separate, undoable actions</h2>
        <p>
          Paste applies a clipboard rectangle. Fill repeats the selected source
          vertically or horizontally through the drag handle. Both become
          coherent history entries, so one undo restores the previous values.
        </p>
      </section>

      <section>
        <h2>Clipboard interoperability is not XLSX import</h2>
        <p>
          Gigatable exchanges cell values through the clipboard. It does not
          parse workbook files, formulas, formatting, charts, or multiple
          sheets. Pair it with a dedicated file parser when your product needs
          XLSX import or export.
        </p>
        <p>
          See the full{" "}
          <SiteLink href="/docs/clipboard-paste/" navigate={props.navigate}>
            clipboard and paste guide
          </SiteLink>{" "}
          or continue to{" "}
          <SiteLink href="/docs/fill-handle/" navigate={props.navigate}>
            fill-handle behavior
          </SiteLink>
          .
        </p>
      </section>
    </ResourceLayout>
  );
}

export function ResourcePage(props: ResourcePageProps) {
  if (props.slug === "editable-tanstack-table") {
    return <EditableTanStackGuide {...props} />;
  }

  return <ExcelCopyPasteFeature {...props} />;
}
