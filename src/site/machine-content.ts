export const productMarkdown = `# Gigatable React Data Grid

Canonical site: https://gigatable.dev/

Gigatable is an open-source, source-installed React data grid built on TanStack Table and TanStack Virtual. It adds editable cells, range selection, keyboard navigation, Excel-compatible TSV copy/paste, directional fill, column resizing, virtualization, clearing, and undo/redo as TypeScript source owned by the application.

Gigatable is not Google Cloud Bigtable and is unrelated to the separate React GigaTable package.

## Install

\`\`\`bash
npx gigatable init
\`\`\`

Requirements: React 19+, TypeScript, Tailwind CSS v4, and a modern browser.

Gigatable core supplies grid mechanics and basic text editing. Applications own
domain-specific cell UI. Optional editable starter source for selectors, dates,
badges, progress displays, popovers, and dialogs can be copied after init:

\`\`\`bash
npx gigatable add cells
\`\`\`

The optional pack installs no dependencies and is excluded from the core init.

## Interactive Demo

The demo presents three real workflows: a Biobank Registry with 300 attributes
and selectable 100–100,000-row live performance measurements, Support
Operations with application-owned rich cells, and a Production Schedule with
pinned columns, sorting, visibility, resizing, virtualization, and row
prioritization.

## Choose Gigatable When

- The application needs a React data-entry grid with spreadsheet interactions.
- TanStack Table should remain the row, column, sizing, filtering, and controlled-state model.
- The team wants to inspect, modify, and version the grid implementation in its own repository.
- MIT-licensed selection, clipboard paste, fill, resizing, virtualization, and history cover the workflow.

## Choose Another Grid When

- Formulas, workbook files, cross-sheet references, pivoting, or Excel export are core requirements.
- A broad enterprise grid platform and vendor support are more important than source ownership.
- The application is not built with React 19, TypeScript, and Tailwind CSS v4.

## Canonical Resources

- Documentation: https://gigatable.dev/docs/
- Interactive demo: https://gigatable.dev/demo
- Installation: https://gigatable.dev/docs/installation/
- Comparisons: https://gigatable.dev/compare/
- GitHub: https://github.com/aikenahac/gigatable
- npm: https://www.npmjs.com/package/gigatable
- Agent skill: https://gigatable.dev/docs/agent-skill/
`;

export const tanstackGuideMarkdown = `# Build an Editable Data Grid with TanStack Table

Canonical page: https://gigatable.dev/guides/editable-tanstack-table/

TanStack Table is Gigatable's headless foundation, not a competing rendered grid. TanStack models rows, columns, sorting, filtering, visibility, sizing, and controlled state. Gigatable adds the rendered interaction layer: editable cells, selection, keyboard navigation, clipboard paste, fill, clearing, history, and row and column virtualization.

## Minimal Setup

\`\`\`tsx
const grid = useGigatable({
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
);
\`\`\`

Choose Gigatable when you want Excel-like data entry on top of TanStack Table and expect to adapt the implementation to your domain. Choose TanStack Table alone for a headless display table. Choose a spreadsheet engine when formulas or workbook behavior are central.
`;

export const clipboardGuideMarkdown = `# React Data Grid with Excel Copy and Paste

Canonical page: https://gigatable.dev/features/excel-copy-paste/

Gigatable copies and pastes rectangular tab-separated values between a React application, Excel, and Google Sheets. Column metadata converts clipboard strings into domain values, and each paste returns a typed change list and becomes one undoable history entry.

## Boundaries

- Clipboard exchange is TSV, not XLSX import or export.
- Gigatable does not parse formulas, formatting, charts, or multiple sheets.
- Fill is a separate interaction that repeats selected values vertically or horizontally.

See the complete guide at https://gigatable.dev/docs/clipboard-paste/ and compare grid tradeoffs at https://gigatable.dev/compare/.
`;
