# Gigatable

**The open-source, source-installed React data grid with Excel-like interactions and TanStack control.**

Gigatable adds editable cells, range selection, Excel-compatible copy/paste, fill handles, resizing, virtualization, and undo/redo to TanStack Table. Run `npx gigatable init` to install the TypeScript source directly in your app.

[Website](https://gigatable.dev/) · [Interactive demo](https://gigatable.dev/demo/) · [Documentation](https://gigatable.dev/docs/)

## Sponsors

Gigatable is supported by [Preskok ThinkTank](https://thinktank.preskok.si/en/).

<a href="https://thinktank.preskok.si/en/" target="_blank" rel="noopener noreferrer">
  <img src="public/preskok_thinktank.png" alt="Preskok Think Tank" width="220" />
</a>

## Features

### Table Functionality

- **Cell Selection & Navigation**
  - Single cell selection via click
  - Range selection via mouse drag
  - Arrow key navigation between cells
  - Shift+Arrow for extending selection range
  - Visual feedback with outlines and highlights

- **Inline Editing**
  - Double-click or Enter to activate edit mode
  - Alt/Option-click quick edit and partial-text selection
  - Custom input renderers per column (text, number with steps)
  - Escape to cancel, Enter/Tab to save and navigate
  - Delete/Backspace clears editable selections as one undo step
  - Automatic cell selection after edit

- **Copy/Paste Operations**
  - Copy selected ranges with Ctrl/Cmd+C (TSV format)
  - Paste data with Ctrl/Cmd+V starting from selected cell
  - Excel-compatible data formatting
  - Detailed change tracking with `PasteResult` callbacks
  - Selected-range repetition and per-column value parsing

- **Fill Handle**
  - Excel-style drag handle at bottom-right of anchor cell
  - Direction-locked vertical or horizontal fill
  - Per-column eligibility and formatted previews

- **Compound Rendering**
  - Default virtualized renderer remains available with zero setup
  - Override table, header, body, footer, or individual cells
  - Register custom row virtualizers while retaining keyboard navigation

- **Column Resizing**
  - Hover over a header border to reveal the resize handle
  - Drag to resize a column, double-click to reset its width
  - Width state can be persisted with TanStack `columnSizing` options

- **Undo/Redo History**
  - Full undo/redo support with Ctrl/Cmd+Z / Ctrl/Cmd+Shift+Z
  - Configurable history size
  - Tracks all data mutations

- **Performance Optimizations**
  - Row virtualization for datasets with 1000+ rows
  - Only visible rows rendered to DOM
  - Smooth scrolling with configurable overscan
  - Optimized re-renders with TanStack Table

- **Theming**
  - Built-in `themes.light`, `themes.dark`, and `themes.minimal` presets
  - Typed `theme` prop with full TypeScript autocomplete
  - All theme values accept CSS variable references (e.g. `"var(--primary)"`)
  - Implemented via CSS custom properties — advanced users can override `--gt-*` vars in CSS

## Getting Started

### Prerequisites

- Node.js 18+ or compatible runtime
- pnpm (recommended) or npm

### Installation

```bash
git clone https://github.com/aikenahac/gigatable.git
cd gigatable
pnpm install
```

### Development

```bash
# Start development server with hot reload
pnpm dev
# or
pnpm start

# Build for production
pnpm build

# Format code
pnpm format
```

### Generate Data

```bash
# Generate 500 strain entries (default)
pnpm generate-data

# Generate custom number of entries
pnpm generate-data 1000
```

## Project Structure

```
src/
├── gigatable/               # Gigatable component — source of truth for the npm package
│   ├── data-table/          # Core datatable implementation
│   │   ├── gigatable.tsx        # Main component (virtualization, selection, keyboard nav)
│   │   ├── use-gigatable.tsx    # State hook (data, history, paste, fill)
│   │   ├── editable-cell.tsx    # Inline editing component
│   │   ├── use-cell-selection.tsx   # Cell/range selection logic
│   │   ├── use-copy-to-clipboard.tsx
│   │   ├── use-history-state.tsx    # Undo/redo stack
│   │   ├── use-fill-handle.tsx      # Excel-style fill handle
│   │   ├── parse-copy-data.tsx      # TSV copy formatter
│   │   ├── parse-paste-data.tsx     # TSV paste parser
│   │   └── index.ts                 # Internal barrel
│   ├── table/               # HTML table primitive components
│   │   ├── table.tsx        # Table, Header, Body, Row, Head, Data
│   │   └── index.ts
│   ├── theme/               # Theming API
│   │   ├── types.ts         # GigatableTheme interface
│   │   ├── presets.ts       # themes.light, themes.dark, themes.minimal
│   │   └── utils.ts         # resolveTheme() — merges theme into CSS variable map
│   ├── types/
│   │   └── react-table.ts   # TanStack Table ColumnMeta augmentation
│   ├── index.ts             # Public barrel export — consumers import from here
│   └── USAGE.md             # Cheatsheet copied into user projects by CLI
├── data/
│   └── strains.json         # Generated biological strain data (100+ fields)
├── app.tsx                  # Demo app
├── columns.tsx              # 100+ column definitions for the demo
├── strains.tsx              # Loads strains.json
├── index.tsx                # Entry point
└── styles.css               # Global styles (Tailwind directives)

gigatable/                   # npm package — CLI tool only, no React code
├── src/
│   ├── cli/index.ts         # Entry point: npx gigatable init
│   ├── commands/init.ts     # Init flow: validate, copy, install deps
│   └── utils/
│       ├── detect-pm.ts     # Detect npm/yarn/pnpm/bun from lockfiles
│       ├── detect-ts.ts     # Check for tsconfig.json
│       └── detect-tw.ts     # Check for tailwindcss in package.json deps
├── scripts/deploy.ts        # Sync templates + build + npm publish
├── package.json
└── tsconfig.json

scripts/
└── generateStrainData.js    # Faker-based data generator
```

## npm Package

The `gigatable` package distributes the datatable as a shadcn-style code installer — no runtime dependency, it copies source files directly into your project.

```bash
npx gigatable init
```

**Requirements:** TypeScript, Tailwind CSS v4, React 19+.

The CLI detects your package manager and installs peer dependencies automatically.

To publish a new version:

1. Bump `version` in `gigatable/package.json`
2. Run `pnpm deploy` from `gigatable/` — syncs `src/gigatable/` → `templates/`, builds, publishes

## Architecture

### Public API

Consumers import from `./gigatable`:

```typescript
import {
  Gigatable,
  useGigatable,
  useGigatableContext,
  EditableCell,
  themes,
} from "./gigatable";
import type {
  GigatableProps,
  UseGigatableProps,
  CellChange,
  PasteResult,
  GigatableTheme,
} from "./gigatable";
```

### useGigatable Hook

```typescript
const {
  table,
  paste,
  applyFill,
  applyHorizontalFill,
  clearCells,
  reset,
  undo,
  redo,
  canUndo,
  canRedo,
} = useGigatable({
  columns,
  data,
  enableColumnResizing: true,
  columnResizeMode: "onChange",
  history: true,
  maxHistorySize: 50,
});
```

### Column Definition Pattern

```typescript
// Read-only
{ accessorKey: "id", header: "ID", size: 80 }

// Editable
{
  accessorKey: "name",
  header: "Name",
  size: 200,
  cell: (cell) => <EditableCell {...cell} renderInput={TextInput} />,
  meta: { editable: true },
}
```

`renderInput` receives `EditableCellInputProps<TValue>`: `{ value, onChange, onBlur, onValueChange, onKeyDown, cancelEditing, className }`.

### Gigatable Props

| Prop                        | Type                            | Default        | Description                                                                                                                 |
| --------------------------- | ------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `table`                     | `Table<TData>`                  | required       | From `useGigatable`                                                                                                         |
| `allowCellSelection`        | `boolean`                       | `false`        | Click selection + arrow keys                                                                                                |
| `allowRangeSelection`       | `boolean`                       | `false`        | Drag + Shift+Arrow range                                                                                                    |
| `singleColumnCellSelection` | `boolean`                       | `false`        | Drag + Shift+Arrow range down one column. Requires `allowCellSelection`; works when `allowRangeSelection` is false.         |
| `allowHistory`              | `boolean`                       | `false`        | Ctrl/Cmd+Z/Shift+Z shortcuts                                                                                                |
| `allowPaste`                | `boolean`                       | `false`        | Ctrl/Cmd+V paste                                                                                                            |
| `allowFillHandle`           | `boolean`                       | `false`        | Drag-fill down a column                                                                                                     |
| `allowColumnResizing`       | `boolean`                       | `false`        | Header-border drag resizing. Requires `enableColumnResizing` in `useGigatable`.                                             |
| `paste`                     | `Function`                      | —              | From `useGigatable`. Required when `allowPaste`.                                                                            |
| `applyFill`                 | `Function`                      | —              | From `useGigatable`. Required when `allowFillHandle`.                                                                       |
| `undo`                      | `() => void`                    | —              | From `useGigatable`. Required when `allowHistory`.                                                                          |
| `redo`                      | `() => void`                    | —              | From `useGigatable`. Required when `allowHistory`.                                                                          |
| `onPasteComplete`           | `(result: PasteResult) => void` | —              | Callback after paste                                                                                                        |
| `allColumnsEditable`        | `boolean`                       | `false`        | Make every column editable with a default text input. Columns with `meta: { editable: true }` keep their own `renderInput`. |
| `theme`                     | `GigatableTheme`                | `themes.light` | Customise visual appearance                                                                                                 |

## Keyboard Shortcuts

| Shortcut                   | Action                             |
| -------------------------- | ---------------------------------- |
| Click                      | Select cell                        |
| Double-click               | Edit cell (if editable)            |
| Enter                      | Edit selected cell or save changes |
| Escape                     | Cancel editing                     |
| Tab                        | Save changes and move to next cell |
| Arrow keys                 | Navigate between cells             |
| Shift + Arrow              | Extend selection range             |
| Ctrl/Cmd + C               | Copy selected range                |
| Ctrl/Cmd + V               | Paste data                         |
| Ctrl/Cmd + Z               | Undo last change                   |
| Ctrl/Cmd + Shift + Z       | Redo last undone change            |
| Drag header border         | Resize column                      |
| Double-click header border | Reset column width                 |

## Column Resizing

Column resizing uses TanStack Table sizing state. Enable it in `useGigatable`, then opt in to the resize handles on `<Gigatable>`:

```tsx
const { table } = useGigatable({
  columns,
  data,
  enableColumnResizing: true,
  columnResizeMode: "onChange",
});

<Gigatable table={table} allowColumnResizing />;
```

To persist widths, pass controlled TanStack state such as `state: { columnSizing }` and `onColumnSizingChange`.

## Browser Support

Modern browsers with ES2018+ support: Chrome/Edge 90+, Firefox 88+, Safari 14+.

## License

MIT
