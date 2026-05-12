import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { detectTailwindV4 } from "../detect-tw";

describe("detectTailwindV4", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "gigatable-test-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true });
  });

  it("returns true when tailwindcss is in dependencies", () => {
    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify({ dependencies: { tailwindcss: "^4.0.0" } }),
    );
    expect(detectTailwindV4(dir)).toBe(true);
  });

  it("returns true when tailwindcss is in devDependencies", () => {
    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify({ devDependencies: { tailwindcss: "^4.1.0" } }),
    );
    expect(detectTailwindV4(dir)).toBe(true);
  });

  it("returns false when tailwindcss is absent", () => {
    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify({ dependencies: { react: "^19.0.0" } }),
    );
    expect(detectTailwindV4(dir)).toBe(false);
  });

  it("returns false when package.json does not exist", () => {
    expect(detectTailwindV4(dir)).toBe(false);
  });
});
