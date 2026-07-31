export const comparisonSlugs = [
  "ag-grid",
  "mui-x-data-grid",
  "handsontable",
] as const;

export type ComparisonSlug = (typeof comparisonSlugs)[number];

export type ComparisonAccess = "free" | "paid" | "mixed" | "not-included";

export interface ComparisonSource {
  label: string;
  url: string;
}

export interface ComparisonCell {
  access: ComparisonAccess;
  label: string;
  detail: string;
}

export interface ComparisonRow {
  dimension: string;
  gigatable: ComparisonCell;
  alternative: ComparisonCell;
}

export interface ComparisonPricing {
  gigatable: string;
  alternativeHeadline: string;
  alternative: string;
  note: string;
}

export interface ComparisonDefinition {
  slug: ComparisonSlug;
  alternative: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  summary: string;
  verifiedOn: string;
  pricing: ComparisonPricing;
  rows: Array<ComparisonRow>;
  chooseGigatable: Array<string>;
  chooseAlternative: Array<string>;
  sources: Array<ComparisonSource>;
}

const freeGigatable = (detail: string): ComparisonCell => ({
  access: "free",
  label: "Free · MIT",
  detail,
});

const unavailableInGigatable = (detail: string): ComparisonCell => ({
  access: "not-included",
  label: "Not included",
  detail,
});

