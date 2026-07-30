import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {
  readRegistry,
  readRelease,
  registryDigest,
  validateRegistry,
} from "./registry.mjs";

const check = process.argv.includes("--check");
const registry = readRegistry();
const release = readRelease();
validateRegistry(registry);

function row(agent) {
  const global = agent.global ?? {};
  return [
    agent.id,
    agent.displayName,
    agent.projectPath,
    global.base ?? "",
    global.path ?? "",
    global.environment ?? "",
    global.fallback ?? "",
  ].join("|");
}

function update(filePath, replacements) {
  let content = fs.readFileSync(filePath, "utf8");
  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }

  if (check) {
    const current = fs.readFileSync(filePath, "utf8");
    if (content !== current) {
      throw new Error(`${path.relative(process.cwd(), filePath)} is stale`);
    }
    return;
  }
  fs.writeFileSync(filePath, content);
}

const rows = registry.agents.map(row).join("\n");
const digest = registryDigest(registry);

update(path.resolve("scripts/install-gigatable-skill.sh"), [
  [
    /^SKILL_RELEASE_VERSION=".*"$/m,
    `SKILL_RELEASE_VERSION="${release.version}"`,
  ],
  [/^REGISTRY_DIGEST=".*"$/m, `REGISTRY_DIGEST="${digest}"`],
  [
    /# BEGIN GENERATED AGENTS\n[\s\S]*?# END GENERATED AGENTS/,
    `# BEGIN GENERATED AGENTS\n${rows}\n# END GENERATED AGENTS`,
  ],
]);

update(path.resolve("scripts/install-gigatable-skill.ps1"), [
  [
    /^\$SkillReleaseVersion = ".*"$/m,
    `$SkillReleaseVersion = "${release.version}"`,
  ],
  [/^\$RegistryDigest = ".*"$/m, `$RegistryDigest = "${digest}"`],
  [
    /# BEGIN GENERATED AGENTS\n[\s\S]*?# END GENERATED AGENTS/,
    `# BEGIN GENERATED AGENTS\n${rows}\n# END GENERATED AGENTS`,
  ],
]);

console.log(
  `${check ? "Checked" : "Generated"} installers for ${registry.agents.length} agents`,
);
