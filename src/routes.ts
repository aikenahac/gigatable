import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/site.tsx"),
  route("api/search", "routes/search.ts"),
  route("docs/*", "routes/docs.tsx"),
  route("*", "routes/site-fallback.tsx"),
] satisfies RouteConfig;
