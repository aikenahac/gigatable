import { describe, expect, it } from "vitest";
import { getDocsActionUrls } from "./actions";

describe("native Fumadocs page actions", () => {
  it("uses the compatible raw Markdown and GitHub edit URLs", () => {
    expect(getDocsActionUrls("installation", "installation.md")).toEqual({
      markdownUrl: "/docs/installation.md",
      editUrl:
        "https://github.com/aikenahac/gigatable/edit/master/src/docs/content/installation.md",
    });
  });
});
