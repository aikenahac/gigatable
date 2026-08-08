import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { MermaidBlock } from "./mermaid-block";

function CanonicalDocsLink(
  props: React.ComponentProps<typeof defaultMdxComponents.a>,
) {
  const [pathname, suffix = ""] = (props.href ?? "").split(/(?=[?#])/u, 2);
  const href =
    pathname.startsWith("/docs") && !pathname.endsWith("/")
      ? `${pathname}/${suffix}`
      : props.href;
  const Link = defaultMdxComponents.a;

  return <Link {...props} href={href} />;
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    a: CanonicalDocsLink,
    Mermaid: MermaidBlock,
    h1: () => null,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
