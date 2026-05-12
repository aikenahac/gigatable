import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { detectTypeScript } from "../detect-ts";

describe("detectTypeScript", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "gigatable-test-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true });
  });

  it("returns true when tsconfig.json exists", () => {
    writeFileSync(join(dir, "tsconfig.json"), "{}");
    expect(detectTypeScript(dir)).toBe(true);
  });

  it("returns false when tsconfig.json is absent", () => {
    expect(detectTypeScript(dir)).toBe(false);
  });
});
