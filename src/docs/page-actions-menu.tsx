import React from "react";
import type { DocsNavItem } from "./docs";
import {
  copyText,
  downloadMarkdown,
  getAiPageActions,
  getMarkdownPath,
  getPageUrl,
} from "./page-actions";

export function PageActionsMenu({ doc }: { doc: DocsNavItem }) {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const actions =
    typeof window === "undefined"
      ? []
      : getAiPageActions(doc.slug, window.location.origin);
  const closeAndFocus = React.useCallback(() => {
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        closeAndFocus();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAndFocus();
      } else if (
        event.key === "ArrowDown" ||
        event.key === "ArrowUp" ||
        event.key === "Home" ||
        event.key === "End"
      ) {
        const items = Array.from(
          menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ??
            [],
        );
        if (!items.length) {
          return;
        }

        event.preventDefault();
        const currentIndex = items.indexOf(
          document.activeElement as HTMLElement,
        );
        const nextIndex =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? items.length - 1
              : event.key === "ArrowDown"
                ? (currentIndex + 1) % items.length
                : (currentIndex - 1 + items.length) % items.length;
        items[nextIndex]?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() =>
      menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus(),
    );
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeAndFocus, open]);

  const report = (message: string) => {
    setStatus(message);
    window.setTimeout(() => setStatus(""), 1800);
  };

  const copy = async (value: string, success: string) => {
    try {
      await copyText(value);
      report(success);
      closeAndFocus();
    } catch {
      report("Copy failed. Select and copy the content manually.");
    }
  };

  return (
    <div className="docs-page-actions" ref={wrapperRef}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect x="8" y="8" width="11" height="11" rx="2" />
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
        </svg>
        Copy Page
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          width="14"
          height="14"
          fill="currentColor"
        >
          <path d="m5.5 7.5 4.5 4 4.5-4" />
        </svg>
      </button>
      {open ? (
        <div ref={menuRef} role="menu" aria-label="Copy page actions">
          <button
            type="button"
            role="menuitem"
            onClick={() => void copy(doc.content, "Markdown copied.")}
          >
            Copy Markdown
          </button>
          <a
            role="menuitem"
            href={getMarkdownPath(doc.slug)}
            target="_blank"
            rel="noreferrer"
          >
            View Markdown
          </a>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              downloadMarkdown(doc.slug, doc.content);
              report("Markdown downloaded.");
              closeAndFocus();
            }}
          >
            Download Markdown
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() =>
              void copy(
                getPageUrl(doc.slug, window.location.origin),
                "Page link copied.",
              )
            }
          >
            Copy Page Link
          </button>
          <div className="docs-menu-separator" role="separator" />
          {actions.map((action) => (
            <a
              key={action.id}
              role="menuitem"
              href={action.href}
              target={action.href.startsWith("http") ? "_blank" : undefined}
              rel={action.href.startsWith("http") ? "noreferrer" : undefined}
              onClick={closeAndFocus}
            >
              {action.label}
            </a>
          ))}
        </div>
      ) : null}
      <span className="sr-only" aria-live="polite">
        {status}
      </span>
    </div>
  );
}
