export const docsManifest = [
  {
    section: "start",
    sectionTitle: "Start",
    slug: "overview",
    title: "Overview",
    description:
      "Learn what Gigatable provides and choose the right path through the docs.",
    seoTitle: "React Data Grid Documentation | Gigatable",
    seoDescription:
      "Learn to install and customize Gigatable: editable cells, range selection, Excel-compatible copy/paste, fill handles, virtualization and undo/redo for React.",
    sourceFile: "overview.md",
    keywords: ["introduction", "features", "react", "spreadsheet", "grid"],
    audience: "consumer",
  },
  {
    section: "start",
    sectionTitle: "Start",
    slug: "installation",
    title: "Installation",
    description: "Install Gigatable with npm, pnpm, yarn, or bun.",
    seoTitle: "Install the Gigatable React Data Grid | Gigatable",
    seoDescription:
      "Install Gigatable into a React 19, TypeScript and Tailwind CSS v4 project with npm, pnpm, yarn or bun, then verify the copied source.",
    sourceFile: "installation.md",
    keywords: ["install", "cli", "requirements", "tailwind", "typescript"],
    audience: "consumer",
  },
  {
    section: "start",
    sectionTitle: "Start",
    slug: "agent-skill",
    title: "Agent Skill",
    description:
      "Install Gigatable development guidance in Codex, Claude Code, Cursor, and other compatible agents.",
    seoTitle: "Install the Gigatable Agent Skill | Gigatable",
    seoDescription:
      "Install the Gigatable agent skill with npx, shell, PowerShell, or a manual ZIP for project-local or global use.",
    sourceFile: "agent-skill.md",
    keywords: [
      "agent skill",
      "skills cli",
      "codex",
      "claude code",
      "cursor",
      "install",
    ],
    audience: "consumer",
  },
  {
    section: "start",
    sectionTitle: "Start",
    slug: "quickstart",
    title: "Quickstart",
    description: "Render an editable, selectable table in a few minutes.",
    seoTitle: "React Data Grid Quickstart | Gigatable",
    seoDescription:
      "Build your first editable React data grid with typed columns, cell selection, clipboard paste, fill handles and undo/redo.",
    sourceFile: "quickstart.md",
    keywords: ["setup", "example", "first table", "column definitions"],
    audience: "consumer",
  },
  {
    section: "guides",
    sectionTitle: "Guides",
    slug: "columns-editing",
    title: "Columns & Editing",
    description: "Define typed columns, editable cells, and commit behavior.",
    seoTitle: "Editable React Data Grid Cells and Columns | Gigatable",
    seoDescription:
      "Define typed TanStack columns, custom cell editors, editable metadata, commit behavior and controlled data updates with Gigatable.",
    sourceFile: "columns-editing.md",
    keywords: ["columns", "editable", "input", "cell", "allColumnsEditable"],
    audience: "consumer",
  },
  {
    section: "guides",
    sectionTitle: "Guides",
    slug: "selection-navigation",
    title: "Selection & Navigation",
    description: "Configure cell, range, and single-column selection.",
    seoTitle: "Cell Selection and Keyboard Navigation | Gigatable",
    seoDescription:
      "Configure single-cell, rectangular and single-column selection with mouse, Shift, arrow-key and virtualized keyboard navigation.",
    sourceFile: "selection-navigation.md",
    keywords: ["selection", "range", "keyboard", "arrow", "tab"],
    audience: "consumer",
  },
  {
    section: "guides",
    sectionTitle: "Guides",
    slug: "clipboard-paste",
    title: "Clipboard & Paste",
    description: "Copy TSV ranges, parse values, and inspect paste changes.",
    seoTitle: "Excel-Compatible Copy and Paste | Gigatable",
    seoDescription:
      "Copy and paste rectangular TSV ranges between Gigatable, Excel and Google Sheets with typed parsing, repetition and change callbacks.",
    sourceFile: "clipboard-paste.md",
    keywords: ["clipboard", "copy", "paste", "tsv", "parsePastedValue"],
    audience: "consumer",
  },
  {
    section: "guides",
    sectionTitle: "Guides",
    slug: "fill-handle",
    title: "Fill Handle",
    description: "Repeat values vertically, horizontally, or in both axes.",
    seoTitle: "React Data Grid Fill Handle | Gigatable",
    seoDescription:
      "Add vertical or horizontal fill handles to a React data grid, control eligible columns and customize fill previews.",
    sourceFile: "fill-handle.md",
    keywords: ["fill", "drag", "horizontal", "vertical", "preview"],
    audience: "consumer",
  },
  {
    section: "guides",
    sectionTitle: "Guides",
    slug: "history-clearing",
    title: "History & Clearing",
    description: "Enable undo/redo and customize Delete or Backspace values.",
    seoTitle: "Undo, Redo and Cell Clearing | Gigatable",
    seoDescription:
      "Track edits, paste, fill and range clearing as undoable history entries and customize cleared values by column.",
    sourceFile: "history-clearing.md",
    keywords: ["history", "undo", "redo", "clear", "delete", "backspace"],
    audience: "consumer",
  },
  {
    section: "guides",
    sectionTitle: "Guides",
    slug: "column-resizing",
    title: "Column Resizing",
    description: "Enable resizing and persist TanStack column sizing state.",
    seoTitle: "Resizable React Data Grid Columns | Gigatable",
    seoDescription:
      "Enable draggable TanStack column resizing, reset widths and persist controlled column-sizing state with Gigatable.",
    sourceFile: "column-resizing.md",
    keywords: ["resize", "width", "columnSizing", "persist"],
    audience: "consumer",
  },
  {
    section: "guides",
    sectionTitle: "Guides",
    slug: "virtualization-performance",
    title: "Virtualization & Performance",
    description: "Understand row virtualization and keep large grids fast.",
    seoTitle: "Virtualized React Data Grid Performance | Gigatable",
    seoDescription:
      "Understand Gigatable row and column virtualization, stable inputs, row sizing and custom virtualizers for large React data grids.",
    sourceFile: "virtualization-performance.md",
    keywords: ["virtualization", "performance", "large data", "overscan"],
    audience: "consumer",
  },
  {
    section: "customization",
    sectionTitle: "Customization",
    slug: "theming",
    title: "Theming",
    description: "Use presets, typed overrides, and CSS custom properties.",
    seoTitle: "Theme and Style a React Data Grid | Gigatable",
    seoDescription:
      "Style Gigatable with typed theme presets, partial overrides and CSS custom properties for light, dark and custom interfaces.",
    sourceFile: "theming.md",
    keywords: ["theme", "light", "dark", "minimal", "giga", "css variables"],
    audience: "consumer",
  },
  {
    section: "customization",
    sectionTitle: "Customization",
    slug: "column-metadata",
    title: "Column Metadata",
    description:
      "Customize parsing, clearing, fill previews, and cell classes.",
    seoTitle: "Gigatable Column Metadata | React Grid Docs",
    seoDescription:
      "Configure editable columns, pasted-value parsing, cleared values, fill eligibility, previews and cell classes through TanStack metadata.",
    sourceFile: "column-metadata.md",
    keywords: ["metadata", "parse", "clear", "className", "allowFill"],
    audience: "consumer",
  },
  {
    section: "customization",
    sectionTitle: "Customization",
    slug: "custom-inputs",
    title: "Custom Inputs",
    description: "Build text, numeric, select, and domain-specific editors.",
    seoTitle: "Custom React Data Grid Cell Editors | Gigatable",
    seoDescription:
      "Build text, numeric, select and domain-specific editors with typed values, cancellation, focus and keyboard commit behavior.",
    sourceFile: "custom-inputs.md",
    keywords: ["input", "editor", "select", "number", "onValueChange"],
    audience: "consumer",
  },
  {
    section: "customization",
    sectionTitle: "Customization",
    slug: "optional-cells",
    title: "Optional Cells",
    description:
      "Install and adapt selectors, dates, numbers, overlays, badges, and progress cells.",
    seoTitle: "Optional React Data Grid Cell Components | Gigatable",
    seoDescription:
      "Install and customize Gigatable's dependency-free SelectCell, DateCell, NumberCell, BadgeCell, ProgressCell, PopoverCell and DialogCell source.",
    sourceFile: "optional-cells.md",
    keywords: [
      "cells",
      "select",
      "datepicker",
      "number",
      "badge",
      "progress",
      "popover",
      "dialog",
    ],
    audience: "consumer",
  },
  {
    section: "customization",
    sectionTitle: "Customization",
    slug: "composition",
    title: "Compound Composition",
    description: "Replace table layers while retaining Gigatable behavior.",
    seoTitle: "Compose a Custom React Data Grid | Gigatable",
    seoDescription:
      "Replace Gigatable table, header, body, footer or cell rendering while retaining selection, editing and virtualization behavior.",
    sourceFile: "composition.md",
    keywords: ["compound", "custom body", "footer", "cell", "children"],
    audience: "consumer",
  },
  {
    section: "customization",
    sectionTitle: "Customization",
    slug: "context-quick-edit",
    title: "Context & Quick Edit",
    description: "Integrate custom renderers, scrollers, and text selection.",
    seoTitle: "Gigatable Context and Quick Edit | React Grid Docs",
    seoDescription:
      "Use Gigatable context, cell state, custom row scrollers and quick-edit text selection in composed React data grids.",
    sourceFile: "context-quick-edit.md",
    keywords: ["context", "useGigatableContext", "useQuickEdit", "scroller"],
    audience: "consumer",
  },
  {
    section: "reference",
    sectionTitle: "Reference",
    slug: "gigatable-api",
    title: "Gigatable",
    description: "Reference every Gigatable component prop and default.",
    seoTitle: "Gigatable Component API | React Data Grid Docs",
    seoDescription:
      "Reference every Gigatable component prop, feature flag, handler, presentation option and compound export.",
    sourceFile: "gigatable-api.md",
    keywords: ["props", "component", "api", "containerRef", "tableStyle"],
    audience: "consumer",
  },
  {
    section: "reference",
    sectionTitle: "Reference",
    slug: "use-gigatable-api",
    title: "useGigatable",
    description:
      "Reference hook options, return values, and mutation handlers.",
    seoTitle: "useGigatable Hook API | React Data Grid Docs",
    seoDescription:
      "Reference useGigatable options, return values, TanStack passthrough options and data mutation semantics.",
    sourceFile: "use-gigatable-api.md",
    keywords: ["hook", "api", "options", "return", "handlers"],
    audience: "consumer",
  },
  {
    section: "reference",
    sectionTitle: "Reference",
    slug: "editable-cell-api",
    title: "EditableCell",
    description: "Reference the editable wrapper and custom input contract.",
    seoTitle: "EditableCell API | Gigatable React Grid Docs",
    seoDescription:
      "Reference the EditableCell wrapper, custom input bindings, keyboard behavior and editable-column metadata contract.",
    sourceFile: "editable-cell-api.md",
    keywords: ["editablecell", "renderInput", "input props", "api"],
    audience: "consumer",
  },
  {
    section: "reference",
    sectionTitle: "Reference",
    slug: "hooks-context-api",
    title: "Hooks & Context",
    description: "Reference composition context, cell state, and quick edit.",
    seoTitle: "Gigatable Hooks and Context API | React Grid Docs",
    seoDescription:
      "Reference Gigatable context, cell state, quick-edit hooks, feature descriptions and custom row-scroller integration.",
    sourceFile: "hooks-context-api.md",
    keywords: ["context", "quick edit", "cell state", "feature guide"],
    audience: "consumer",
  },
  {
    section: "reference",
    sectionTitle: "Reference",
    slug: "types",
    title: "Exported Types",
    description: "Use Gigatable’s exported TypeScript types.",
    seoTitle: "Gigatable TypeScript Types | React Data Grid Docs",
    seoDescription:
      "Reference Gigatable props, hook options, paste results, cell changes, editor input types, themes and TanStack metadata.",
    sourceFile: "types.md",
    keywords: ["types", "typescript", "paste result", "selection"],
    audience: "consumer",
  },
  {
    section: "reference",
    sectionTitle: "Reference",
    slug: "keyboard-shortcuts",
    title: "Keyboard Shortcuts",
    description: "Reference every mouse and keyboard interaction.",
    seoTitle: "React Data Grid Keyboard Shortcuts | Gigatable",
    seoDescription:
      "Reference Gigatable keyboard and pointer interactions for selection, editing, copy/paste, fill, clearing, history and resizing.",
    sourceFile: "keyboard-shortcuts.md",
    keywords: ["keyboard", "shortcut", "mouse", "command", "control"],
    audience: "consumer",
  },
  {
    section: "contributing",
    sectionTitle: "Contributing",
    slug: "contributor-overview",
    title: "Internals Overview",
    description:
      "Understand source ownership and package boundaries. Architecture and contribution guidance for Gigatable’s React data grid source.",
    seoTitle: "Internals Overview | Gigatable Contributor Docs",
    seoDescription:
      "Understand source ownership and package boundaries. Architecture and contribution guidance for Gigatable’s React data grid source.",
    sourceFile: "contributor-overview.md",
    keywords: ["internals", "source", "architecture"],
    audience: "contributor",
  },
  {
    section: "contributing",
    sectionTitle: "Contributing",
    slug: "contributor-file-map",
    title: "File Map",
    description:
      "Find the module responsible for each behavior. Architecture and contribution guidance for Gigatable’s React data grid source.",
    seoTitle: "File Map | Gigatable Contributor Docs",
    seoDescription:
      "Find the module responsible for each behavior. Architecture and contribution guidance for Gigatable’s React data grid source.",
    sourceFile: "contributor-file-map.md",
    keywords: ["files", "modules", "ownership"],
    audience: "contributor",
  },
  {
    section: "contributing",
    sectionTitle: "Contributing",
    slug: "contributor-architecture",
    title: "Architecture",
    description:
      "Follow state, rendering, and virtualization data flow. Architecture and contribution guidance for Gigatable’s React data grid source.",
    seoTitle: "Architecture | Gigatable Contributor Docs",
    seoDescription:
      "Follow state, rendering, and virtualization data flow. Architecture and contribution guidance for Gigatable’s React data grid source.",
    sourceFile: "contributor-architecture.md",
    keywords: ["architecture", "data flow", "virtualizer"],
    audience: "contributor",
  },
  {
    section: "contributing",
    sectionTitle: "Contributing",
    slug: "contributor-interactions",
    title: "Interaction Internals",
    description:
      "Trace selection, editing, clipboard, fill, and history. Architecture and contribution guidance for Gigatable’s React data grid source.",
    seoTitle: "Interaction Internals | Gigatable Contributor Docs",
    seoDescription:
      "Trace selection, editing, clipboard, fill, and history. Architecture and contribution guidance for Gigatable’s React data grid source.",
    sourceFile: "contributor-interactions.md",
    keywords: ["interactions", "selection", "editing", "history"],
    audience: "contributor",
  },
  {
    section: "contributing",
    sectionTitle: "Contributing",
    slug: "contributor-theming-distribution",
    title: "Theming & Distribution",
    description:
      "Understand theme tokens, CLI sync, and release flow. Architecture and contribution guidance for Gigatable’s React data grid source.",
    seoTitle: "Theming & Distribution | Gigatable Contributor Docs",
    seoDescription:
      "Understand theme tokens, CLI sync, and release flow. Architecture and contribution guidance for Gigatable’s React data grid source.",
    sourceFile: "contributor-theming-distribution.md",
    keywords: ["distribution", "cli", "publish", "theme"],
    audience: "contributor",
  },
] as const;

export type DocsManifestEntry = (typeof docsManifest)[number];
export type DocsSlug = DocsManifestEntry["slug"];
export type DocsSectionId = DocsManifestEntry["section"];

export const defaultDocsSlug: DocsSlug = "overview";

export function isDocsSlug(value: string): value is DocsSlug {
  return docsManifest.some((entry) => entry.slug === value);
}
