# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

This is a React TypeScript application demonstrating an Excel-like data table with advanced features including cell selection, range selection, inline editing, copy/paste functionality, row virtualization, and undo/redo history.

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

## Architecture

### Core Components

**DataTable System** (`src/data-table/`):
- `data-table.tsx`: Main table component that renders TanStack Table with custom cell selection, keyboard navigation, and row virtualization using `@tanstack/react-virtual`
- `use-data-table.tsx`: Custom hook that manages table state, data updates, integrates history functionality, and provides paste functionality with change tracking
- `editable-cell.tsx`: Component enabling inline cell editing with view/edit modes, keyboard shortcuts (Enter to edit, Escape to cancel, Tab/Enter to save)
- `use-cell-selection.tsx`: Hook managing cell selection state, range selection with mouse drag, and arrow key navigation
- `use-copy-to-clipboard.tsx`: Handles copying selected cell ranges to clipboard
- `use-history-state.tsx`: Implements undo/redo functionality for data changes with configurable history size
- `parse-copy-data.tsx` / `parse-paste-data.tsx`: Utilities for clipboard data transformation (TSV format)
- `index.ts`: Barrel export for clean imports

**Table Primitives** (`src/table/`):
- `table.tsx`: Reusable HTML table wrapper components (Table, Table.Header, Table.Body, Table.Row, Table.Head, Table.Data) with Tailwind CSS styling
- `index.ts`: Barrel export

**Data Layer**:
- `src/strains.tsx`: Exports strain data array loaded from JSON file
- `src/data/strains.json`: Generated JSON data file with 100+ fields of biological strain information
- `src/columns.tsx`: Column definitions (100+ columns) including which fields are editable (via `meta: { editable: true }` property)

**Main Application**:
- `src/app.tsx`: Main App component that initializes the DataTable with configuration
- `src/index.tsx`: Application entry point

### Naming Conventions

- **Files**: kebab-case (e.g., `data-table.tsx`, `use-cell-selection.tsx`)
- **Components**: PascalCase (e.g., `DataTable`, `EditableCell`)
- **Hooks**: camelCase with `use` prefix (e.g., `useDataTable`, `useCellSelection`)
- **Types/Interfaces**: PascalCase (e.g., `DataTableProps`, `CellCoordinates`)

### Key Features Implementation

**Cell Selection**:
- Single cell selection via click (enabled with `allowCellSelection={true}`)
- Range selection via mouse drag (enabled with `allowRangeSelection={true}`)
- Arrow key navigation between cells
- Visual feedback with outline for selected cell and background highlight for range
- Configurable styling with Tailwind CSS classes

**Inline Editing**:
- Double-click or press Enter on editable cells to activate edit mode
- Escape to cancel changes, Enter/Tab to save and exit edit mode
- Column definitions mark editable fields with `meta: { editable: true }`
- Custom input renderers per column (text inputs, number inputs with step values)
- EditableCell component handles view/edit state transitions

**Copy/Paste**:
- Ctrl/Cmd+C to copy selected range to clipboard (TSV format)
- Ctrl/Cmd+V to paste data starting from selected cell
- Paste returns a `PasteResult` with detailed change tracking (`changes` array and `totalChanges` count)
- Optional `onPasteComplete` callback for handling paste events
- Data parsed/formatted for Excel-like behavior

**History (Undo/Redo)**:
- Undo: Ctrl/Cmd+Z
- Redo: Ctrl/Cmd+Shift+Z
- History managed through `useHistoryState` hook with configurable `maxHistorySize`
- Enabled with `history={true}` prop in `useDataTable`
- History state tracks all data mutations

**Row Virtualization**:
- Implemented using `@tanstack/react-virtual` for efficient rendering of large datasets
- Only visible rows are rendered to the DOM
- Configurable overscan (default: 50 rows) for smooth scrolling
- Fixed row height estimation (30px) for optimal performance
- Handles datasets with thousands of rows efficiently

### TypeScript Configuration

- Path alias: `@root/*` maps to `src/*` (configured in both `tsconfig.json` and `vite.config.ts`)
- Strict mode enabled with `noImplicitReturns` and `noUnusedLocals`
- Custom type declarations in `src/types/react-table.ts` for extending TanStack Table's meta types
- CSS type declarations in `css.d.ts`

### State Management

Data flow:
1. Initial data loaded from `src/strains.tsx` (imports from `src/data/strains.json`)
2. `useDataTable` hook manages current state, history, and provides:
   - `table`: TanStack Table instance
   - `paste`: Function to handle paste operations with change tracking
   - `undo`: Function to undo last change
   - `redo`: Function to redo last undone change
   - `canUndo`/`canRedo`: Boolean flags for UI state
3. Cell updates trigger `updateCellData` via TanStack Table's meta API
4. Changes captured by history system when `history={true}` prop is set
5. TanStack Table re-renders only affected cells (optimized)
6. Row virtualization ensures only visible rows are in the DOM

### DataTable Props

The `DataTable` component accepts these props:
- `table`: TanStack Table instance (required)
- `allowCellSelection`: Enable single cell selection (default: false)
- `allowRangeSelection`: Enable range selection with mouse drag (default: false)
- `allowHistory`: Enable undo/redo keyboard shortcuts (default: false)
- `allowPaste`: Enable paste functionality (default: false)
- `paste`: Function returned from `useDataTable` for handling paste operations
- `onPasteComplete`: Optional callback receiving `PasteResult` after paste
- `undo`: Function for undo operation
- `redo`: Function for redo operation

### Customization Points

To modify table behavior:
- **Add columns**: Edit `src/columns.tsx`, add column definitions with appropriate `accessorKey`
- **Make column editable**: Set `meta: { editable: true }` and wrap cell renderer with `<EditableCell>` component with custom `renderInput` prop
- **Change data**: Modify `src/strains.tsx` or regenerate with `npm run generate-data [count]`
- **Adjust history size**: Pass `maxHistorySize` prop to `useDataTable` hook
- **Customize keyboard shortcuts**: Modify event listeners in `data-table.tsx` or `use-cell-selection.tsx`
- **Adjust virtualization**: Modify `estimateSize` (row height) or `overscan` (buffer rows) in `data-table.tsx`
- **Styling**: Edit Tailwind classes in `data-table.tsx`, `table.tsx`, and `editable-cell.tsx`

### Data Generation

The `scripts/generateStrainData.js` script uses @faker-js/faker to create biological strain data with 100+ fields including temperature, pH, viability, cell count, dates, quality metrics, and more.

Usage:
```bash
# Generate 500 entries (default)
npm run generate-data

# Generate custom number
npm run generate-data 1000
```

Output written to `src/data/strains.json`.

### Styling System

- **Tailwind CSS v4.1.17**: Utility-first CSS framework
- **Configuration**: `tailwind.config.js` and `postcss.config.js`
- **Custom CSS**: `src/styles.css` includes Tailwind directives
- **Class management**: `clsx` library for conditional class names
- **Design tokens**: CSS variables for border radius (`--border-md`)

### Build System

- **Vite**: Fast development server with Hot Module Replacement (HMR)
- **React Plugin**: `@vitejs/plugin-react` for React Fast Refresh
- **Path Resolution**: Configured alias `@root` → `./src` in Vite config
- **Build Output**: Optimized production bundle with code splitting
