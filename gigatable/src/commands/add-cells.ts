import * as fs from "fs";
import * as path from "path";
import fse from "fs-extra";
import pc from "picocolors";
import prompts from "prompts";
import { detectTypeScript } from "../utils/detect-ts";
import { detectTailwindV4 } from "../utils/detect-tw";

const CELLS_TEMPLATE_DIR = path.join(__dirname, "../../templates/cells");

function findProjectRoot(startDir: string): string {
  let directory = startDir;
  while (directory !== path.parse(directory).root) {
    if (fs.existsSync(path.join(directory, "package.json"))) return directory;
    directory = path.dirname(directory);
  }
  return startDir;
}

/** Checks that a selected directory contains the source-installed core. */
export function isGigatableRoot(directory: string): boolean {
  return (
    fs.existsSync(path.join(directory, "index.ts")) &&
    fs.existsSync(path.join(directory, "data-table", "gigatable.tsx"))
  );
}

/** Copies the optional pack. Exported so installer behavior can be tested. */
export function copyCellsTemplate(
  templateDirectory: string,
  gigatableRoot: string,
  overwrite = false,
): string {
  if (!isGigatableRoot(gigatableRoot)) {
    throw new Error(
      `No Gigatable installation found at ${gigatableRoot}. Run "npx gigatable init" first.`,
    );
  }
  if (!fs.existsSync(templateDirectory)) {
    throw new Error(
      "The optional cells template is missing. Reinstall the gigatable CLI and try again.",
    );
  }

  const destination = path.join(gigatableRoot, "cells");
  if (fs.existsSync(destination) && !overwrite) {
    throw new Error(`Cells already exist at ${destination}.`);
  }
  if (overwrite) fse.removeSync(destination);
  fse.copySync(templateDirectory, destination);
  return destination;
}

/** Installs editable optional cell source into an existing Gigatable root. */
export async function addCells(): Promise<void> {
  const projectRoot = findProjectRoot(process.cwd());
  console.log(pc.bold("\ngigatable add cells\n"));

  if (!detectTypeScript(projectRoot)) {
    throw new Error(
      "TypeScript is required. Add a tsconfig.json to your project root.",
    );
  }
  if (!detectTailwindV4(projectRoot)) {
    throw new Error("Tailwind CSS v4 is required.");
  }

  const { rootPathRaw } = await prompts({
    type: "text",
    name: "rootPathRaw",
    message: "Where is Gigatable installed?",
    initial: "src/gigatable",
    validate: (value: string) =>
      value.trim() ? true : "Path cannot be empty",
  });
  if (!rootPathRaw) return;

  const gigatableRoot = path.resolve(
    projectRoot,
    (rootPathRaw as string).trim(),
  );
  if (!isGigatableRoot(gigatableRoot)) {
    throw new Error(
      `No Gigatable installation found at ${(rootPathRaw as string).trim()}. Run "npx gigatable init" first.`,
    );
  }

  const destination = path.join(gigatableRoot, "cells");
  let overwrite = false;
  if (fs.existsSync(destination)) {
    const answer = await prompts({
      type: "confirm",
      name: "overwrite",
      message: `${path.relative(projectRoot, destination)} already exists. Overwrite?`,
      initial: false,
    });
    if (!answer.overwrite) return;
    overwrite = true;
  }

  process.stdout.write(pc.dim("  Copying optional cell source..."));
  copyCellsTemplate(CELLS_TEMPLATE_DIR, gigatableRoot, overwrite);
  process.stdout.write(
    `\r${pc.green("✔")} Cells copied to ${path.relative(projectRoot, destination)}\n`,
  );
  console.log(
    pc.dim(
      "  No dependencies were installed. Import components from your local ./cells barrel.",
    ),
  );
}
