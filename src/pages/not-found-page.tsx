import { SiteLink } from "../site/site-link";

export function NotFoundPage({
  navigate,
}: {
  navigate: (href: string) => void;
}) {
  return (
    <main className="not-found-page">
      <div>
        <span>404</span>
        <h1>Page not found</h1>
        <p>
          The requested Gigatable page does not exist. Continue with the React
          data grid documentation or try the interactive demo.
        </p>
        <nav aria-label="Recovery links">
          <SiteLink href="/" navigate={navigate}>
            Go to Gigatable
          </SiteLink>
          <SiteLink href="/docs/" navigate={navigate}>
            Read the Docs
          </SiteLink>
          <SiteLink href="/demo" navigate={navigate}>
            Open the Demo
          </SiteLink>
        </nav>
      </div>
    </main>
  );
}
