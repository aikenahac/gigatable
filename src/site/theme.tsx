import React from "react";
import {
  ThemeProvider as NextThemesProvider,
  useTheme,
} from "next-themes";

export type ThemeMode = "system" | "light" | "dark";
export type ResolvedTheme = Exclude<ThemeMode, "system">;

const STORAGE_KEY = "gigatable-site-theme";

export function isThemeMode(value: string | null): value is ThemeMode {
  return value === "system" || value === "light" || value === "dark";
}

export function resolveTheme(
  mode: ThemeMode,
  prefersDark: boolean,
): ResolvedTheme {
  return mode === "system" ? (prefersDark ? "dark" : "light") : mode;
}

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function applyThemeColor(theme: ResolvedTheme) {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#07090f" : "#f7f9fc");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute={["class", "data-theme"]}
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
      storageKey={STORAGE_KEY}
    >
      <ThemeBridge>{children}</ThemeBridge>
    </NextThemesProvider>
  );
}

function ThemeBridge({ children }: { children: React.ReactNode }) {
  const { resolvedTheme: nextResolvedTheme, setTheme, theme } = useTheme();
  const requestedTheme = theme ?? null;
  const mode: ThemeMode = isThemeMode(requestedTheme)
    ? requestedTheme
    : "system";
  const resolvedTheme: ResolvedTheme =
    nextResolvedTheme === "dark" ? "dark" : "light";

  React.useEffect(() => {
    applyThemeColor(resolvedTheme);
  }, [resolvedTheme]);

  const setMode = React.useCallback((nextMode: ThemeMode) => {
    setTheme(nextMode);
  }, [setTheme]);

  const value = React.useMemo(
    () => ({ mode, resolvedTheme, setMode }),
    [mode, resolvedTheme, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useSiteTheme() {
  const context = React.use(ThemeContext);
  if (!context) {
    throw new Error("useSiteTheme must be used within ThemeProvider.");
  }
  return context;
}

export function ThemeSelector({ compact = false }: { compact?: boolean }) {
  const { mode, setMode } = useSiteTheme();

  return (
    <label className="site-theme-selector">
      <span className="sr-only">Color theme</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.64 5.64l1.42 1.42M16.94 16.94l1.42 1.42M18.36 5.64l-1.42 1.42M7.06 16.94l-1.42 1.42" />
        <circle cx="12" cy="12" r="4" />
      </svg>
      <select
        aria-label="Color theme"
        value={mode}
        onChange={(event) => setMode(event.target.value as ThemeMode)}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      {compact ? null : (
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          width="14"
          height="14"
          fill="currentColor"
        >
          <path d="m5.5 7.5 4.5 4 4.5-4" />
        </svg>
      )}
    </label>
  );
}
