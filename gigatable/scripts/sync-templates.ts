import * as path from "path";
import fse from "fs-extra";

const REPO_ROOT = path.resolve(__dirname, "../..");
const CORE_SOURCE = path.join(REPO_ROOT, "src/gigatable");
const CELLS_SOURCE = path.join(CORE_SOURCE, "cells");
const TEMPLATES_ROOT = path.join(__dirname, "../templates");
const CORE_TEMPLATE = path.join(TEMPLATES_ROOT, "gigatable");
const CELLS_TEMPLATE = path.join(TEMPLATES_ROOT, "cells");

/** Synchronizes core and optional templates without including cells in init. */
export function syncTemplates(): void {
  fse.removeSync(CORE_TEMPLATE);
  fse.copySync(CORE_SOURCE, CORE_TEMPLATE, {
    filter: (source) => {
      const relative = path.relative(CORE_SOURCE, source);
      return relative !== "cells" && !relative.startsWith(`cells${path.sep}`);
    },
  });

  fse.removeSync(CELLS_TEMPLATE);
  fse.copySync(CELLS_SOURCE, CELLS_TEMPLATE, {
    filter: (source) => !source.endsWith(".test.tsx"),
  });

  console.log("✔ Core template synced without optional cells");
  console.log("✔ Optional cells template synced");
}
