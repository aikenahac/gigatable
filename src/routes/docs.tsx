import { useEffect } from "react";
import {
  isRouteErrorResponse,
  redirect,
  useLoaderData,
  useLocation,
  useNavigate,
  useRouteError,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import { getMDXComponents } from "../docs/mdx-components";
import { docsPageTree, getDocsPage } from "../docs/source";
import { isDocsSlug } from "../docs/docs-manifest";
import { getDocsActionUrls } from "../docs/actions";
import { NotFoundPage } from "../pages/not-found-page";
import {
  defaultRobots,
  getJsonLdForRoute,
  siteName,
  siteOrigin,
} from "../site/seo";

const githubUrl = "https://github.com/aikenahac/gigatable";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const wildcard = params["*"] ?? "";
  const slugs = wildcard.split("/").filter(Boolean);

  if (slugs[0] === "overview") {
    const url = new URL(request.url);
    throw redirect(`/docs/${url.search}${url.hash}`);
  }

  const page = getDocsPage(slugs);
  if (!page || !isDocsSlug(page.slugs[0])) {
    throw new Response("Not Found", { status: 404 });
  }

  await page.data.preload();
  const loadedPage = await page.data.load();

  const slug = page.slugs[0];
  const canonicalPath = slug === "overview" ? "/docs/" : `/docs/${slug}/`;

  return {
    canonicalPath,
    description: page.data.seoDescription,
    image: "/og/docs.png",
    imageAlt: "Gigatable React data grid documentation",
    markdownPath: `/docs/${slug}.md`,
    seoTitle: page.data.seoTitle,
    slug,
    sourceFile: page.data.info.path,
    toc: loadedPage.toc.filter((item) => item.depth > 1),
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [{ title: "Page Not Found | Gigatable" }];

  const canonicalUrl = `${siteOrigin}${data.canonicalPath}`;
  const imageUrl = `${siteOrigin}${data.image}`;

  return [
    { title: data.seoTitle },
    { name: "description", content: data.description },
    { name: "robots", content: defaultRobots },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    {
      tagName: "link",
      rel: "alternate",
      type: "text/markdown",
      href: `${siteOrigin}${data.markdownPath}`,
    },
    { property: "og:title", content: data.seoTitle },
    { property: "og:description", content: data.description },
    { property: "og:url", content: canonicalUrl },
    { property: "og:type", content: "article" },
    { property: "og:site_name", content: siteName },
    { property: "og:locale", content: "en_US" },
    { property: "og:image", content: imageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:alt", content: data.imageAlt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: data.seoTitle },
    { name: "twitter:description", content: data.description },
    { name: "twitter:image", content: imageUrl },
    { name: "twitter:image:alt", content: data.imageAlt },
  ];
};

export default function DocsRoute() {
  const data = useLoaderData<typeof loader>();
  const page = getDocsPage([data.slug])!;
  const MDXContent = page.data.body;
  const title =
    data.slug === "overview"
      ? "Gigatable React Data Grid Documentation"
      : page.data.title;
  const actions = getDocsActionUrls(data.slug, data.sourceFile);
  const jsonLd = getJsonLdForRoute({ name: "docs", slug: data.slug });

  return (
    <DocsLayout
      tree={docsPageTree}
      nav={{ title: "Gigatable", url: "/" }}
      githubUrl={githubUrl}
      links={[
        { text: "Demo", url: "/demo" },
        {
          text: "Support",
          url: "https://buymeacoffee.com/aiken.si",
          external: true,
        },
      ]}
    >
      <DocsPage toc={data.toc}>
        <div className="flex items-start justify-between gap-4">
          <DocsTitle>{title}</DocsTitle>
          <div className="flex shrink-0 items-center gap-1 pt-1">
            <MarkdownCopyButton markdownUrl={actions.markdownUrl} />
            <ViewOptionsPopover
              markdownUrl={actions.markdownUrl}
              githubUrl={actions.editUrl}
            />
          </div>
        </div>
        <DocsDescription>{data.description}</DocsDescription>
        <DocsBody>
          <MDXContent components={getMDXComponents()} />
        </DocsBody>
      </DocsPage>
      <script
        type="application/ld+json"
        data-gigatable-seo=""
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </DocsLayout>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isRouteErrorResponse(error) && error.status === 404) {
      document.title = "Page Not Found | Gigatable";
    }
  }, [error]);

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage navigate={(href) => void navigate(href)} />;
  }

  throw error instanceof Error
    ? error
    : new Error(`Unable to render ${location.pathname}`);
}
