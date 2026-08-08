import {
  useLoaderData,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router";
import App from "../app";
import { getJsonLdForRoute } from "../site/seo";
import { buildSiteMeta, loadSiteData } from "./site-data";

export function loader({ request }: LoaderFunctionArgs) {
  return loadSiteData(request);
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [];
  return buildSiteMeta(data.seo);
};

export default function SiteRoute() {
  const { pathname, route } = useLoaderData<typeof loader>();
  const jsonLd = getJsonLdForRoute(route);

  return (
    <>
      <App initialPathname={pathname} />
      <script
        type="application/ld+json"
        data-gigatable-seo=""
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
