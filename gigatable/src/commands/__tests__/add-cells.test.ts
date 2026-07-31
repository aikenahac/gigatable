import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { copyCellsTemplate, isGigatableRoot } from "../add-cells";

describe("add cells", () => {
  let directory: string;
  let root: string;
  let template: string;

  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), "gigatable-cells-"));
    root = join(directory, "src", "gigatable");
    template = join(directory, "template");
    mkdirSync(join(root, "data-table"), { recursive: true });
    mkdirSync(template, { recursive: true });
    writeFileSync(join(root, "index.ts"), "");
    writeFileSync(join(root, "data-table", "gigatable.tsx"), "");
    writeFileSync(join(template, "index.ts"), "export const cells = true;");
  });

  afterEach(() => {
    rmSync(directory, { recursive: true });
  });

  it("validates and copies into the Gigatable root without dependencies", () => {
    expect(isGigatableRoot(root)).toBe(true);
    const destination = copyCellsTemplate(template, root);
    expect(readFileSync(join(destination, "index.ts"), "utf8")).toContain(
      "cells = true",
    );
  });

  it("protects existing source unless overwrite is confirmed", () => {
    copyCellsTemplate(template, root);
    expect(() => copyCellsTemplate(template, root)).toThrow(
      "Cells already exist",
    );
    writeFileSync(join(template, "index.ts"), "export const cells = false;");
    copyCellsTemplate(template, root, true);
    expect(readFileSync(join(root, "cells", "index.ts"), "utf8")).toContain(
      "cells = false",
    );
  });

  it("rejects a directory without the installed core", () => {
    expect(() => copyCellsTemplate(template, directory)).toThrow(
      "No Gigatable installation",
    );
  });
});
