# Custom Cell Components

Gigatable deliberately ships grid mechanics rather than application-specific
cell UI. The basic `EditableCell` text path is part of the core. Applications
can adapt the optional source pack installed by `npx gigatable add cells`, or
create domain components when the product interaction differs.

## Classify the cell first

- **Display cells** render typed values without changing them. Keep them
  value-only, memoizable, and free of table mutation behavior.
- **Editor cells** use `EditableCell`, mount the editor only during edit mode,
  and mark the column `meta: { editable: true }`.
- **Action cells** invoke application behavior but do not represent a mutable
  field. Leave them read-only so paste, fill, clear, and history skip them.
- **Overlay cells** trigger a popover or dialog whose content can outlive the
  cell visually. Keep pure actions read-only; field editors use the normal
  `EditableCell` contract and commit only through an explicit Save action.

## Preserve the mutation contract

Use `EditableCell` rather than creating a parallel editing lifecycle. Use
`onDraftChange(value)` for a typed draft and `commitValue(value)` for a typed
commit that exits the editor. Forward blur, keyboard, and cancellation bindings
when native inline controls own those boundaries. `onValueChange(string)` is a
legacy immediate-commit adapter. Use `renderValue` when a typed value needs a
custom view representation.

Only columns with `meta.editable` participate in paste, fill, clearing, and
history. For non-string values, keep the stored type stable: convert editor
output deliberately and define `meta.parsePastedValue` for clipboard text.
Choose a deliberate cleared value and fill policy where the defaults do not fit.

## Own keyboard, pointer, and focus boundaries

Single-click selects without activating. Double-click activates an editable
cell; Alt/Option-click provides the power-user path when `allowQuickEdit` is
enabled; Enter activates the selected editable cell. Once active, controls use
normal single-click interaction. Interactive descendants must stop pointer and
keyboard events that would otherwise select or navigate the grid. Preserve
standard Enter, Tab, Escape, arrow-key, and blur behavior for inline editors.
Give controls accessible names and visible focus, focus the primary editor only
when it mounts, and restore focus to the originating cell after an overlay
closes.

Custom selectors should expose a focused `listbox` immediately after cell
activation so keyboard users do not need a second click. Support Arrow keys,
Home/End, typeahead, Enter to commit, and Escape to cancel. Custom calendars
should use an announced month, labelled day controls, roving focus, Arrow keys
for days and weeks, Home/End for week bounds, and Page Up/Page Down for months.
Keep these components dependency-free unless the application already owns a UI
runtime, and style them from Gigatable or application tokens rather than
assuming shadcn color variables.

Slider editors should retain a visible numeric value, not replace it with an
unlabelled track. Resolve their semantic tone from the same function used by the
view renderer so fill, thumb, value, and progress display do not change color
merely because editing began.

Mount editors and overlay content only while active. Add document or window
listeners only while an overlay is open and remove them during cleanup. Portals
must isolate their events from the table. Close transient overlays when the
grid scrolls or their virtualized trigger unmounts; dialogs may remain open only
when the application deliberately owns their state outside the row.

## Keep virtualized rendering inexpensive

Memoize value-only components and pass stable primitives or callbacks. Avoid
global listeners, browser queries, data fetching, and large allocations in row
or cell render paths. Access `window`, `document`, portals, and layout
measurement only after client mount. Never assume a cell DOM node remains
mounted after scroll, sorting, filtering, or data replacement.

## Decide whether to adapt or create

Use the optional pack when its source is a close behavioral match and local
ownership is useful. Copy and adapt its code as application source. Create an
application component when domain rules, design-system primitives, validation,
overlay ownership, or accessibility behavior substantially differ. In both
cases, Gigatable's edit and mutation contracts remain the integration boundary.
