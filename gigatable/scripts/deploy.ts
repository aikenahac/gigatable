import * as path from "path";
import * as cp from "child_process";
import fse from "fs-extra";

const REPO_ROOT = path.resolve(__dirname, "../..");
const COMPONENT_SRC = path.join(REPO_ROOT, "src/gigatable");
const TEMPLATES_DEST = path.join(__dirname, "../templates/gigatable");
const PKG_DIR = path.join(__dirname, "..");

// 1. Sync templates
fse.removeSync(TEMPLATES_DEST);
fse.copySync(COMPONENT_SRC, TEMPLATES_DEST);
console.log("✔ Templates synced from src/gigatable/");

// 2. Build CLI
cp.execSync("pnpm build", { cwd: PKG_DIR, stdio: "inherit" });
console.log("✔ CLI built");

// 3. Publish
cp.execSync("npm publish", { cwd: PKG_DIR, stdio: "inherit" });
console.log("✔ Published to npm");
