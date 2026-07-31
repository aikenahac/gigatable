import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { PackageManagerCommand } from "../docs/code-block";
import { SiteLink } from "../site/site-link";
import { SupportLink } from "../site/support-link";
import {
  createDemoScenarioSearch,
  DEFAULT_DEMO_SCENARIO,
  getDemoScenarioFromSearch,
  normalizeDemoPathname,
  type DemoScenarioId,
} from "./demo-scenario-state";

const DEMO_SCENARIO_CHANGE_EVENT = "gigatable:demo-scenario-change";

const BiobankRegistryDemo = lazy(() =>
  import("./standard-demo-table").then((module) => ({
    default: module.BiobankRegistryDemo,
  })),
);
const SupportOperationsDemo = lazy(() =>
  import("./support-demo-table").then((module) => ({
    default: module.SupportOperationsDemo,
  })),
);
const ProductionScheduleDemo = lazy(() =>
  import("./advanced-demo-table").then((module) => ({
    default: module.ProductionScheduleDemo,
  })),
);

const scenarios = [
  {
    id: "biobank",
    label: "Biobank",
    eyebrow: "Registry operations",
    title: "Biobank Registry",
    description:
      "Manage microbial strains across 300 lineage, storage, assay, viability, and quality attributes—then scale the live registry to 100,000 rows.",
  },
  {
    id: "support",
    label: "Support",
    eyebrow: "Customer operations",
    title: "Support Operations",
    description:
      "Triage a live support queue with source-owned selectors, SLA dates, status displays, contextual account details, and full ticket dialogs.",
  },
  {
    id: "production",
    label: "Production",
    eyebrow: "Manufacturing operations",
    title: "Production Schedule",
    description:
      "Prioritize work orders across manufacturing lines with pinned identifiers, sortable deadlines, configurable columns, and handle-based drag-to-reorder planning.",
  },
] as const;

interface DemoPageProps {
  navigate: (href: string) => void;
}

function subscribeToDemoScenario(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("popstate", onStoreChange);
  window.addEventListener(DEMO_SCENARIO_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener(DEMO_SCENARIO_CHANGE_EVENT, onStoreChange);
  };
}

function getActiveDemoScenario(): DemoScenarioId {
  return typeof window === "undefined"
    ? DEFAULT_DEMO_SCENARIO
    : getDemoScenarioFromSearch(window.location.search);
}

function setActiveDemoScenario(scenario: DemoScenarioId): void {
  if (typeof window === "undefined") {
    return;
  }

  const currentScenario = getDemoScenarioFromSearch(window.location.search);
  const hasExplicitScenario = new URLSearchParams(window.location.search).has(
    "scenario",
  );

  if (currentScenario === scenario && hasExplicitScenario) {
    return;
  }

  const nextSearch = createDemoScenarioSearch(window.location.search, scenario);
  const nextLocation = `${normalizeDemoPathname(window.location.pathname)}${nextSearch}${window.location.hash}`;
  window.history.pushState(window.history.state, "", nextLocation);
  window.dispatchEvent(new Event(DEMO_SCENARIO_CHANGE_EVENT));
}

export function DemoPage({ navigate }: DemoPageProps) {
  const activeScenario = useSyncExternalStore(
    subscribeToDemoScenario,
    getActiveDemoScenario,
    () => DEFAULT_DEMO_SCENARIO,
  );

  useEffect(() => {
    const normalizedPathname = normalizeDemoPathname(window.location.pathname);

    if (normalizedPathname !== window.location.pathname) {
      window.history.replaceState(
        window.history.state,
        "",
        `${normalizedPathname}${window.location.search}${window.location.hash}`,
      );
    }
  }, []);

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = scenarios.findIndex(
    (scenario) => scenario.id === activeScenario,
  );
  const scenario = scenarios[activeIndex];

  const activateTab = (index: number) => {
    const normalizedIndex = (index + scenarios.length) % scenarios.length;
    setActiveDemoScenario(scenarios[normalizedIndex].id);
    tabRefs.current[normalizedIndex]?.focus();
  };

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      activateTab(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      activateTab(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      activateTab(0);
    } else if (event.key === "End") {
      event.preventDefault();
      activateTab(scenarios.length - 1);
    }
  };

  return (
    <main className="demo-page">
      <header className="demo-header">
        <div className="demo-header-inner">
          <div>
            <SiteLink href="/" navigate={navigate} className="demo-brand">
              Gigatable
            </SiteLink>
            <h1>Interactive operations data grid</h1>
            <p>
              Explore Gigatable inside three real application workflows, from a
              100,000-row scientific registry to support and production teams.
            </p>
          </div>
          <nav className="demo-header-actions">
            <SupportLink className="demo-support-link" />
            <SiteLink href="/docs/" navigate={navigate}>
              Docs
            </SiteLink>
            <SiteLink href="/" navigate={navigate} className="is-primary">
              Landing
            </SiteLink>
          </nav>
        </div>
      </header>

      <section className="demo-main">
        <aside className="demo-ownership-note">
          <span>Application-owned cell UI</span>
          <p>
            Gigatable supplies selection, editing lifecycles, clipboard, fill,
            history, and virtualization. Your app supplies domain cells—or
            installs the optional editable source baseline.
          </p>
          <PackageManagerCommand command="add cells" />
        </aside>

        <div
          className="demo-scenario-tabs"
          role="tablist"
          aria-label="Demo scenarios"
        >
          {scenarios.map((item, index) => (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`demo-tab-${item.id}`}
              aria-selected={item.id === activeScenario}
              aria-controls={`demo-panel-${item.id}`}
              tabIndex={item.id === activeScenario ? 0 : -1}
              onClick={() => setActiveDemoScenario(item.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              <span aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.label}
            </button>
          ))}
        </div>

        <section
          role="tabpanel"
          id={`demo-panel-${scenario.id}`}
          aria-labelledby={`demo-tab-${scenario.id}`}
          className="demo-scenario-panel"
        >
          <header className="demo-scenario-heading">
            <span>{scenario.eyebrow}</span>
            <h2>{scenario.title}</h2>
            <p>{scenario.description}</p>
          </header>
          <Suspense
            fallback={
              <div className="demo-table-loading" role="status">
                Preparing {scenario.title.toLowerCase()}…
              </div>
            }
          >
            {activeScenario === "biobank" ? (
              <BiobankRegistryDemo />
            ) : activeScenario === "support" ? (
              <SupportOperationsDemo />
            ) : (
              <ProductionScheduleDemo />
            )}
          </Suspense>
        </section>

        <aside className="demo-seo-links">
          <p>
            Ready to build? Read the{" "}
            <SiteLink href="/docs/quickstart/" navigate={navigate}>
              React data grid quickstart
            </SiteLink>
            , learn about{" "}
            <SiteLink href="/docs/custom-inputs/" navigate={navigate}>
              application-owned cells
            </SiteLink>
            , or{" "}
            <SiteLink href="/docs/installation/" navigate={navigate}>
              install the TypeScript source
            </SiteLink>
            .
          </p>
        </aside>
      </section>
    </main>
  );
}
