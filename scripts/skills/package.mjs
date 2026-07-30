import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { readRelease } from "./registry.mjs";

const root = process.cwd();
const outputDirectory = path.join(root, "dist/skills");
const stagingDirectory = path.join(outputDirectory, ".staging");
const release = readRelease();

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? root,
    encoding: "utf8",
    stdio: options.stdio ?? "pipe",
  });
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed:\n${result.stderr || result.stdout}`,
    );
  }
  return result.stdout;
}

run("node", ["scripts/skills/validate.mjs"]);
run("node", ["scripts/skills/generate-installers.mjs", "--check"]);

fs.rmSync(outputDirectory, { recursive: true, force: true });
fs.mkdirSync(stagingDirectory, { recursive: true });
const stagedSkill = path.join(stagingDirectory, "gigatable");
fs.cpSync(path.join(root, "skills/gigatable"), stagedSkill, {
  recursive: true,
});

const fixedTime = new Date("2020-01-01T00:00:00.000Z");
const archiveEntries = [];
function normalize(directory) {
  const entries = fs
    .readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name));
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    fs.utimesSync(entryPath, fixedTime, fixedTime);
    if (entry.isDirectory()) {
      normalize(entryPath);
    } else {
      archiveEntries.push(path.relative(stagingDirectory, entryPath));
    }
  }
}
fs.utimesSync(stagedSkill, fixedTime, fixedTime);
normalize(stagedSkill);

const archivePath = path.join(outputDirectory, "gigatable-skill.zip");
run("zip", ["-X", "-q", archivePath, ...archiveEntries], {
  cwd: stagingDirectory,
});

for (const name of [
  "install-gigatable-skill.sh",
  "install-gigatable-skill.ps1",
]) {
  fs.copyFileSync(
    path.join(root, "scripts", name),
    path.join(outputDirectory, name),
  );
}
fs.chmodSync(path.join(outputDirectory, "install-gigatable-skill.sh"), 0o755);

const assets = [
  "gigatable-skill.zip",
  "install-gigatable-skill.sh",
  "install-gigatable-skill.ps1",
];
const checksums = assets
  .map((name) => {
    const hash = crypto
      .createHash("sha256")
      .update(fs.readFileSync(path.join(outputDirectory, name)))
      .digest("hex");
    return `${hash}  ${name}`;
  })
  .join("\n");
fs.writeFileSync(path.join(outputDirectory, "SHA256SUMS"), `${checksums}\n`);

fs.rmSync(stagingDirectory, { recursive: true, force: true });
const archiveListing = run("unzip", ["-Z1", archivePath]).trim().split("\n");
if (
  archiveListing.length !== archiveEntries.length ||
  archiveListing.some((entry) => !entry.startsWith("gigatable/")) ||
  !archiveListing.includes("gigatable/SKILL.md")
) {
  throw new Error("Packaged ZIP has an invalid skill-folder structure");
}

console.log(
  `Packaged ${release.version} review assets in ${path.relative(root, outputDirectory)}`,
);
for (const asset of [...assets, "SHA256SUMS"]) {
  console.log(`  ${asset}`);
}
