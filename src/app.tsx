import { Suspense, lazy, useEffect } from "react";
import { useSiteRouter } from "./site/use-site-router";
import { ThemeProvider } from "./site/theme";
import { applySeoToDocument } from "./site/seo";

const DemoPage = lazy(() =>
  import("./pages/demo-page").then((module) => ({ default: module.DemoPage })),
);
const DocsPage = lazy(() =>
  import("./pages/docs-page").then((module) => ({ default: module.DocsPage })),
);
const LandingPage = lazy(() =>
  import("./pages/landing-page").then((module) => ({
    default: module.LandingPage,
  })),
);
const ResourcePage = lazy(() =>
  import("./pages/resource-page").then((module) => ({
    default: module.ResourcePage,
  })),
);
const ComparisonPage = lazy(() =>
  import("./pages/comparison-page").then((module) => ({
    default: module.ComparisonPage,
  })),
);
const NotFoundPage = lazy(() =>
  import("./pages/not-found-page").then((module) => ({
    default: module.NotFoundPage,
  })),
);

export default function App({
  initialPathname = "/",
}: {
  initialPathname?: string;
}) {
  return (
    <ThemeProvider>
      <SiteApp initialPathname={initialPathname} />
    </ThemeProvider>
  );
}

function SiteApp({ initialPathname }: { initialPathname: string }) {
  const { route, navigate } = useSiteRouter(initialPathname);

  useEffect(() => {
    applySeoToDocument(route);
  }, [route]);

  if (route.name === "docs") {
    return (
      <Suspense fallback={<div className="site-loading">Loading docs…</div>}>
        <DocsPage slug={route.slug} navigate={navigate} />
      </Suspense>
    );
  }

  if (route.name === "demo") {
    return (
      <Suspense fallback={<div className="site-loading">Loading demo…</div>}>
        <DemoPage navigate={navigate} />
      </Suspense>
    );
  }

  if (route.name === "landing") {
    return (
      <Suspense fallback={<div className="site-loading">Loading…</div>}>
        <LandingPage navigate={navigate} />
      </Suspense>
    );
  }

  if (route.name === "resource") {
    return (
      <Suspense fallback={<div className="site-loading">Loading…</div>}>
        <ResourcePage slug={route.slug} navigate={navigate} />
      </Suspense>
    );
  }

  if (route.name === "comparison") {
    return (
      <Suspense fallback={<div className="site-loading">Loading…</div>}>
        <ComparisonPage slug={route.slug} navigate={navigate} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<div className="site-loading">Loading…</div>}>
      <NotFoundPage navigate={navigate} />
    </Suspense>
  );
}
