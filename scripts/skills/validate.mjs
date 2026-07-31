import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  readRegistry,
  readRelease,
  registryDigest,
  validateRegistry,
} from "./registry.mjs";

const root = process.cwd();
const skillDirectory = path.join(root, "skills/gigatable");
const skillPath = path.join(skillDirectory, "SKILL.md");
const skill = fs.readFileSync(skillPath, "utf8");
const failures = [];

const frontmatter = /^---\n([\s\S]*?)\n---\n/.exec(skill)?.[1] ?? "";
const frontmatterLines = frontmatter
  .split("\n")
  .filter(Boolean)
  .map((line) => line.slice(0, line.indexOf(":")));
if (frontmatterLines.join(",") !== "name,description") {
  failures.push("SKILL.md frontmatter must contain only name and description");
}
if (!/^name: gigatable$/m.test(frontmatter)) {
  failures.push("SKILL.md name must be gigatable");
}
const description = /^description: (.+)$/m.exec(frontmatter)?.[1] ?? "";
if (!description || description.length > 1024) {
  failures.push("SKILL.md description must contain 1-1024 characters");
}
if (skill.split("\n").length > 500) {
  failures.push("SKILL.md must stay under 500 lines");
}
if (/TODO|\[TODO/.test(skill)) {
  failures.push("SKILL.md contains unfinished TODO text");
}

const requiredReferences = [
  "selection-guide.md",
  "getting-started.md",
  "editing-and-data.md",
  "spreadsheet-features.md",
  "customization-and-performance.md",
  "custom-cell-components.md",
  "api-reference.md",
];
for (const reference of requiredReferences) {
  const referencePath = path.join(skillDirectory, "references", reference);
  if (!fs.existsSync(referencePath)) {
    failures.push(`Missing reference: ${reference}`);
  }
  if (!skill.includes(`references/${reference}`)) {
    failures.push(`SKILL.md does not route to ${reference}`);
  }
}

const skillFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(entryPath);
    } else if (entry.name === "SKILL.md") {
      skillFiles.push(entryPath);
    }
  }
}
walk(path.join(root, "skills"));
if (skillFiles.length !== 1 || skillFiles[0] !== skillPath) {
  failures.push(`Expected exactly one skill, found ${skillFiles.length}`);
}

const openaiYaml = fs.readFileSync(
  path.join(skillDirectory, "agents/openai.yaml"),
  "utf8",
);
for (const field of ["display_name", "short_description", "default_prompt"]) {
  if (!new RegExp(`^  ${field}: ".+"$`, "m").test(openaiYaml)) {
    failures.push(`agents/openai.yaml is missing ${field}`);
  }
}
if (!openaiYaml.includes("$gigatable")) {
  failures.push("agents/openai.yaml default prompt must mention $gigatable");
}

const registry = readRegistry();
try {
  validateRegistry(registry);
} catch (error) {
  failures.push(error.message);
}
const digest = registryDigest(registry);
const release = readRelease();
for (const installer of [
  "scripts/install-gigatable-skill.sh",
  "scripts/install-gigatable-skill.ps1",
]) {
  const content = fs.readFileSync(path.join(root, installer), "utf8");
  if (!content.includes(digest)) {
    failures.push(`${installer} does not match agents.json`);
  }
  if (!content.includes(release.version)) {
    failures.push(`${installer} does not match release.json`);
  }
  for (const agent of registry.agents) {
    if (!content.includes(`${agent.id}|${agent.displayName}|`)) {
      failures.push(`${installer} is missing ${agent.id}`);
    }
  }
}

const shellSyntax = spawnSync(
  "bash",
  ["-n", path.join(root, "scripts/install-gigatable-skill.sh")],
  { encoding: "utf8" },
);
if (shellSyntax.status !== 0) {
  failures.push(`Shell syntax failed: ${shellSyntax.stderr}`);
}

if (!/^skills-v\d+\.\d+\.\d+$/.test(release.version)) {
  failures.push("release.json must use an independent skills-vX.Y.Z version");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(
  `Validated gigatable skill, ${registry.agents.length} agents, and both installers`,
);
