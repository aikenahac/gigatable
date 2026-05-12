import type { GigatableTheme } from "./types";

const light: GigatableTheme = {
  header: {
    background: "#374151",
    textColor: "#f9fafb",
    borderColor: "#4b5563",
    height: "40px",
    fontSize: "14px",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontWeight: 600,
  },
  row: {
    height: "30px",
    background: "#ffffff",
    hoverBackground: "hsl(240 4.8% 95.9% / 0.5)",
  },
  cell: {
    borderColor: "hsl(240 5.9% 90%)",
    fontSize: "14px",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontWeight: 400,
    textColor: "inherit",
    paddingX: "12px",
    paddingY: "8px",
  },
  selection: {
    outline: "#3d5aa9",
    rangeBackground: "#dbe1ff",
  },
  paste: {
    highlightBackground: "rgba(134, 239, 172, 0.25)",
    highlightBorderColor: "#3d5aa9",
  },
  fill: {
    previewBackground: "#eff4ff",
    previewTextColor: "#6b8ccd",
  },
};

const dark: GigatableTheme = {
  header: {
    background: "#1e293b",
    textColor: "#f1f5f9",
    borderColor: "#334155",
    height: "40px",
    fontSize: "14px",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontWeight: 600,
  },
  row: {
    height: "30px",
    background: "#0f172a",
    hoverBackground: "hsl(215 28% 20%)",
  },
  cell: {
    borderColor: "hsl(215 28% 17%)",
    fontSize: "14px",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontWeight: 400,
    textColor: "#e2e8f0",
    paddingX: "12px",
    paddingY: "8px",
  },
  selection: {
    outline: "#60a5fa",
    rangeBackground: "#1e3a5f",
  },
  paste: {
    highlightBackground: "rgba(74, 222, 128, 0.2)",
    highlightBorderColor: "#60a5fa",
  },
  fill: {
    previewBackground: "#1e3a5f",
    previewTextColor: "#93c5fd",
  },
};

const minimal: GigatableTheme = {
  header: {
    background: "#f8fafc",
    textColor: "#475569",
    borderColor: "#e2e8f0",
    height: "40px",
    fontSize: "13px",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontWeight: 500,
  },
  row: {
    height: "30px",
    background: "transparent",
    hoverBackground: "#f8fafc",
  },
  cell: {
    borderColor: "#e2e8f0",
    fontSize: "13px",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontWeight: 400,
    textColor: "#334155",
    paddingX: "12px",
    paddingY: "8px",
  },
  selection: {
    outline: "#94a3b8",
    rangeBackground: "#f1f5f9",
  },
  paste: {
    highlightBackground: "rgba(148, 163, 184, 0.15)",
    highlightBorderColor: "#94a3b8",
  },
  fill: {
    previewBackground: "#f1f5f9",
    previewTextColor: "#94a3b8",
  },
};

const giga: GigatableTheme = {
  header: {
    background: "#101827",
    textColor: "#e0f2fe",
    borderColor: "#243244",
    height: "38px",
    fontSize: "13px",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontWeight: 650,
  },
  row: {
    height: "32px",
    background: "#050812",
    hoverBackground: "#0b1220",
  },
  cell: {
    borderColor: "#1e293b",
    fontSize: "13px",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontWeight: 500,
    textColor: "#dbeafe",
    paddingX: "12px",
    paddingY: "7px",
  },
  selection: {
    outline: "#22d3ee",
    rangeBackground: "rgba(34, 211, 238, 0.16)",
  },
  paste: {
    highlightBackground: "rgba(74, 222, 128, 0.18)",
    highlightBorderColor: "#4ade80",
  },
  fill: {
    previewBackground: "rgba(20, 184, 166, 0.18)",
    previewTextColor: "#99f6e4",
  },
};

export const themes = { light, dark, minimal, giga };
