import { comparisons, getComparison } from "../comparisons/comparisons";
import type { ComparisonSlug } from "../comparisons/comparisons";
import { GitHubLink } from "../site/github-link";
import { SiteLink } from "../site/site-link";
import { SupportLink } from "../site/support-link";
import { ThemeSelector } from "../site/theme";

interface ComparisonPageProps {
  navigate: (href: string) => void;
  slug: "overview" | ComparisonSlug;
}

function ComparisonHeader({ navigate }: Pick<ComparisonPageProps, "navigate">) {
  return (
    <header className="resource-header">
      <SiteLink href="/" navigate={navigate} className="landing-logo">
        <span />
        <span>Gigatable</span>
      </SiteLink>
      <nav aria-label="Primary">
        <SiteLink href="/docs/" navigate={navigate}>
          Docs
        </SiteLink>
        <SiteLink href="/demo/" navigate={navigate}>
          Demo
        </SiteLink>
        <SupportLink className="site-support-link" />
        <ThemeSelector compact />
        <GitHubLink className="site-icon-button" />
      </nav>
    </header>
  );
}

function ComparisonFooter({ navigate }: Pick<ComparisonPageProps, "navigate">) {
  return (
    <footer className="resource-footer">
      <strong>Gigatable</strong>
      <span>
        Source-installed React data grid interactions on TanStack Table.
      </span>
      <SiteLink href="/docs/" navigate={navigate}>
        Documentation
      </SiteLink>
    </footer>
  );
}

function ComparisonOverview({ navigate }: ComparisonPageProps) {
  return (
    <div className="resource-page comparison-page">
      <a href="#comparison-main" className="site-skip-link">
        Skip to Content
      </a>
      <ComparisonHeader navigate={navigate} />
      <main id="comparison-main">
        <nav className="resource-breadcrumbs" aria-label="Breadcrumb">
          <SiteLink href="/" navigate={navigate}>
            Gigatable
          </SiteLink>
          <span aria-hidden="true">/</span>
          <span>Compare</span>
        </nav>
        <header className="resource-hero">
          <span>Decision Guide</span>
          <h1>Compare React data grids</h1>
          <p>
            Gigatable is strongest when you want application-owned TypeScript,
            TanStack Table control, and focused Excel-like data-entry
            interactions. These comparisons explain when that tradeoff wins—and
            when a broader packaged grid is the better choice.
          </p>
          <div>
            <SiteLink
              href="/docs/installation/"
              navigate={navigate}
              className="resource-primary-action"
            >
              Install Gigatable
            </SiteLink>
            <SiteLink href="/demo/" navigate={navigate}>
              Open the Demo
            </SiteLink>
          </div>
        </header>
        <article className="resource-content comparison-content">
          <section>
            <h2>Choose by product fit</h2>
            <p>
              No grid is the right answer for every application. Start with
              architecture, licensing, interaction requirements, and the amount
              of platform functionality your team wants to own.
            </p>
            <div className="comparison-card-grid">
              {comparisons.map((comparison) => (
                <SiteLink
                  key={comparison.slug}
                  href={`/compare/${comparison.slug}/`}
                  navigate={navigate}
                >
                  <span>Gigatable vs</span>
                  <strong>{comparison.alternative}</strong>
                  <p>{comparison.summary}</p>
                  <span>Read the comparison →</span>
                </SiteLink>
              ))}
            </div>
          </section>
          <section>
            <h2>TanStack Table is the foundation</h2>
            <p>
              TanStack Table is not treated as a competing rendered grid.
              Gigatable keeps its headless row, column, sizing, filtering, and
              controlled-state model, then adds editable cells, range selection,
              clipboard paste, fill, history, and virtualization.
            </p>
            <p>
              Read{" "}
              <SiteLink
                href="/guides/editable-tanstack-table/"
                navigate={navigate}
              >
                how Gigatable extends TanStack Table
              </SiteLink>
              .
            </p>
          </section>
          <section>
            <h2>Comparison policy</h2>
            <p>
              Claims are limited to documented product behavior and licensing.
              Every comparison links to primary sources and records when those
              sources were checked. Gigatable does not claim performance
              superiority without a reproducible benchmark.
            </p>
          </section>
        </article>
      </main>
      <ComparisonFooter navigate={navigate} />
    </div>
  );
}

function ComparisonDetail({
  navigate,
  slug,
}: ComparisonPageProps & { slug: ComparisonSlug }) {
  const comparison = getComparison(slug);

  return (
    <div className="resource-page comparison-page">
      <a href="#comparison-main" className="site-skip-link">
        Skip to Content
      </a>
      <ComparisonHeader navigate={navigate} />
      <main id="comparison-main">
        <nav className="resource-breadcrumbs" aria-label="Breadcrumb">
          <SiteLink href="/" navigate={navigate}>
            Gigatable
          </SiteLink>
          <span aria-hidden="true">/</span>
          <SiteLink href="/compare/" navigate={navigate}>
            Compare
          </SiteLink>
          <span aria-hidden="true">/</span>
          <span>{comparison.alternative}</span>
        </nav>
        <header className="resource-hero">
          <span>React Data Grid Comparison</span>
          <h1>{comparison.title}</h1>
          <p>{comparison.summary}</p>
          <div>
            <SiteLink
              href="/docs/installation/"
              navigate={navigate}
              className="resource-primary-action"
            >
              Install Gigatable
            </SiteLink>
            <SiteLink href="/demo/" navigate={navigate}>
              Open the Demo
            </SiteLink>
          </div>
        </header>
        <article className="resource-content comparison-content">
          <section>
            <h2>Feature and architecture comparison</h2>
            <div className="comparison-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Decision factor</th>
                    <th scope="col">Gigatable</th>
                    <th scope="col">{comparison.alternative}</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.rows.map((row) => (
                    <tr key={row.dimension}>
                      <th scope="row">{row.dimension}</th>
                      <td>{row.gigatable}</td>
                      <td>{row.alternative}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h2>Choose Gigatable when</h2>
            <ul>
              {comparison.chooseGigatable.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Choose {comparison.alternative} when</h2>
            <ul>
              {comparison.chooseAlternative.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Official sources</h2>
            <p>
              Last verified{" "}
              <time dateTime={comparison.verifiedOn}>
                {comparison.verifiedOn}
              </time>
              . Product capabilities and licensing can change; follow these
              primary sources for the current terms.
            </p>
            <ul>
              {comparison.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Continue evaluating</h2>
            <p>
              Review the{" "}
              <SiteLink href="/docs/" navigate={navigate}>
                Gigatable documentation
              </SiteLink>
              , try the{" "}
              <SiteLink href="/demo/" navigate={navigate}>
                interactive demo
              </SiteLink>
              , or return to the{" "}
              <SiteLink href="/compare/" navigate={navigate}>
                React data grid comparison hub
              </SiteLink>
              .
            </p>
          </section>
        </article>
      </main>
      <ComparisonFooter navigate={navigate} />
    </div>
  );
}

export function ComparisonPage(props: ComparisonPageProps) {
  if (props.slug === "overview") {
    return <ComparisonOverview {...props} />;
  }

  return <ComparisonDetail {...props} slug={props.slug} />;
}
