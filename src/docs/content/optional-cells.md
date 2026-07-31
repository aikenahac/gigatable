# Optional Cells

Gigatable core owns grid interaction and virtualization, not product-specific
cell UI. The optional cell pack gives you dependency-free, editable React
source for common selectors, dates, numbers, overlays, badges, and progress
displays. It is a starting point that lives in your application—not a runtime
component library or a requirement for using Gigatable.

## Install the Source Pack

Install Gigatable core first, then run:

<!-- package-manager-tabs:add-cells -->

```bash
npx gigatable add cells
pnpm dlx gigatable add cells
yarn dlx gigatable add cells
bunx gigatable add cells
```

The command finds your existing Gigatable root, confirms before overwriting,
and copies the components into its `cells/` directory. It installs no packages.
Import the components from that local directory:

```tsx
import {
  BadgeCell,
  DateCell,
  DialogCell,
  NumberCell,
  PopoverCell,
  ProgressCell,
  SelectCell,
  type CellOption,
  type CellTone,
} from "./gigatable/cells";
```

`gigatable init` intentionally does not include this folder. Run the add command
only when the application needs the optional source.

## Interaction Contract

All editable cells follow Gigatable's standard activation model:

- Single-click selects the cell.
- Double-click, Alt/Option-click, or Enter activates its editor.
- Controls inside an active editor use normal single-click interaction.
- Escape cancels. Select and date choices commit when chosen.
- Popovers and dialogs expose explicit Save and Cancel actions.
- Focus returns to the originating cell after an overlay closes.

Every editable column still needs `meta: { editable: true }`. Display-only
`BadgeCell` and `ProgressCell` do not mutate data by themselves; compose them as
the view renderer of `SelectCell` or `NumberCell` when the underlying value is
editable.

## Components

| Component      | Purpose                                                                  |
| -------------- | ------------------------------------------------------------------------ |
| `SelectCell`   | Keyboard-first listbox for string unions and constrained values          |
| `DateCell`     | Calendar editor for ISO `YYYY-MM-DD` values with optional bounds         |
| `NumberCell`   | Typed number input or range slider with min, max, step, tone, and suffix |
| `BadgeCell`    | Memoized semantic label for status, priority, category, or channel views |
| `ProgressCell` | Memoized accessible progress display with a semantic tone                |
| `PopoverCell`  | Compact application-owned editor with optional contextual details        |
| `DialogCell`   | Modal editor for long-form or multi-field content                        |

Shared types include `CellOption<TValue>`, `CellTone`, and
`OverlayCellEditorProps<TValue>`. Available tones are `neutral`, `info`,
`success`, `warning`, and `danger`.

## Selectors With Badge Views

Keep the option array stable and use the same rich renderer in view and edit
modes:

```tsx
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { BadgeCell, SelectCell, type CellOption } from "./gigatable/cells";

type Ticket = {
  id: string;
  priority: "normal" | "high" | "urgent";
};

const priorityOptions: ReadonlyArray<CellOption<Ticket["priority"]>> = [
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const columns: Array<ColumnDef<Ticket>> = [
  {
    accessorKey: "priority",
    header: "Priority",
    cell: (cell) => (
      <SelectCell
        {...(cell as CellContext<Ticket, Ticket["priority"]>)}
        options={priorityOptions}
        ariaLabel={`Priority for ${cell.row.original.id}`}
        renderOption={(option, value) => (
          <BadgeCell
            label={option?.label ?? value}
            tone={value === "urgent" ? "danger" : "info"}
          />
        )}
      />
    ),
    meta: {
      editable: true,
      getClearedValue: () => "normal",
      parsePastedValue: (input, cell) => {
        const match = priorityOptions.find(
          (option) =>
            option.value.toLowerCase() === input.trim().toLowerCase() ||
            option.label.toLowerCase() === input.trim().toLowerCase(),
        );
        return match?.value ?? cell.getValue<Ticket["priority"]>();
      },
    },
  },
];
```

`SelectCell` supports Arrow Up/Down, Home, End, typeahead, Enter, Space, Escape,
and Tab. `renderOption` receives the matched option and stored value, and is used
for both the selected cell and listbox options.

## Dates

