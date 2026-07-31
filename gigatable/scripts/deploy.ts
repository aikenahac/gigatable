import * as path from "path";
import * as cp from "child_process";
import { syncTemplates } from "./sync-templates";

const PKG_DIR = path.join(__dirname, "..");

// 1. Sync templates
syncTemplates();

// 2. Build CLI
cp.execSync("pnpm build", { cwd: PKG_DIR, stdio: "inherit" });
console.log("✔ CLI built");

// 3. Publish
cp.execSync("npm publish", { cwd: PKG_DIR, stdio: "inherit" });
console.log("✔ Published to npm");
