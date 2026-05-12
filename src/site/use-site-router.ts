import { useCallback, useEffect, useState } from "react";
import { getRouteForPath } from "./routes";
import type { SiteRoute } from "./routes";

export interface SiteRouter {
  route: SiteRoute;
  navigate: (href: string) => void;
}

export function useSiteRouter(): SiteRouter {
  const [route, setRoute] = useState<SiteRoute>(() =>
    getRouteForPath(window.location.pathname),
  );

  const navigate = useCallback((href: string) => {
    if (href === window.location.pathname) {
      return;
    }

    window.history.pushState(null, "", href);
    setRoute(getRouteForPath(href));
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getRouteForPath(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return { route, navigate };
}
