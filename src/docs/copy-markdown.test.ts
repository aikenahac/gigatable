import { describe, expect, it, vi } from "vitest";
import { copyMarkdownToClipboard } from "./copy-markdown";

describe("copyMarkdownToClipboard", () => {
  it("writes markdown through the async clipboard API when available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    await copyMarkdownToClipboard("## Usage", {
      clipboard: { writeText },
      isSecureContext: true,
    });

    expect(writeText).toHaveBeenCalledWith("## Usage");
  });
});
