import { describe, expect, it } from "vitest";
import {
  buildAiPrompt,
  getAiPageActions,
  getMarkdownPath,
  getMarkdownUrl,
} from "./page-actions";

describe("documentation page actions", () => {
  it("creates stable raw Markdown paths", () => {
    expect(getMarkdownPath("quickstart")).toBe("/docs/quickstart.md");
    expect(getMarkdownUrl("quickstart", "https://gigatable.test")).toBe(
      "https://gigatable.test/docs/quickstart.md",
    );
  });

  it("builds the Expo-style AI handoff set", () => {
    const actions = getAiPageActions("quickstart", "https://gigatable.test");

    expect(actions.map((action) => action.id)).toEqual([
      "chatgpt",
      "codex",
      "claude",
      "claude-code",
      "cursor",
    ]);
    expect(decodeURIComponent(actions[0].href)).toContain(
      "https://gigatable.test/docs/quickstart.md",
    );
  });

  it("uses a direct, documentation-focused prompt", () => {
    expect(buildAiPrompt("https://example.test/page.md")).toContain(
      "Read this Gigatable documentation page",
    );
  });
});
