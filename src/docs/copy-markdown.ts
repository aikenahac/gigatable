interface ClipboardWriter {
  writeText: (text: string) => Promise<void>;
}

interface CopyMarkdownEnvironment {
  clipboard?: ClipboardWriter;
  document?: Document;
  isSecureContext?: boolean;
}

export async function copyMarkdownToClipboard(
  markdown: string,
  environment: CopyMarkdownEnvironment = {
    clipboard: navigator?.clipboard,
    document,
    isSecureContext: window.isSecureContext,
  },
) {
  if (environment.isSecureContext && environment.clipboard) {
    await environment.clipboard.writeText(markdown);
    return;
  }

  if (!environment.document) {
    throw new Error("Clipboard copy is unavailable.");
  }

  const textarea = environment.document.createElement("textarea");
  textarea.value = markdown;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  environment.document.body.appendChild(textarea);
  textarea.select();

  const copied = environment.document.execCommand("copy");
  environment.document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("Clipboard copy failed.");
  }
}
