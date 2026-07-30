import type { AnchorHTMLAttributes } from "react";

const SUPPORT_URL = "https://buymeacoffee.com/aiken.si";

export function SupportLink(
  props: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
) {
  return (
    <a
      href={SUPPORT_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Support Aiken on Buy Me a Coffee"
      {...props}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="17"
        height="17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 8h11v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z" />
        <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3v2M12 3v2" />
      </svg>
      <span>Buy Me a Coffee</span>
    </a>
  );
}
