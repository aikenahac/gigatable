import * as path from "path";
import fse from "fs-extra";

const REPO_ROOT = path.resolve(__dirname, "../..");
const COMPONENT_SRC = path.join(REPO_ROOT, "src/gigatable");
const TEMPLATES_DEST = path.join(__dirname, "../templates/gigatable");

fse.removeSync(TEMPLATES_DEST);
fse.copySync(COMPONENT_SRC, TEMPLATES_DEST);
console.log("✔ Templates synced from src/gigatable/");
