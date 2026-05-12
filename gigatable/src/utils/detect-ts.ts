import { existsSync } from "fs";
import { join } from "path";

export function detectTypeScript(cwd: string): boolean {
  return existsSync(join(cwd, "tsconfig.json"));
}
