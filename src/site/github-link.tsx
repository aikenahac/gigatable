import type { AnchorHTMLAttributes } from "react";

const githubRepositoryUrl = "https://github.com/aikenahac/gigatable";

interface GitHubLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href"> {
  iconClassName?: string;
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18A11.1 11.1 0 0 1 12 6.8c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.69.42.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.68.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
      />
    </svg>
  );
}

export function GitHubLink({
  className,
  iconClassName = "h-5 w-5",
  "aria-label": ariaLabel = "Open Gigatable on GitHub",
  title = "View on GitHub",
  ...props
}: GitHubLinkProps) {
  return (
    <a
      href={githubRepositoryUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={ariaLabel}
      title={title}
      className={className}
      {...props}
    >
      <GitHubIcon className={iconClassName} />
    </a>
  );
}
