import { useCallback, useEffect, useState } from "react";
import { getHashTargetId, getRouteForPath } from "./routes";
import type { SiteRoute } from "./routes";

export interface SiteRouter {
  route: SiteRoute;
  navigate: (href: string) => void;
}

function scrollToLocationHash(): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const id = getHashTargetId(window.location.hash);
  if (!id) {
    window.scrollTo({ top: 0, behavior: "auto" });
    return () => undefined;
  }

  let frame = 0;
  let cancelled = false;
  let requestId = 0;

  const findTarget = () => {
    if (cancelled) {
      return;
    }

    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "auto" });
      return;
    }

    frame += 1;
    if (frame < 120) {
      requestId = window.requestAnimationFrame(findTarget);
    }
  };

  requestId = window.requestAnimationFrame(findTarget);

  return () => {
    cancelled = true;
    window.cancelAnimationFrame(requestId);
  };
}

export function useSiteRouter(initialPathname = "/"): SiteRouter {
  const [route, setRoute] = useState<SiteRoute>(() =>
    getRouteForPath(
      typeof window === "undefined"
        ? initialPathname
        : window.location.pathname,
    ),
  );

  const navigate = useCallback((href: string) => {
    if (typeof window === "undefined") {
      return;
    }

    const url = new URL(href, window.location.origin);
    const nextLocation = `${url.pathname}${url.search}${url.hash}`;
    const currentLocation = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (nextLocation === currentLocation) {
      return;
    }

    window.history.pushState(null, "", nextLocation);
    setRoute(getRouteForPath(url.pathname));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handlePopState = () => {
      setRoute(getRouteForPath(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => scrollToLocationHash(), [route]);

  return { route, navigate };
}
