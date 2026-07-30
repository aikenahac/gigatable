import React from "react";
import {
  buildDocsSearchIndex,
  getSearchResultHref,
  searchDocs,
} from "./docs-search";
import type { DocsSearchResult } from "./docs-search";

const searchIndex = buildDocsSearchIndex();

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
  navigate: (href: string) => void;
}

export function SearchDialog({ open, onClose, navigate }: SearchDialogProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const results = React.useMemo(() => searchDocs(query, searchIndex), [query]);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) {
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      dialog.showModal();
      window.requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && dialog?.open) {
      dialog.close();
      window.requestAnimationFrame(() => returnFocusRef.current?.focus());
    }
  }, [open]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const choose = (result: DocsSearchResult) => {
    const href = getSearchResultHref(result);
    onClose();
    setQuery("");
    navigate(href);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "ArrowDown" && results.length) {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
    } else if (event.key === "ArrowUp" && results.length) {
      event.preventDefault();
      setActiveIndex(
        (current) => (current - 1 + results.length) % results.length,
      );
    } else if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      choose(results[activeIndex]);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="docs-search-dialog"
      aria-labelledby="docs-search-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="docs-search-panel">
        <h2 id="docs-search-title" className="sr-only">
          Search Documentation
        </h2>
        <div className="docs-search-input">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <input
            ref={inputRef}
            name="docs-search"
            type="search"
            autoComplete="off"
            spellCheck={false}
            placeholder="Search guides, APIs, and examples…"
            aria-label="Search documentation"
            aria-controls="docs-search-results"
            aria-activedescendant={
              results[activeIndex]
                ? `docs-search-result-${activeIndex}`
                : undefined
            }
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button type="button" onClick={onClose} aria-label="Close search">
            Esc
          </button>
        </div>
        <div
          id="docs-search-results"
          className="docs-search-results"
          role="listbox"
          aria-label="Documentation search results"
        >
          {!query ? (
            <div className="docs-search-empty">
              Search every guide, API field, and keyboard shortcut.
            </div>
          ) : results.length ? (
            results.map((result, index) => (
              <a
                key={`${result.slug}-${result.headingId ?? "page"}`}
                id={`docs-search-result-${index}`}
                role="option"
                aria-selected={activeIndex === index}
                href={getSearchResultHref(result)}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={(event) => {
                  event.preventDefault();
                  choose(result);
                }}
              >
                <span>
                  {result.sectionTitle} / {result.pageTitle}
                </span>
                <strong>{result.heading ?? result.pageTitle}</strong>
                <p>{result.excerpt}</p>
              </a>
            ))
          ) : (
            <div className="docs-search-empty">
              No results. Try a feature name such as “paste” or “theme.”
            </div>
          )}
        </div>
        <div className="docs-search-footer">
          <span>↑↓ Navigate</span>
          <span>Enter Open</span>
          <span>Esc Close</span>
        </div>
      </div>
    </dialog>
  );
}
