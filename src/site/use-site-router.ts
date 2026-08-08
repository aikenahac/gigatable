import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
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
  const location = useLocation();
  const routerNavigate = useNavigate();
  const route = getRouteForPath(location.pathname || initialPathname);

  const navigate = useCallback(
    (href: string) => {
      void routerNavigate(href);
    },
    [routerNavigate],
  );

  useEffect(
    () => scrollToLocationHash(),
    [location.hash, location.pathname],
  );

  return { route, navigate };
}
