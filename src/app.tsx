import { Suspense, lazy } from "react";
import { useSiteRouter } from "./site/use-site-router";

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

export default function App() {
  const { route, navigate } = useSiteRouter();

  if (route.name === "docs") {
    return (
      <Suspense fallback={<div className="site-loading">Loading docs...</div>}>
        <DocsPage slug={route.slug} navigate={navigate} />
      </Suspense>
    );
  }

  if (route.name === "demo") {
    return (
      <Suspense fallback={<div className="site-loading">Loading demo...</div>}>
        <DemoPage navigate={navigate} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<div className="site-loading">Loading...</div>}>
      <LandingPage navigate={navigate} />
    </Suspense>
  );
}
