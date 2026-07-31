# Overview

Gigatable is an open-source React data grid with Excel-like interactions and TanStack control. It combines TanStack Table state, row and column virtualization, editable cells, spreadsheet selection, TSV clipboard support, directional fill, column resizing, and undo/redo in source code you own.

## Why Gigatable

Most grids force you to choose between a small composable table and a large spreadsheet dependency. Gigatable keeps the TanStack Table model you already know while adding the interactions users expect from Excel.

| Capability  | What You Get                                                                 |
| ----------- | ---------------------------------------------------------------------------- |
| Selection   | Single cells, rectangular ranges, or constrained single-column ranges        |
| Editing     | Typed custom editors, quick edit, keyboard commit, and configurable clearing |
| Clipboard   | Excel-compatible TSV copy/paste with per-column parsing                      |
| Fill        | Vertical, horizontal, or two-axis value repetition with previews             |
| History     | Undo/redo for edits, paste, fill, and range clearing                         |
| Performance | Virtualized rows and memoized cells for large datasets                       |
| Ownership   | A CLI copies the TypeScript source directly into your app                    |

## Choose a Path

- Start with [Installation](/docs/installation/) and [Quickstart](/docs/quickstart/) for your first table.
- Read [Columns & Editing](/docs/columns-editing) to add domain-specific inputs.
- Use [Clipboard & Paste](/docs/clipboard-paste) and [Fill Handle](/docs/fill-handle) for spreadsheet workflows.
- Explore [Theming](/docs/theming) and [Compound Composition](/docs/composition) when the default renderer is not enough.
- Keep the [Gigatable reference](/docs/gigatable-api) nearby while wiring feature props.

For deeper implementation guidance, read [how to build an editable TanStack Table grid](/guides/editable-tanstack-table/) or explore [Excel-compatible copy and paste](/features/excel-copy-paste/).

Evaluating packaged alternatives? Use the [React data grid comparison guide](/compare/) for factual, source-linked comparisons with AG Grid, MUI X Data Grid, and Handsontable. TanStack Table is Gigatable's headless foundation rather than a competing rendered grid.

## Design Principles

### Source Installed

`npx gigatable init` copies the component into your repository. You can inspect, modify, and version the implementation with the rest of your application.

### Feature Flags Stay Explicit

Spreadsheet behaviors are opt-in. A read-only virtualized table needs only `table`; selection, paste, fill, history, and resizing are enabled independently.

### TanStack Table Remains the Model

Filtering, sorting, visibility, sizing, and controlled state continue to use TanStack Table options. Gigatable adds mutation helpers and interaction rendering around that model.

> [!TIP]
> The [full demo](/demo/) is a useful behavior reference. The docs focus on the smallest configuration required for each capability.

## Requirements at a Glance

Gigatable targets React 19+, TypeScript, Tailwind CSS v4, and modern browsers. See [Installation](/docs/installation/) for exact setup and generated files.
