import { docsSections, type DocsNavItem } from "./docs";
import { SiteLink } from "../site/site-link";

export function DocsNavigation({
  current,
  navigate,
  onNavigate,
}: {
  current: DocsNavItem;
  navigate: (href: string) => void;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Documentation">
      {docsSections.map((section) => (
        <section key={section.id}>
          <h2>{section.title}</h2>
          <ul>
            {section.items.map((item) => (
              <li key={item.slug}>
                <SiteLink
                  href={`/docs/${item.slug}`}
                  navigate={navigate}
                  aria-current={item.slug === current.slug ? "page" : undefined}
                  onClick={onNavigate}
                >
                  {item.title}
                </SiteLink>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}

export function DocsSearchButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="docs-search-button"
      aria-label="Search documentation"
      onClick={onClick}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="17"
        height="17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
      <span>Search Docs</span>
      <kbd>⌘ K</kbd>
    </button>
  );
}