export const comparisons: Array<ComparisonDefinition> = [
  {
    slug: "ag-grid",
    alternative: "AG Grid",
    title: "Gigatable vs AG Grid",
    seoTitle: "Gigatable vs AG Grid for React Data Grids",
    seoDescription:
      "Compare Gigatable and AG Grid pricing and feature tiers for React: free spreadsheet interactions, source ownership, TanStack integration and enterprise capabilities.",
    summary:
      "Gigatable includes its current editing, range selection, clipboard, fill, virtualization and history features under MIT. AG Grid Community is free for core grid work, while cell range selection, clipboard operations and fill require AG Grid Enterprise.",
    verifiedOn: "2026-07-31",
    pricing: {
      gigatable:
        "$0. All current Gigatable features are MIT licensed, including selection, clipboard paste, fill and undo/redo. There is no per-developer fee.",
      alternativeHeadline: "$999+ per developer",
      alternative:
        "AG Grid Community is free. AG Grid Enterprise starts at $999 USD per developer for a perpetual license with one year of updates. The Enterprise Bundle starts at $1,498 per developer.",
      note: "Prices are published starting prices before tax, volume discounts or deployment-specific licensing.",
    },
    rows: [
      {
        dimension: "Commercial production",
        gigatable: freeGigatable(
          "The complete source-installed grid can be used and modified in commercial applications.",
        ),
        alternative: {
          access: "mixed",
          label: "Free core · Paid advanced",
          detail:
            "AG Grid Community is free for production. Enterprise features require a production license starting at $999 per developer.",
        },
      },
      {
        dimension: "Cell editing",
        gigatable: freeGigatable(
          "Editable cells, typed parsing and custom React editors are included.",
        ),
        alternative: {
          access: "free",
          label: "Free · Community",
          detail:
            "Basic text, number, date, checkbox, large-text and select editors are available in Community.",
        },
      },
      {
        dimension: "Cell and range selection",
        gigatable: freeGigatable(
          "Single-cell and rectangular range selection with mouse and keyboard navigation are included.",
        ),
        alternative: {
          access: "paid",
          label: "Paid · Enterprise $999+",
          detail:
            "AG Grid documents Excel-like cell range selection as an Enterprise feature.",
        },
      },
      {
        dimension: "Excel-style copy and paste",
        gigatable: freeGigatable(
          "TSV copy/paste, typed value parsing and repeated paste across a selection are included.",
        ),
        alternative: {
          access: "paid",
          label: "Paid · Enterprise $999+",
          detail:
            "AG Grid clipboard operations, including paste into editable cells, are Enterprise features.",
        },
      },
      {
        dimension: "Fill handle",
        gigatable: freeGigatable(
          "Directional drag-fill and fill preview hooks are included.",
        ),
        alternative: {
          access: "paid",
          label: "Paid · Enterprise $999+",
          detail:
            "AG Grid documents the spreadsheet-style fill handle as an Enterprise feature.",
        },
      },
      {
        dimension: "Undo and redo",
        gigatable: freeGigatable(
          "Editing, paste, fill and clearing share one configurable history stack.",
        ),
        alternative: {
          access: "mixed",
          label: "Free edits · Paid clipboard/fill",
          detail:
            "AG Grid provides edit history in Community, but undoing Enterprise-only paste and fill workflows still requires those paid features.",
        },
      },
      {
        dimension: "Virtualization",
        gigatable: freeGigatable(
          "TanStack Virtual powers row and column virtualization.",
        ),
        alternative: {
          access: "free",
          label: "Free · Community",
          detail:
            "AG Grid Community includes row and column virtualization and performance optimizations.",
        },
      },
      {
        dimension: "Grouping, pivoting and Excel export",
        gigatable: unavailableInGigatable(
          "Gigatable intentionally focuses on editable product workflows and does not include these platform features.",
        ),
        alternative: {
          access: "paid",
          label: "Paid · Enterprise $999+",
          detail:
            "Row grouping, pivoting, server-side row models and Excel export are part of AG Grid Enterprise.",
        },
      },
    ],
    chooseGigatable: [
      "Your application needs the listed spreadsheet interactions without per-developer licensing.",
      "You want TanStack Table as the controlled state model.",
      "Owning and adapting the implementation is more important than vendor support.",
      "The focused MIT feature set covers the required data-entry workflow.",
    ],
    chooseAlternative: [
      "You need grouping, pivoting, tree data, server-side row models or Excel export.",
      "A packaged enterprise platform and commercial support are desired.",
      "The Enterprise license cost fits the breadth of advanced features you need.",
    ],
    sources: [
      {
        label: "AG Grid pricing and feature tiers",
        url: "https://www.ag-grid.com/license-pricing/",
      },
      {
        label: "AG Grid Community vs Enterprise",
        url: "https://www.ag-grid.com/react-data-grid/community-vs-enterprise/",
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
      "Compare Gigatable and MUI X Data Grid pricing and feature tiers for React, including free editing, Premium clipboard workflows, TanStack control and Material UI integration.",
    summary:
      "Gigatable includes all of its current spreadsheet interactions under MIT. MUI X Community is free for core grid work, Pro adds professional features, and cell selection, clipboard paste, drag-fill and built-in history require Premium.",
    verifiedOn: "2026-07-31",
    pricing: {
      gigatable:
        "$0. All current Gigatable features are MIT licensed with no per-developer or per-application fee.",
      alternativeHeadline: "$299–$1,399/year",
      alternative:
        "MUI X Community is free. Pro is $299 USD per year per developer; Premium is $599 per year per developer; Enterprise starts at $1,399 per year per developer with a 15-seat minimum.",
      note: "The displayed MUI prices are annual list prices for the currently selected pricing model; application scope, renewals and volume terms can change the total.",
    },
    rows: [
      {
        dimension: "Commercial production",
        gigatable: freeGigatable(
          "The complete installed source can be used in commercial products under MIT.",
        ),
        alternative: {
          access: "mixed",
          label: "Free core · Paid Pro/Premium",
          detail:
            "The Community packages are MIT. Pro and Premium features require a commercial license for each applicable developer.",
        },
      },
      {
        dimension: "Cell editing",
        gigatable: freeGigatable(
          "Typed editable cells and custom React inputs are included.",
        ),
        alternative: {
          access: "free",
          label: "Free · Community",
          detail:
            "Cell and row editing are available in the MIT Community Data Grid.",
        },
      },
      {
        dimension: "Virtualization",
        gigatable: freeGigatable(
          "Row and column virtualization use TanStack Virtual.",
        ),
        alternative: {
          access: "free",
          label: "Free · Community",
          detail:
            "The Community Data Grid includes virtualization for its core rendered grid.",
        },
      },
      {
        dimension: "Column resizing and pinning",
        gigatable: freeGigatable(
          "Interactive resizing is included; pinning can remain controlled through the TanStack model and local source.",
        ),
        alternative: {
          access: "paid",
          label: "Paid · Pro $299/year+",
          detail:
            "MUI lists column resizing and column pinning among Data Grid Pro capabilities.",
        },
      },
      {
        dimension: "Cell and range selection",
        gigatable: freeGigatable(
          "Mouse and keyboard cell/range selection are included.",
        ),
        alternative: {
          access: "paid",
          label: "Paid · Premium $599/year+",
          detail:
            "MUI documents cell selection and rectangular ranges with DataGridPremium.",
        },
      },
      {
        dimension: "Clipboard paste and drag-fill",
        gigatable: freeGigatable(
          "Excel-compatible TSV paste, typed parsing, repeated paste and directional drag-fill are included.",
        ),
        alternative: {
          access: "paid",
          label: "Paid · Premium $599/year+",
          detail:
            "MUI's paste, fill shortcuts and drag-to-fill examples use DataGridPremium.",
        },
      },
      {
        dimension: "Undo and redo",
        gigatable: freeGigatable(
          "Edits, paste, fill and clear operations share one history stack.",
        ),
        alternative: {
          access: "paid",
          label: "Paid · Premium $599/year+",
          detail:
            "MUI's built-in Data Grid history and toolbar controls are documented with DataGridPremium.",
        },
      },
      {
        dimension: "Grouping, pivoting and Excel export",
        gigatable: unavailableInGigatable(
          "Gigatable does not provide these data-analysis platform features.",
        ),
        alternative: {
          access: "paid",
          label: "Paid · Premium $599/year+",
          detail:
            "MUI X Premium includes row grouping, pivoting and Excel export.",
        },
      },
    ],
    chooseGigatable: [
      "You need the listed spreadsheet interactions without a Premium license.",
      "You need TanStack-controlled state rather than an integrated grid state model.",
      "You want to own and modify the implementation inside the repository.",
      "The application is not tied to Material UI.",
    ],
    chooseAlternative: [
      "The application already standardizes on Material UI and MUI X.",
      "You need Premium features such as grouping, pivoting or Excel export.",
      "A packaged component with commercial support is worth the annual developer licensing.",
    ],
    sources: [
      {
        label: "MUI product pricing",
        url: "https://mui.com/pricing/",
      },
      {
        label: "MUI X licensing and plan definitions",
        url: "https://mui.com/x/introduction/licensing/",
      },
      {
        label: "MUI X Data Grid feature tiers",
        url: "https://mui.com/x/react-data-grid/features/",
      },
      {
        label: "MUI X cell selection",
        url: "https://mui.com/x/react-data-grid/cell-selection/",
      },
      {
        label: "MUI X clipboard and fill handle",
        url: "https://mui.com/x/react-data-grid/clipboard/",
      },
      {
        label: "MUI X undo and redo",
        url: "https://mui.com/x/react-data-grid/undo-redo/",
      },
    ],
  },
  {
    slug: "handsontable",
    alternative: "Handsontable",
    title: "Gigatable vs Handsontable",
    seoTitle: "Gigatable vs Handsontable for React Data Entry",
    seoDescription:
      "Compare Gigatable and Handsontable pricing for React: MIT commercial use, paid Handsontable production licensing, spreadsheet interactions and formula support.",
    summary:
      "Gigatable includes all of its current data-grid features under MIT for commercial use. Current Handsontable releases require a paid license for commercially driven production work; the free Hobby license is limited to personal, exploratory, non-commercial projects.",
    verifiedOn: "2026-07-31",
    pricing: {
      gigatable:
        "$0. All current Gigatable features are MIT licensed for commercial use with no per-developer fee.",
      alternativeHeadline: "$999+ per developer",
      alternative:
        "Handsontable Hobby is free only for personal, exploratory, non-commercial work. Standard starts at $999 USD per developer, Priority starts at $1,299 per developer, and Enterprise pricing is custom.",
      note: "Handsontable says each developer working with the product needs a license. Contact Handsontable to confirm billing term, volume and contract details.",
    },
    rows: [
      {
        dimension: "Commercial production",
        gigatable: freeGigatable(
          "The complete source-installed grid is available for commercial applications.",
        ),
        alternative: {
          access: "paid",
          label: "Paid · Standard $999+",
          detail:
            "The free Hobby license excludes commercially driven work. Standard is the entry paid tier for commercial teams.",
        },
      },
      {
        dimension: "Cell editing",
        gigatable: freeGigatable(
          "Typed values, custom React editors and inline editing are included.",
        ),
        alternative: {
          access: "paid",
          label: "Paid in commercial use · $999+",
          detail:
            "Handsontable includes editing in its full feature set, but current commercial production use requires a paid developer license.",
        },
      },
      {
        dimension: "Cell and range selection",
        gigatable: freeGigatable(
          "Mouse and keyboard range selection are included.",
        ),
        alternative: {
          access: "paid",
          label: "Paid in commercial use · $999+",
          detail:
            "Spreadsheet selection is available, but commercial production requires the paid license.",
        },
      },
      {
        dimension: "Clipboard and fill",
        gigatable: freeGigatable(
          "TSV copy/paste, typed parsing, repeated paste and directional fill are included.",
        ),
        alternative: {
          access: "paid",
          label: "Paid in commercial use · $999+",
          detail:
            "Clipboard and spreadsheet fill behavior are part of Handsontable's full paid commercial feature set.",
        },
      },
      {
        dimension: "Virtualization",
        gigatable: freeGigatable(
          "TanStack Virtual provides row and column virtualization.",
        ),
        alternative: {
          access: "paid",
          label: "Paid in commercial use · $999+",
          detail:
            "Handsontable's rendered-grid performance features are covered by its commercial product license.",
        },
      },
      {
        dimension: "Undo and redo",
        gigatable: freeGigatable(
          "Editing, paste, fill and clearing share one application-owned history stack.",
        ),
        alternative: {
          access: "paid",
          label: "Paid in commercial use · $999+",
          detail:
            "Undo/redo is part of Handsontable's spreadsheet feature set under the applicable commercial license.",
        },
      },
      {
        dimension: "Formula calculation",
        gigatable: unavailableInGigatable(
          "Gigatable has no formula engine, workbook model or cross-sheet references.",
        ),
        alternative: {
          access: "paid",
          label: "Paid in commercial use · $999+",
          detail:
            "Handsontable integrates HyperFormula for spreadsheet functions and cross-sheet calculation.",
        },
      },
    ],
    chooseGigatable: [
      "The product is a React CRUD or operational data-entry interface, not a workbook.",
      "MIT commercial use and no per-developer fee are requirements.",
      "TanStack Table state and source ownership are architectural requirements.",
      "Domain-specific React editors matter more than formula calculation.",
    ],
    chooseAlternative: [
      "Users need formulas, cross-sheet calculations or a spreadsheet-first model.",
      "The commercial per-developer license fits the project.",
      "A broad vendor-supported spreadsheet component is preferable to application-owned source.",
    ],
    sources: [
      {
        label: "Handsontable pricing and commercial tiers",
        url: "https://handsontable.com/pricing",
      },
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
