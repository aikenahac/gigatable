export const comparisonSlugs = [
  "ag-grid",
  "mui-x-data-grid",
  "handsontable",
] as const;

export type ComparisonSlug = (typeof comparisonSlugs)[number];

export interface ComparisonSource {
  label: string;
  url: string;
}

export interface ComparisonRow {
  dimension: string;
  gigatable: string;
  alternative: string;
}

export interface ComparisonDefinition {
  slug: ComparisonSlug;
  alternative: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  summary: string;
  verifiedOn: string;
  rows: Array<ComparisonRow>;
  chooseGigatable: Array<string>;
  chooseAlternative: Array<string>;
  sources: Array<ComparisonSource>;
}

export const comparisons: Array<ComparisonDefinition> = [
  {
    slug: "ag-grid",
    alternative: "AG Grid",
    title: "Gigatable vs AG Grid",
    seoTitle: "Gigatable vs AG Grid for React Data Grids",
    seoDescription:
      "Compare Gigatable and AG Grid for React: source ownership, licensing tiers, TanStack integration, spreadsheet interactions and enterprise grid features.",
    summary:
      "Choose Gigatable for a compact, source-installed interaction layer on TanStack Table. Choose AG Grid when a broad packaged grid platform, enterprise modules, or vendor support matters more than owning the implementation.",
    verifiedOn: "2026-07-31",
    rows: [
      {
        dimension: "Delivery model",
        gigatable:
          "The CLI copies TypeScript source into the application for local review and modification.",
        alternative:
          "Installed as AG Grid runtime packages with Community and Enterprise editions.",
      },
      {
        dimension: "Licensing",
        gigatable:
          "MIT licensed for personal and commercial use, including the installed source.",
        alternative:
          "AG Grid Community is free; AG Grid Enterprise uses a commercial license.",
      },
      {
        dimension: "Table model",
        gigatable:
          "Keeps TanStack Table as the row, column, sizing, filtering and controlled-state model.",
        alternative:
          "Uses AG Grid's own integrated grid model, components and APIs.",
      },
      {
        dimension: "Spreadsheet interactions",
        gigatable:
          "Selection, TSV clipboard, fill, clearing and history are included in the MIT source.",
        alternative:
          "Cell selection, clipboard and fill-handle documentation is marked as Enterprise functionality.",
      },
      {
        dimension: "Advanced grid breadth",
        gigatable:
          "Focused on editable product workflows; no built-in grouping, pivoting, formulas or workbook export.",
        alternative:
          "Offers a much broader feature set including enterprise grouping, pivoting, server-side data and Excel export.",
      },
      {
        dimension: "Customization tradeoff",
        gigatable:
          "Change the local React and TypeScript implementation directly.",
        alternative:
          "Configure and extend a mature packaged component through its supported APIs.",
      },
    ],
    chooseGigatable: [
      "Your application already uses TanStack Table or needs its controlled state model.",
      "You want spreadsheet-style data entry without adopting a large grid platform.",
      "Owning and adapting the implementation is more important than vendor support.",
      "MIT-licensed selection, clipboard, fill and history cover the required workflow.",
    ],
    chooseAlternative: [
      "You need grouping, pivoting, tree data, server-side row models or Excel export.",
      "A packaged enterprise platform and commercial support are desired.",
      "You prefer configuration APIs over maintaining application-owned source.",
    ],
    sources: [
      {
        label: "AG Grid licensing and feature tiers",
        url: "https://www.ag-grid.com/license-pricing/",
      },
      {
        label: "AG Grid cell selection",
        url: "https://www.ag-grid.com/react-data-grid/cell-selection/",
      },
      {
        label: "AG Grid clipboard",
        url: "https://www.ag-grid.com/react-data-grid/clipboard/",
      },
      {
        label: "AG Grid fill handle",
        url: "https://www.ag-grid.com/react-data-grid/cell-selection-fill-handle/",
      },
      {
        label: "AG Grid undo and redo",
        url: "https://www.ag-grid.com/react-data-grid/undo-redo-edits/",
      },
    ],
  },
  {
    slug: "mui-x-data-grid",
    alternative: "MUI X Data Grid",
    title: "Gigatable vs MUI X Data Grid",
    seoTitle: "Gigatable vs MUI X Data Grid for React",
    seoDescription:
      "Compare Gigatable and MUI X Data Grid for React: source ownership, licensing tiers, TanStack control, Material UI integration and spreadsheet features.",
    summary:
      "Choose Gigatable for source ownership, TanStack control and spreadsheet interactions under MIT. Choose MUI X when deep Material UI integration and its Community, Pro or Premium feature tiers fit the product.",
    verifiedOn: "2026-07-31",
    rows: [
      {
        dimension: "Delivery model",
        gigatable:
          "Source-installed React and TypeScript that becomes part of the application.",
        alternative:
          "Versioned MUI X packages consumed as runtime dependencies.",
      },
      {
        dimension: "Licensing",
        gigatable: "The complete current grid source is MIT licensed.",
        alternative:
          "The Community Data Grid is MIT; Pro and Premium packages use commercial licenses.",
      },
      {
        dimension: "Design-system fit",
        gigatable:
          "Theme presets, CSS variables and compound rendering are design-system neutral.",
        alternative:
          "Designed to integrate with the Material UI component and styling ecosystem.",
      },
      {
        dimension: "Table model",
        gigatable:
          "Builds its rendered interactions around a TanStack Table instance.",
        alternative: "Uses the MUI X Data Grid state, component and API model.",
      },
      {
        dimension: "Spreadsheet interactions",
        gigatable:
          "Cell selection, clipboard paste, directional fill and undo history ship in the MIT source.",
        alternative:
          "MUI's feature matrix places cell selection and clipboard paste in Data Grid Premium.",
      },
      {
        dimension: "Advanced grid breadth",
        gigatable:
          "Intentionally omits grouping, pivoting, Excel export and an AI assistant.",
        alternative:
          "Pro and Premium add capabilities such as tree data, grouping, pivoting, Excel export and AI-assisted grid state.",
      },
    ],
    chooseGigatable: [
      "You need TanStack-controlled state rather than an integrated grid state model.",
      "You want to own and modify the implementation inside the repository.",
      "MIT spreadsheet interactions are needed without a premium grid tier.",
      "The application is not tied to Material UI.",
    ],
    chooseAlternative: [
      "The application already standardizes on Material UI and MUI X.",
      "You need Pro or Premium features such as tree data, grouping, pivoting or Excel export.",
      "A packaged component with an established commercial upgrade path is preferred.",
    ],
    sources: [
      {
        label: "MUI X licensing",
        url: "https://mui.com/x/introduction/licensing/",
      },
      {
        label: "MUI X Data Grid feature tiers",
        url: "https://mui.com/x/react-data-grid/features/",
      },
      {
        label: "MUI X clipboard and fill handle",
        url: "https://mui.com/x/react-data-grid/clipboard/",
      },
      {
        label: "MUI X virtualization",
        url: "https://mui.com/x/react-data-grid/virtualization/",
      },
    ],
  },
  {
    slug: "handsontable",
    alternative: "Handsontable",
    title: "Gigatable vs Handsontable",
    seoTitle: "Gigatable vs Handsontable for React Data Entry",
    seoDescription:
      "Compare Gigatable and Handsontable for React: source ownership, production licensing, TanStack integration, clipboard workflows and formula support.",
    summary:
      "Choose Gigatable for an MIT, source-owned TanStack data-entry grid. Choose Handsontable when spreadsheet-first behavior, formula calculation and a commercial production license fit the product.",
    verifiedOn: "2026-07-31",
    rows: [
      {
        dimension: "Delivery model",
        gigatable:
          "The CLI installs editable TypeScript source into the application.",
        alternative:
          "Installed as Handsontable and React wrapper packages with a license key.",
      },
      {
        dimension: "Licensing",
        gigatable: "MIT licensed for commercial production use.",
        alternative:
          "Current releases use proprietary non-commercial or commercial licenses; the last MIT release was 6.2.2.",
      },
      {
        dimension: "Product model",
        gigatable:
          "A data grid with selected spreadsheet interactions, backed by TanStack Table.",
        alternative:
          "A spreadsheet-oriented grid with its own data, plugin and rendering model.",
      },
      {
        dimension: "Clipboard and editing",
        gigatable:
          "Typed TSV paste, custom React editors, directional fill and coherent history.",
        alternative:
          "Built-in clipboard, editing and plugin hooks for spreadsheet-style workflows.",
      },
      {
        dimension: "Formula support",
        gigatable:
          "No formula engine, workbook model or cross-sheet references.",
        alternative:
          "Integrates HyperFormula for hundreds of functions and cross-sheet calculation.",
      },
      {
        dimension: "Customization tradeoff",
        gigatable:
          "Change local source and compose custom render layers around TanStack.",
        alternative:
          "Configure a broad spreadsheet component through options, plugins and hooks.",
      },
    ],
    chooseGigatable: [
      "The product is a React CRUD or operational data-entry interface, not a workbook.",
      "TanStack Table state and source ownership are architectural requirements.",
      "MIT commercial use is required for the complete interaction layer.",
      "Domain-specific React editors matter more than formula calculation.",
    ],
    chooseAlternative: [
      "Users need formulas, cross-sheet calculations or a spreadsheet-first model.",
      "A commercial production license is acceptable.",
      "A broad plugin-based spreadsheet component is preferable to application-owned source.",
    ],
    sources: [
      {
        label: "Handsontable software license",
        url: "https://handsontable.com/docs/react-data-grid/software-license/",
      },
      {
        label: "Handsontable clipboard",
        url: "https://handsontable.com/docs/react-data-grid/basic-clipboard/",
      },
      {
        label: "Handsontable formula calculation",
        url: "https://handsontable.com/docs/react-data-grid/formula-calculation/",
      },
    ],
  },
];

export function getComparison(slug: ComparisonSlug): ComparisonDefinition {
  return comparisons.find(
    (comparison) => comparison.slug === slug,
  ) as ComparisonDefinition;
}
