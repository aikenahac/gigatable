# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

## Project Overview

This is a React TypeScript application demonstrating an Excel-like data table with advanced features including cell selection, range selection, inline editing, copy/paste functionality, fill handle, row virtualization, and undo/redo history.

The datatable component lives in `src/gigatable/` and is also distributed as a shadcn-style npm package via the `gigatable/` CLI package.

Built with:
- React 19.2.1 with TypeScript 5.9.3
- TanStack Table (v8.21.3) for table state management
- TanStack Virtual (v3.13.13) for row virtualization
- Vite (v7.2.7) for build tooling
- Tailwind CSS (v4.1.17) for styling
- clsx (v2.1.1) for conditional class management
- @faker-js/faker (v9.3.0) for data generation

## Development Commands

```bash
# Start development server
pnpm start
# or
pnpm dev

# Build for production
pnpm build

# Generate strain data (default: 500 entries)
pnpm generate-data

# Generate specific number of entries
pnpm generate-data 250

# Format code
pnpm format
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
│   │   ├── table.tsx        # Table, Table.Header, Table.Body, Table.Row, Table.Head, Table.Data
│   │   └── index.ts
│   ├── theme/               # Theming API
│   │   ├── types.ts         # GigatableTheme interface
│   │   ├── presets.ts       # themes.light, themes.dark, themes.minimal
│   │   └── utils.ts         # resolveTheme() — merges theme into CSS variable map
│   ├── types/
│   │   └── react-table.ts   # TanStack Table ColumnMeta augmentation (meta.editable)
│   ├── index.ts             # Public barrel export — consumers import from here
│   └── USAGE.md             # Cheatsheet (copied into user projects by CLI)
├── data/
│   └── strains.json         # Generated biological strain data (100+ fields)
├── types/
│   └── react-table.d.ts     # Additional ambient type declarations
├── app.tsx                  # Demo app — wires up gigatable with strain data
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
├── tsconfig.json            # CommonJS output to dist/
└── vitest.config.mjs

scripts/
└── generateStrainData.js    # Faker-based data generator
```

## Architecture

### Core Components

**`src/gigatable/`** is the canonical source for the datatable. The demo app imports from it, and the `gigatable/` CLI copies it into user projects.

**Public API** (what consumers import from `./gigatable`):
- `Gigatable` — main table component
- `useGigatable` — state hook
- `EditableCell` — editable cell wrapper
- `themes` — built-in theme presets (`themes.light`, `themes.dark`, `themes.minimal`)
- Types: `GigatableProps`, `UseGigatableProps`, `CellChange`, `PasteResult`, `CellCoordinates`, `CopyBuffer`, `EditableCellInputProps`, `GigatableTheme`

### Naming Conventions

- **Files**: kebab-case (`gigatable.tsx`, `use-cell-selection.tsx`)
- **Components**: PascalCase (`Gigatable`, `EditableCell`)
- **Hooks**: camelCase with `use` prefix (`useGigatable`, `useCellSelection`)
- **Types/Interfaces**: PascalCase (`GigatableProps`, `CellCoordinates`)

### Key Features

**Cell Selection** — `allowCellSelection`, `allowRangeSelection`:
- Click to select, drag to extend range, Shift+Arrow to extend
- Arrow key navigation, Ctrl+Home/End to jump
- Visual: outline on selected cell, `.is-in-range` class on range cells

**Inline Editing** — columns with `meta: { editable: true }`:
- Double-click or Enter to enter edit mode
- Escape to cancel, Tab/Enter to save
- `EditableCell` wraps the cell; `renderInput` prop provides the input component

**Copy/Paste** — `allowPaste`, `allowCellSelection` required:
- Ctrl/Cmd+C copies TSV, Ctrl/Cmd+V pastes from cursor cell
- `onPasteComplete` callback receives `PasteResult` with change details

**Fill Handle** — `allowFillHandle`, `applyFill`, editable columns required:
- 5×5px handle at bottom-right of anchor cell
- Drag down to fill a column value across rows

