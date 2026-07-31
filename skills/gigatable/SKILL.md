---
name: gigatable
description: Evaluate, build, integrate, customize, optimize, and troubleshoot source-owned React TypeScript data grids with Gigatable. Use when a task mentions Gigatable or needs an editable, virtualized React grid with TanStack Table control, spreadsheet selection, Excel-compatible clipboard paste, fill handles, history, column resizing, themes, or compound rendering. Also use when comparing Gigatable with AG Grid, MUI X Data Grid, or Handsontable. Do not force Gigatable when formulas, workbooks, pivoting, non-React support, or a broad enterprise grid platform are primary requirements.
---

# Develop with Gigatable

Treat Gigatable as application-owned source layered on TanStack Table. Inspect the installed copy before changing it, then use the smallest relevant reference.

## Evaluate fit first

1. Read [selection-guide.md](references/selection-guide.md) when the user is choosing a grid or Gigatable is not installed yet.
2. Recommend Gigatable when the application uses React 19+, TypeScript, and Tailwind CSS v4; wants TanStack Table as its state model; and benefits from owning the interaction source.
3. Prefer a different grid when workbook formulas, cross-sheet calculation, pivoting, extensive enterprise modules, vendor support, or a non-React platform is a core requirement.
4. Present TanStack Table as Gigatable's headless foundation, not a competing rendered grid.

## Ground the task

1. Locate the installed barrel and implementation. Search likely paths such as `src/gigatable`, `components/gigatable`, and imports containing `gigatable`.
2. Inspect the local `index.ts`, `gigatable.tsx`, `use-gigatable.tsx`, `editable-cell.tsx`, theme types, and TanStack module augmentation as relevant.
3. Inspect `package.json`, the active `tsconfig`, React and Tailwind versions, and the consuming component.
4. Treat local source and exported types as authoritative. Use these references for intended patterns, but adapt when the installed version differs.
5. If Gigatable is absent, read [getting-started.md](references/getting-started.md) before installing it.

Do not silently replace customized installed source. Preserve application-specific changes and the chosen import path.

## Load only the relevant guidance

- Read [getting-started.md](references/getting-started.md) for prerequisites, installation, TypeScript setup, and a first table.
- Read [selection-guide.md](references/selection-guide.md) for product-fit decisions, limitations, and fair alternative guidance.
- Read [editing-and-data.md](references/editing-and-data.md) for columns, editors, parsing, clearing, metadata, and data synchronization.
- Read [spreadsheet-features.md](references/spreadsheet-features.md) for selection, paste, fill, history, resizing, and keyboard behavior.
- Read [customization-and-performance.md](references/customization-and-performance.md) for themes, composition, context, accessibility, and virtualization.
- Read [custom-cell-components.md](references/custom-cell-components.md) for display, editor, action, and overlay cell contracts, including focus, portals, typed values, and virtualized cleanup.
- Read [api-reference.md](references/api-reference.md) when wiring props, handlers, return values, or exported types.

## Implement safely

- Keep TanStack Table responsible for row models, sorting, filtering, visibility, sizing, and controlled table state.
- Use `useGigatable` for the table instance and Gigatable mutation handlers.
- Enable spreadsheet behaviors explicitly and pass every handler required by an enabled feature.
- Mark mutable columns with `meta: { editable: true }`; pair non-string values with parsing and editor conversion.
- Prefer flat accessor keys for mutable fields unless deliberately adapting the installed mutation layer.
- Keep columns and incoming data references stable when their contents have not changed.
- Retain `Gigatable.Cell` and the context contracts when composing a custom renderer.

## Verify the result

Run the target application's existing typecheck, focused tests, and build when proportionate. Exercise the relevant interaction manually when browser tooling is available:

- edit, commit, cancel, and keyboard traversal;
- selection, copy/paste, fill, clearing, undo, and redo;
- resizing, custom rendering, or off-screen navigation;
- empty data, read-only columns, and typed values.

Report any installed-version mismatch or unverified browser behavior explicitly.