`DateCell` stores strings in ISO date form. `min` and `max` use the same format;
`formatValue` can localize the view without changing stored data.

```tsx
cell: (cell) => (
  <DateCell
    {...(cell as CellContext<Ticket, string>)}
    ariaLabel={`SLA date for ${cell.row.original.id}`}
    min="2026-01-01"
    max="2026-12-31"
    formatValue={(value) => new Date(`${value}T12:00:00`).toLocaleDateString()}
  />
),
meta: {
  editable: true,
  parsePastedValue: (input, cell) =>
    /^\d{4}-\d{2}-\d{2}$/.test(input) ? input : cell.getValue<string>(),
},
```

The calendar supports Arrow keys, Home/End, Page Up/Page Down, Enter, and Escape.
It is not a native date input and does not depend on shadcn/ui or its colors.

## Numbers and Progress

Use `variant="number"` for direct numeric entry or `variant="range"` for a
slider paired with a visible numeric input. Values remain numbers throughout the
editing lifecycle.

```tsx
cell: (cell) => (
  <NumberCell
    {...(cell as CellContext<Ticket, number>)}
    ariaLabel={`Resolution for ${cell.row.original.id}`}
    min={0}
    max={100}
    step={1}
    variant="range"
    suffix="%"
    tone={(value) => (value === 100 ? "success" : "info")}
    renderValue={(value) => (
      <ProgressCell
        value={value}
        label={`Resolution progress for ${cell.row.original.id}`}
        tone={value === 100 ? "success" : "info"}
      />
    )}
  />
),
meta: { editable: true },
```

Invalid or empty numeric drafts cancel instead of replacing the stored value.
Committed values clamp to `min` and `max`. Add `meta.parsePastedValue` when
clipboard strings must become numbers.

## Popovers and Dialogs

`PopoverCell` and `DialogCell` accept an application-owned `renderEditor`:

```tsx
<PopoverCell
  {...cell}
  trigger={(value) => value}
  ariaLabel="Assigned agent"
  renderEditor={({ value, onChange }) => (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {agents.map((agent) => (
        <option key={agent} value={agent}>
          {agent}
        </option>
      ))}
    </select>
  )}
  details={(value) => <p>{teamFor(value)}</p>}
/>
```

Use a popover for a focused choice plus nearby context. Use `DialogCell` when the
editor needs long-form text, multiple controls, a title, and supporting copy.
Both keep a typed draft until Save, create one history entry on commit, cancel on
Escape or dismissal, isolate portal events from grid selection, and mount global
listeners only while open.

## Component Props

### `SelectCell`

Requires `options` and `ariaLabel`. Optional `placeholder` supplies unmatched or
empty copy, and `renderOption` customizes both view and listbox rendering.

### `DateCell`

Requires `ariaLabel`. Optional `min`, `max`, and `formatValue` constrain and
format ISO date strings.

### `NumberCell`

Requires `ariaLabel`. Optional `min`, `max`, `step`, `variant`, `tone`, `suffix`,
and `renderValue` configure typed number editing and display.

### `BadgeCell` and `ProgressCell`

`BadgeCell` accepts `label`, `tone`, and `className`. `ProgressCell` accepts
`value`, `label`, optional `max`, `tone`, `formatValue`, and `className`.

### `PopoverCell` and `DialogCell`

Both accept `trigger` and `renderEditor`. A popover also requires `ariaLabel` and
supports `details` and panel classes. A dialog requires `title` and supports
`description`, `ariaLabel`, and trigger classes.

## Adapt the Source

Treat these files as product-owned examples. Change their markup, styling,
option content, validation, and overlay layouts to match your application while
preserving the Gigatable editor contract:

- Keep typed draft changes separate from commits.
- Keep action and display-only columns out of mutation eligibility.
- Parse typed clipboard values with `meta.parsePastedValue`.
- Preserve keyboard operation, accessible names, and visible focus.
- Cancel overlays when their virtualized trigger unmounts or scrolls away.
- Mount expensive editors, portals, and listeners only while editing.

For a component not covered by the pack, follow the same lifecycle in
[Custom Inputs](/docs/custom-inputs) and the mutation rules in
[Column Metadata](/docs/column-metadata).