**Undo/Redo** — `allowHistory`, `history: true` in `useGigatable`:
- Ctrl/Cmd+Z / Ctrl/Cmd+Shift+Z
- `useHistoryState` stack, configurable `maxHistorySize` (default 20)

**Row Virtualization** — always on:
- `@tanstack/react-virtual`, row height derived from `theme.row.height` (default 30px), overscan 3–5 rows
- Only visible rows in DOM

### Gigatable Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `table` | `Table<TData>` | required | From `useGigatable` |
| `allowCellSelection` | `boolean` | `false` | Click selection + arrow keys |
| `allowRangeSelection` | `boolean` | `false` | Drag + Shift+Arrow range |
| `allowHistory` | `boolean` | `false` | Ctrl/Cmd+Z/Shift+Z shortcuts |
| `allowPaste` | `boolean` | `false` | Ctrl/Cmd+V paste |
| `allowFillHandle` | `boolean` | `false` | Drag-fill down a column |
| `paste` | `Function` | — | From `useGigatable`. Required when `allowPaste`. |
| `applyFill` | `Function` | — | From `useGigatable`. Required when `allowFillHandle`. |
| `undo` | `() => void` | — | From `useGigatable`. Required when `allowHistory`. |
| `redo` | `() => void` | — | From `useGigatable`. Required when `allowHistory`. |
| `onPasteComplete` | `(result: PasteResult) => void` | — | Callback after paste |
| `theme` | `GigatableTheme` | `themes.light` | Customise visual appearance |
| `allColumnsEditable` | `boolean` | `false` | Make every column editable with a default text input. Columns with `meta: { editable: true }` keep their own `renderInput`. |

### useGigatable Options

Extends all TanStack `TableOptions<TData>` except `getCoreRowModel`.

| Option | Default | Description |
|---|---|---|
| `columns` | required | TanStack `ColumnDef[]` |
| `data` | required | Row array |
| `history` | `false` | Enable undo/redo |
| `maxHistorySize` | `20` | Max undo steps |

Returns: `{ table, paste, applyFill, undo, redo, clear, canUndo, canRedo }`

### Column Definition Pattern

```typescript
// Read-only column
{ accessorKey: "id", header: "ID", size: 80 }

// Editable column
{
  accessorKey: "name",
  header: "Name",
  size: 200,
  cell: (cell) => <EditableCell {...cell} renderInput={TextInput} />,
  meta: { editable: true },
}
```

`renderInput` receives `EditableCellInputProps<TValue>`: `{ value, onChange, onBlur, onValueChange, onKeyDown, cancelEditing, className }`.

### TypeScript Configuration

- Root `tsconfig.json` excludes `gigatable/` (separate package with its own tsconfig)
- Path alias `@root/*` → `src/*` in root tsconfig and `vite.config.ts`
- `src/gigatable/types/react-table.ts` augments `ColumnMeta` with `editable?: boolean`
- Include `src/gigatable/types/react-table.ts` in `tsconfig.json` `include` array to enable `meta.editable` without type errors

### Customization Points

- **Add columns**: Edit `src/columns.tsx`
- **Make column editable**: Add `meta: { editable: true }` + wrap cell with `<EditableCell renderInput={...}>`
- **Change data**: Edit `src/strains.tsx` or run `pnpm generate-data [count]`
- **Adjust history size**: Pass `maxHistorySize` to `useGigatable`
- **Adjust virtualization**: Edit `overscan` in `src/gigatable/data-table/gigatable.tsx` (row height is derived from `theme.row.height`)
- **Theming**: Pass a `theme` prop to `<Gigatable>`. Use a built-in preset (`themes.light`, `themes.dark`, `themes.minimal`), spread and override one, or build a partial `GigatableTheme`. All `--gt-*` CSS variables can also be overridden directly in CSS.

### gigatable CLI Package

To publish a new version:
1. Bump `version` in `gigatable/package.json`
2. Run `pnpm deploy` from `gigatable/` — syncs `src/gigatable/` → `templates/`, builds, publishes

Users install with:
```bash
npx gigatable init
```

Requirements for target projects: TypeScript, Tailwind CSS v4, React 19+.
