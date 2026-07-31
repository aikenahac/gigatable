import { describe, expect, it } from "vitest";
import {
  docsNav,
  docsSections,
  extractMarkdownHeadings,
  getAdjacentDocs,
  getDocBySlug,
} from "./docs";

describe("documentation structure", () => {
  it("starts with a documentation overview and groups the approved sections", () => {
    expect(docsNav[0].slug).toBe("overview");
    expect(docsSections.map((section) => section.title)).toEqual([
      "Start",
      "Guides",
      "Customization",
      "Reference",
      "Contributing",
    ]);
  });

  it("covers the complete consumer feature set", () => {
    const slugs = docsNav.map((item) => item.slug);

    expect(slugs).toEqual(
      expect.arrayContaining([
        "quickstart",
        "columns-editing",
        "selection-navigation",
        "clipboard-paste",
        "fill-handle",
        "history-clearing",
        "column-resizing",
        "virtualization-performance",
        "theming",
        "column-metadata",
        "custom-inputs",
        "optional-cells",
        "composition",
        "context-quick-edit",
        "gigatable-api",
        "use-gigatable-api",
        "editable-cell-api",
        "hooks-context-api",
        "types",
        "keyboard-shortcuts",
      ]),
    );
  });

  it("keeps install commands in the raw Markdown source", () => {
    const installation = getDocBySlug("installation");

    expect(installation.content).toContain("npx gigatable init");
    expect(installation.content).toContain("pnpm dlx gigatable init");
    expect(installation.content).toContain("bunx gigatable init");
    expect(installation.content).toContain("npx gigatable add cells");
    expect(installation.content).toContain("pnpm dlx gigatable add cells");
    expect(installation.content).toContain("yarn dlx gigatable add cells");
    expect(installation.content).toContain("bunx gigatable add cells");
  });

  it("documents every agent skill installation route", () => {
    const agentSkill = getDocBySlug("agent-skill");

    expect(agentSkill.content).toContain(
      "npx skills add aikenahac/gigatable --skill gigatable",
    );
    expect(agentSkill.content).toContain("install-gigatable-skill.sh | sh");
    expect(agentSkill.content).toContain("install-gigatable-skill.ps1");
    expect(agentSkill.content).toContain("gigatable-skill.zip");
  });

  it("uses the packaged default editor in the quickstart", () => {
    const quickstart = getDocBySlug("quickstart");

    expect(quickstart.content).toContain("allColumnsEditable");
    expect(quickstart.content).not.toContain("Create an Editor");
    expect(quickstart.content).not.toContain("EditableCellInputProps");
  });

  it("documents all built-in themes and underrepresented API props", () => {
    expect(getDocBySlug("theming").content).toContain("themes.giga");
    expect(getDocBySlug("gigatable-api").content).toContain("containerRef");
    expect(getDocBySlug("gigatable-api").content).toContain("tableStyle");
    expect(getDocBySlug("use-gigatable-api").content).toContain("clearCells");
    expect(getDocBySlug("use-gigatable-api").content).toContain(
      "applyHorizontalFill",
    );
  });

  it("documents every optional source cell", () => {
    const optionalCells = getDocBySlug("optional-cells").content;

    for (const component of [
      "SelectCell",
      "DateCell",
      "NumberCell",
      "BadgeCell",
      "ProgressCell",
      "PopoverCell",
      "DialogCell",
    ]) {
      expect(optionalCells).toContain(component);
    }
    expect(optionalCells).toContain("npx gigatable add cells");
    expect(optionalCells).toContain("pnpm dlx gigatable add cells");
    expect(optionalCells).toContain("yarn dlx gigatable add cells");
    expect(optionalCells).toContain("bunx gigatable add cells");
  });

  it("preserves contributor architecture documentation", () => {
    const architecture = getDocBySlug("contributor-architecture");

    expect(architecture.content).toContain("```mermaid");
    expect(architecture.content).toContain("useGigatable");
    expect(architecture.content).toContain("TanStack Virtual");
  });

  it("returns adjacent pages for pagination", () => {
    expect(getAdjacentDocs("installation").previous?.slug).toBe("overview");
    expect(getAdjacentDocs("installation").next?.slug).toBe("agent-skill");
    expect(getAdjacentDocs("agent-skill").next?.slug).toBe("quickstart");
  });
});

describe("extractMarkdownHeadings", () => {
  it("extracts h2 and h3 headings with stable ids", () => {
    expect(
      extractMarkdownHeadings(`
# Page title

## Usage

### Editable cells

## API reference
      `),
    ).toEqual([
      { id: "usage", level: 2, title: "Usage" },
      { id: "editable-cells", level: 3, title: "Editable cells" },
      { id: "api-reference", level: 2, title: "API reference" },
    ]);
  });
});
