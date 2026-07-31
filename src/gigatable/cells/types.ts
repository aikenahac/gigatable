/** Semantic color treatments shared by the optional Gigatable cell components. */
export type CellTone = "neutral" | "info" | "success" | "warning" | "danger";

/** Shared semantic colors used by optional display and editor components. */
export const cellToneColors: Record<CellTone, string> = {
  neutral: "#94a3b8",
  info: "#60a5fa",
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#fb7185",
};

/** One selectable value displayed by an optional Gigatable selector cell. */
export interface CellOption<TValue extends string> {
  /** Value stored in the table row. */
  value: TValue;
  /** Human-readable label shown in view and edit modes. */
  label: string;
  /** Prevents this option from being selected. */
  disabled?: boolean;
}

/** Typed draft bindings supplied to popover and dialog editor renderers. */
export interface OverlayCellEditorProps<TValue> {
  /** Current draft value. */
  value: TValue;
  /** Updates the draft without committing it. */
  onChange: (value: TValue) => void;
}
