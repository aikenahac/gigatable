import type { DocsSlug } from "./docs";

export interface PageActionLink {
  id: "chatgpt" | "codex" | "claude" | "claude-code" | "cursor";
  label: string;
  href: string;
}

export function getMarkdownPath(slug: DocsSlug): string {
  return `/docs/${slug}.md`;
}

export function getMarkdownUrl(slug: DocsSlug, origin: string): string {
  return new URL(getMarkdownPath(slug), origin).href;
}

export function getPageUrl(slug: DocsSlug, origin: string): string {
  return new URL(slug === "overview" ? "/docs/" : `/docs/${slug}/`, origin)
    .href;
}

export function buildAiPrompt(markdownUrl: string): string {
  return `Read this Gigatable documentation page so I can ask questions about it:\n\n${markdownUrl}`;
}

export function getAiPageActions(
  slug: DocsSlug,
  origin: string,
): Array<PageActionLink> {
  const prompt = buildAiPrompt(getMarkdownUrl(slug, origin));
  const encoded = encodeURIComponent(prompt);

  return [
    {
      id: "chatgpt",
      label: "Open in ChatGPT",
      href: `https://chat.openai.com/?q=${encoded}`,
    },
    {
      id: "codex",
      label: "Open in Codex",
      href: `codex://new?prompt=${encoded}`,
    },
    {
      id: "claude",
      label: "Open in Claude",
      href: `https://claude.ai/new?q=${encoded}`,
    },
    {
      id: "claude-code",
      label: "Open in Claude Code",
      href: `claude-cli://open?q=${encoded}`,
    },
    {
      id: "cursor",
      label: "Open in Cursor",
      href: `https://cursor.com/link/prompt?text=${encoded}`,
    },
  ];
}

export async function copyText(text: string): Promise<void> {
  if (window.isSecureContext && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const didCopy = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!didCopy) {
    throw new Error("Copy failed. Select the text and copy it manually.");
  }
}

export function downloadMarkdown(slug: DocsSlug, markdown: string) {
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${slug}.md`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
