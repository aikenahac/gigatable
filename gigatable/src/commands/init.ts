import * as path from "path";
import * as fs from "fs";
import * as cp from "child_process";
import fse from "fs-extra";
import pc from "picocolors";
import prompts from "prompts";
import { detectPackageManager } from "../utils/detect-pm";
import { detectTypeScript } from "../utils/detect-ts";
import { detectTailwindV4 } from "../utils/detect-tw";

const TEMPLATES_DIR = path.join(__dirname, "../../templates/gigatable");
const PEER_DEPS = ["@tanstack/react-table", "@tanstack/react-virtual", "clsx"];

function findProjectRoot(startDir: string): string {
  let dir = startDir;
  while (dir !== path.parse(dir).root) {
    if (fs.existsSync(path.join(dir, "package.json"))) return dir;
    dir = path.dirname(dir);
  }
  return startDir;
}

export async function init(): Promise<void> {
  const projectRoot = findProjectRoot(process.cwd());

  console.log(pc.bold("\ngigatable init\n"));

  if (!detectTypeScript(projectRoot)) {
    console.error(
      pc.red("✗ TypeScript is required. Add a tsconfig.json to your project root."),
    );
    process.exit(1);
  }
  console.log(pc.green("✔ TypeScript found"));

  if (!detectTailwindV4(projectRoot)) {
    console.error(
      pc.red(
        "✗ Tailwind CSS v4 is required. Install it first:\n  https://tailwindcss.com/docs/installation",
      ),
    );
    process.exit(1);
  }
  console.log(pc.green("✔ Tailwind CSS v4 found"));

  const pm = detectPackageManager(projectRoot);
  console.log(pc.green(`✔ Detected ${pm}\n`));

  const { targetPathRaw } = await prompts({
    type: "text",
    name: "targetPathRaw",
    message: "Where should gigatable be added?",
    initial: "src/gigatable",
    validate: (v: string) => (v.trim() ? true : "Path cannot be empty"),
  });

  if (!targetPathRaw) process.exit(0);
  const targetPath = path.resolve(projectRoot, (targetPathRaw as string).trim());

  if (fs.existsSync(targetPath)) {
    const { overwrite } = await prompts({
      type: "confirm",
      name: "overwrite",
      message: `${targetPathRaw} already exists. Overwrite?`,
      initial: false,
    });
    if (!overwrite) process.exit(0);
    fse.removeSync(targetPath);
  }

  process.stdout.write(pc.dim("  Copying files..."));
  fse.copySync(TEMPLATES_DIR, targetPath);
  process.stdout.write(`\r${pc.green("✔")} Files copied to ${targetPathRaw}\n`);

  process.stdout.write(pc.dim(`  Installing dependencies with ${pm}...`));
  const installArg = pm === "npm" ? "install" : "add";
  cp.execSync(`${pm} ${installArg} ${PEER_DEPS.join(" ")}`, {
    cwd: projectRoot,
    stdio: "pipe",
  });
  process.stdout.write(`\r${pc.green("✔")} Dependencies installed\n`);

  const importPath = (targetPathRaw as string).replace(/^src\//, "");
  console.log(
    [
      "",
      pc.bold(" Done! Get started:"),
      "",
      `    import { DataTable, useDataTable } from "./${importPath}"`,
      "",
      pc.dim(
        `  Add ${targetPathRaw}/types/react-table.ts to your tsconfig.json "include" array.`,
      ),
      "",
    ].join("\n"),
  );
}
