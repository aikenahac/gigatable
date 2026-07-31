import type { CellOption } from "../gigatable/cells";
import { normalizeNumberCellValue } from "../gigatable/cells";

export function parseDemoOption<TValue extends string>(
  input: string,
  options: ReadonlyArray<CellOption<TValue>>,
  currentValue: TValue,
): TValue {
  const normalized = input.trim().toLocaleLowerCase();
  return (
    options.find(
      (option) =>
        option.value.toLocaleLowerCase() === normalized ||
        option.label.toLocaleLowerCase() === normalized,
    )?.value ?? currentValue
  );
}

export function parseDemoNumber(
  input: string,
  currentValue: number,
  min?: number,
  max?: number,
): number {
  return normalizeNumberCellValue(input, min, max) ?? currentValue;
}

export function parseDemoDate(
  input: string,
  currentValue: string,
  min?: string,
  max?: string,
): string {
  const value = input.trim();
  if (value === "") return "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return currentValue;
  const date = new Date(`${value}T00:00:00Z`);
  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    return currentValue;
  }
  if ((min && value < min) || (max && value > max)) return currentValue;
  return value;
}
