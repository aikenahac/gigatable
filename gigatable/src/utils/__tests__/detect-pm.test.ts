import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { detectPackageManager } from "../detect-pm";

describe("detectPackageManager", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "gigatable-test-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true });
  });

  it("returns 'bun' when bun.lockb exists", () => {
    writeFileSync(join(dir, "bun.lockb"), "");
    expect(detectPackageManager(dir)).toBe("bun");
  });

  it("returns 'pnpm' when pnpm-lock.yaml exists", () => {
    writeFileSync(join(dir, "pnpm-lock.yaml"), "");
    expect(detectPackageManager(dir)).toBe("pnpm");
  });

  it("returns 'yarn' when yarn.lock exists", () => {
    writeFileSync(join(dir, "yarn.lock"), "");
    expect(detectPackageManager(dir)).toBe("yarn");
  });

  it("returns 'npm' when no lockfile found", () => {
    expect(detectPackageManager(dir)).toBe("npm");
  });

  it("prefers bun over pnpm when both lockfiles exist", () => {
    writeFileSync(join(dir, "bun.lockb"), "");
    writeFileSync(join(dir, "pnpm-lock.yaml"), "");
    expect(detectPackageManager(dir)).toBe("bun");
  });
});
