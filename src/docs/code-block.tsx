import React from "react";
import { Highlight, themes as prismThemes } from "prism-react-renderer";
import { copyText } from "./page-actions";
import { useSiteTheme } from "../site/theme";

const languageNames: Record<string, string> = {
  bash: "Terminal",
  shell: "Terminal",
  sh: "Terminal",
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TSX",
  js: "JavaScript",
  javascript: "JavaScript",
  jsx: "JSX",
  json: "JSON",
  css: "CSS",
  mermaid: "Diagram",
};

export function CodeBlock({
  code,
  language = "text",
}: {
  code: string;
  language?: string;
}) {
  const { resolvedTheme } = useSiteTheme();
  const [status, setStatus] = React.useState<"idle" | "copied" | "error">(
    "idle",
  );

  const handleCopy = async () => {
    try {
      await copyText(code);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1400);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2200);
    }
  };

  return (
    <div className="docs-code-block">
      <div className="docs-code-header">
        <span>{languageNames[language] ?? language}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${languageNames[language] ?? language} code`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <rect x="8" y="8" width="11" height="11" rx="2" />
            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
          </svg>
          {status === "copied"
            ? "Copied"
            : status === "error"
              ? "Copy Failed"
              : "Copy"}
        </button>
        <span className="sr-only" aria-live="polite">
          {status === "copied"
            ? "Code copied to clipboard."
            : status === "error"
              ? "Copy failed. Select the code and copy it manually."
              : ""}
        </span>
      </div>
      <Highlight
        theme={
          resolvedTheme === "dark" ? prismThemes.nightOwl : prismThemes.github
        }
        code={code}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            <code>
              {tokens.map((line, lineIndex) => (
                <span
                  key={lineIndex}
                  {...getLineProps({ line })}
                  className="docs-code-line"
                >
                  {line.map((token, tokenIndex) => (
                    <span key={tokenIndex} {...getTokenProps({ token })} />
                  ))}
                  {"\n"}
                </span>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

const packageCommands: Record<PackageManager, string> = {
  npm: "npx gigatable init",
  pnpm: "pnpm dlx gigatable init",
  yarn: "yarn dlx gigatable init",
  bun: "bunx gigatable init",
};

const packageManagerKey = "gigatable-package-manager";

function getInitialPackageManager(): PackageManager {
  const stored = window.localStorage.getItem(packageManagerKey);
  return stored === "npm" ||
    stored === "pnpm" ||
    stored === "yarn" ||
    stored === "bun"
    ? stored
    : "npm";
}

export function PackageManagerTabs({ compact = false }: { compact?: boolean }) {
  const [manager, setManager] = React.useState<PackageManager>(
    getInitialPackageManager,
  );

  const selectManager = (nextManager: PackageManager) => {
    window.localStorage.setItem(packageManagerKey, nextManager);
    setManager(nextManager);
  };

  return (
    <div className={compact ? "package-tabs is-compact" : "package-tabs"}>
      <div role="tablist" aria-label="Package managers">
        {(Object.keys(packageCommands) as Array<PackageManager>).map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={item === manager}
            onClick={() => selectManager(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <CodeBlock code={packageCommands[manager]} language="bash" />
    </div>
  );
}
