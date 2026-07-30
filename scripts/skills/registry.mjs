import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const registryPath = path.resolve("scripts/skills/agents.json");
export const releasePath = path.resolve("scripts/skills/release.json");

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function readRegistry() {
  return readJson(registryPath);
}

export function readRelease() {
  return readJson(releasePath);
}

export function registryDigest(registry = readRegistry()) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(registry.agents))
    .digest("hex");
}

export function validateRegistry(registry = readRegistry()) {
  const errors = [];
  const ids = new Set();
  const allowedBases = new Set([
    "home",
    "xdg-config",
    "environment-home",
    "openclaw",
  ]);

  for (const agent of registry.agents ?? []) {
    if (!/^[a-z0-9-]+$/.test(agent.id ?? "")) {
      errors.push(`Invalid agent id: ${agent.id}`);
    }
    if (ids.has(agent.id)) {
      errors.push(`Duplicate agent id: ${agent.id}`);
    }
    ids.add(agent.id);
    if (
      !agent.displayName ||
      !agent.projectPath ||
      path.isAbsolute(agent.projectPath)
    ) {
      errors.push(`Invalid project path for ${agent.id}`);
    }
    if (
      agent.projectPath
        ?.split(/[\\/]/)
        .some((part) => part === ".." || part === "")
    ) {
      errors.push(`Unsafe project path for ${agent.id}: ${agent.projectPath}`);
    }
    if (agent.global) {
      if (!allowedBases.has(agent.global.base)) {
        errors.push(
          `Invalid global base for ${agent.id}: ${agent.global.base}`,
        );
      }
      if (!agent.global.path || path.isAbsolute(agent.global.path)) {
        errors.push(`Invalid global path for ${agent.id}`);
      }
      if (
        agent.global.base === "environment-home" &&
        (!/^[A-Z][A-Z0-9_]+$/.test(agent.global.environment ?? "") ||
          !agent.global.fallback)
      ) {
        errors.push(`Invalid environment-home definition for ${agent.id}`);
      }
    }
  }

  if ((registry.agents?.length ?? 0) < 50) {
    errors.push("Registry must contain every upstream skills CLI agent");
  }
  if (errors.length) {
    throw new Error(errors.join("\n"));
  }
}

export function resolveGlobalBase(agent, environment, home) {
  const definition = agent.global;
  if (!definition) {
    return null;
  }
  if (definition.base === "home") {
    return home;
  }
  if (definition.base === "xdg-config") {
    return environment.XDG_CONFIG_HOME || path.join(home, ".config");
  }
  if (definition.base === "environment-home") {
    return (
      environment[definition.environment] ||
      path.join(home, definition.fallback)
    );
  }
  if (definition.base === "openclaw") {
    for (const directory of [".openclaw", ".clawdbot", ".moltbot"]) {
      const candidate = path.join(home, directory);
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
    return path.join(home, ".openclaw");
  }
  throw new Error(`Unknown global base: ${definition.base}`);
}

export function resolveAgentDirectory(agent, scope, options = {}) {
  const cwd = options.cwd ?? process.cwd();
  const home = options.home ?? options.environment?.HOME ?? process.env.HOME;
  const environment = options.environment ?? process.env;
  if (scope === "local") {
    return path.resolve(cwd, agent.projectPath);
  }
  const base = resolveGlobalBase(agent, environment, home);
  return base ? path.resolve(base, agent.global.path) : null;
}
