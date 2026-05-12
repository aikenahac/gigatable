import { existsSync, readFileSync } from "fs";
import { join } from "path";

export function detectTailwindV4(cwd: string): boolean {
  const pkgPath = join(cwd, "package.json");
  if (!existsSync(pkgPath)) return false;
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8")) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  return (
    "tailwindcss" in (pkg.dependencies ?? {}) ||
    "tailwindcss" in (pkg.devDependencies ?? {})
  );
}
