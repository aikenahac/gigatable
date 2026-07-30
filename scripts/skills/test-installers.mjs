import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { after, before, test } from "node:test";
import {
  readRegistry,
  registryDigest,
  resolveAgentDirectory,
  validateRegistry,
} from "./registry.mjs";

const root = path.resolve(".");
const shellInstaller = path.join(root, "scripts/install-gigatable-skill.sh");
const powershellInstaller = path.join(
  root,
  "scripts/install-gigatable-skill.ps1",
);
const outputDirectory = path.join(root, "dist/skills");
const temporaryDirectories = [];

function temporaryDirectory(label) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), `${label}-`));
  temporaryDirectories.push(directory);
  return directory;
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: options.cwd ?? root,
    env: options.env ?? process.env,
    encoding: "utf8",
  });
}

function packageAssets() {
  const result = run("node", ["scripts/skills/package.mjs"]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

function install({
  cwd,
  home,
  agents,
  scope = "local",
  checksums,
  environment = {},
}) {
  return run(
    "sh",
    [shellInstaller, "--scope", scope, "--agents", agents, "--yes"],
    {
      cwd,
      env: {
        ...process.env,
        HOME: home,
        GIGATABLE_SKILL_ARCHIVE: path.join(
          outputDirectory,
          "gigatable-skill.zip",
        ),
        GIGATABLE_SKILL_CHECKSUMS:
          checksums ?? path.join(outputDirectory, "SHA256SUMS"),
        ...environment,
      },
    },
  );
}

function sha256(filePath) {
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(filePath))
    .digest("hex");
}

before(() => {
  packageAssets();
});

after(() => {
  for (const directory of temporaryDirectories) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("the tracked registry contains valid paths for every upstream agent", () => {
  const registry = readRegistry();
  assert.doesNotThrow(() => validateRegistry(registry));
  assert.equal(registry.agents.length, 75);
  assert.equal(new Set(registry.agents.map((agent) => agent.id)).size, 75);
  assert.deepEqual(
    registry.agents.filter((agent) => !agent.global).map((agent) => agent.id),
    ["eve", "promptscript"],
  );
});

test("environment and XDG overrides resolve global paths", () => {
  const registry = readRegistry();
  const home = "/tmp/gigatable-test-home";
  const codex = registry.agents.find((agent) => agent.id === "codex");
  const opencode = registry.agents.find((agent) => agent.id === "opencode");
  assert.equal(
    resolveAgentDirectory(codex, "global", {
      home,
      environment: { HOME: home, CODEX_HOME: "/tmp/custom-codex" },
    }),
    "/tmp/custom-codex/skills",
  );
  assert.equal(
    resolveAgentDirectory(opencode, "global", {
      home,
      environment: { HOME: home, XDG_CONFIG_HOME: "/tmp/custom-config" },
    }),
    "/tmp/custom-config/opencode/skills",
  );
});

test("both installers contain the same generated registry digest and agents", () => {
  const registry = readRegistry();
  const digest = registryDigest(registry);
  for (const installer of [shellInstaller, powershellInstaller]) {
    const content = fs.readFileSync(installer, "utf8");
    assert.match(content, new RegExp(digest));
    for (const agent of registry.agents) {
      assert.ok(content.includes(`${agent.id}|${agent.displayName}|`));
    }
  }
});

test("packaging is deterministic and ZIP contains one valid skill folder", () => {
  const archive = path.join(outputDirectory, "gigatable-skill.zip");
  const firstHash = sha256(archive);
  packageAssets();
  assert.equal(sha256(archive), firstHash);

  const listing = run("unzip", ["-Z1", archive]);
  assert.equal(listing.status, 0, listing.stderr);
  const entries = listing.stdout.trim().split("\n");
  assert.ok(entries.includes("gigatable/SKILL.md"));
  assert.ok(entries.every((entry) => entry.startsWith("gigatable/")));
  assert.equal(
    entries.filter((entry) => entry.endsWith("/SKILL.md")).length,
    1,
  );
});

test("local install deduplicates universal paths and installs dedicated paths", () => {
  const project = temporaryDirectory("gigatable-project");
  const home = temporaryDirectory("gigatable-home");
  const result = install({
    cwd: project,
    home,
    agents: "codex,cursor,claude-code",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.ok(
    fs.existsSync(path.join(project, ".agents/skills/gigatable/SKILL.md")),
  );
  assert.ok(
    fs.existsSync(path.join(project, ".claude/skills/gigatable/SKILL.md")),
  );
  assert.equal((result.stdout.match(/^Installed /gm) ?? []).length, 2);
});

test("global install honors CODEX_HOME", () => {
  const project = temporaryDirectory("gigatable-project");
  const home = temporaryDirectory("gigatable-home");
  const codexHome = path.join(home, "custom-codex");
  const result = install({
    cwd: project,
    home,
    agents: "codex",
    scope: "global",
    environment: { CODEX_HOME: codexHome },
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.ok(fs.existsSync(path.join(codexHome, "skills/gigatable/SKILL.md")));
});

test("project-only agents fail cleanly in global scope", () => {
  const project = temporaryDirectory("gigatable-project");
  const home = temporaryDirectory("gigatable-home");
  const result = install({
    cwd: project,
    home,
    agents: "eve",
    scope: "global",
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /project-local installation only/);
});

test("reinstallation keeps a timestamped backup", () => {
  const project = temporaryDirectory("gigatable-project");
  const home = temporaryDirectory("gigatable-home");
  const first = install({ cwd: project, home, agents: "codex" });
  assert.equal(first.status, 0, first.stderr || first.stdout);
  const destination = path.join(project, ".agents/skills/gigatable");
  fs.writeFileSync(path.join(destination, "user-note.txt"), "preserve me\n");

  const second = install({ cwd: project, home, agents: "codex" });
  assert.equal(second.status, 0, second.stderr || second.stdout);
  const backups = fs
    .readdirSync(path.dirname(destination))
    .filter((name) => name.startsWith("gigatable.backup-"));
  assert.equal(backups.length, 1);
  assert.equal(
    fs.readFileSync(
      path.join(path.dirname(destination), backups[0], "user-note.txt"),
      "utf8",
    ),
    "preserve me\n",
  );
});

test("checksum failures and invalid agents do not install files", () => {
  const project = temporaryDirectory("gigatable-project");
  const home = temporaryDirectory("gigatable-home");
  const invalidChecksums = path.join(
    temporaryDirectory("gigatable-checksum"),
    "SHA256SUMS",
  );
  fs.writeFileSync(
    invalidChecksums,
    `${"0".repeat(64)}  gigatable-skill.zip\n`,
  );
  const checksumFailure = install({
    cwd: project,
    home,
    agents: "codex",
    checksums: invalidChecksums,
  });
  assert.notEqual(checksumFailure.status, 0);
  assert.match(checksumFailure.stderr, /Checksum verification failed/);
  assert.ok(!fs.existsSync(path.join(project, ".agents/skills/gigatable")));

  const invalidAgent = install({
    cwd: project,
    home,
    agents: "not-an-agent",
  });
  assert.notEqual(invalidAgent.status, 0);
  assert.match(invalidAgent.stderr, /Unknown agent/);
});

test("README and website docs include all installation routes", () => {
  for (const filePath of [
    path.join(root, "README.md"),
    path.join(root, "src/docs/content/agent-skill.md"),
  ]) {
    const content = fs.readFileSync(filePath, "utf8");
    assert.match(
      content,
      /npx skills add aikenahac\/gigatable --skill gigatable/,
    );
    assert.match(content, /install-gigatable-skill\.sh/);
    assert.match(content, /install-gigatable-skill\.ps1/);
    assert.match(content, /gigatable-skill\.zip/);
  }
});

test("PowerShell installer exposes the documented interface", () => {
  const content = fs.readFileSync(powershellInstaller, "utf8");
  for (const parameter of [
    "$Agents",
    "$Scope",
    "$Version",
    "$ListAgents",
    "$Yes",
  ]) {
    assert.ok(content.includes(parameter));
  }

  const command = run("sh", ["-c", "command -v pwsh"]);
  if (command.status === 0) {
    const smoke = run(command.stdout.trim(), [
      "-NoProfile",
      "-File",
      powershellInstaller,
      "-ListAgents",
    ]);
    assert.equal(smoke.status, 0, smoke.stderr || smoke.stdout);
    assert.match(smoke.stdout, /Codex/);
  }
});
