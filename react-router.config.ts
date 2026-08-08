import type { Config } from "@react-router/dev/config";
import { canonicalRoutes } from "./src/site/seo";
import { getCanonicalPath } from "./src/site/routes";

export default {
  appDirectory: "src",
  ssr: false,
  future: {
    v8_trailingSlashAwareDataRequests: true,
  },
  prerender({ getStaticPaths }) {
    return Array.from(new Set([
      ...getStaticPaths(),
      ...canonicalRoutes.map(getCanonicalPath),
      "/api/search",
      "/docs/overview/",
      "/404.html",
    ]));
  },
} satisfies Config;
