import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const DEFAULT_SOURCE =
  "https://raw.githubusercontent.com/vercel-labs/skills/main/src/agents.ts";
const OUTPUT_PATH = path.resolve("scripts/skills/agents.json");

const environmentHomes = {
  autohandHome: { environment: "AUTOHAND_HOME", fallback: ".autohand" },
  claudeHome: { environment: "CLAUDE_CONFIG_DIR", fallback: ".claude" },
  codexHome: { environment: "CODEX_HOME", fallback: ".codex" },
  grokHome: { environment: "GROK_HOME", fallback: ".grok" },
  hermesHome: { environment: "HERMES_HOME", fallback: ".hermes" },
  vibeHome: { environment: "VIBE_HOME", fallback: ".vibe" },
};

function parseArguments(argv) {
  const options = { source: DEFAULT_SOURCE, revision: "main" };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--source") {
      options.source = argv[++index];
    } else if (argument === "--revision") {
      options.revision = argv[++index];
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  return options;
}

async function readSource(source) {
  if (/^https:\/\//.test(source)) {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Failed to download ${source}: HTTP ${response.status}`);
    }
    return response.text();
  }
  return fs.readFile(path.resolve(source), "utf8");
}

function parseJoinArguments(expression) {
  const match = /^join\((.*)\)$/.exec(expression);
  if (!match) {
    return null;
  }
  const argumentsList = match[1]
    .split(",")
    .map((part) => part.trim().replace(/^['"]|['"]$/g, ""));
  return {
    base: argumentsList[0],
    suffix: argumentsList.slice(1).join("/"),
  };
}

function normalizeGlobal(expression) {
  if (expression === "undefined") {
    return null;
  }
  if (expression === "getOpenClawGlobalSkillsDir()") {
    return { base: "openclaw", path: "skills" };
  }

  const joined = parseJoinArguments(expression);
  if (!joined) {
    throw new Error(`Unsupported globalSkillsDir expression: ${expression}`);
  }
  if (joined.base === "home") {
    return { base: "home", path: joined.suffix };
  }
  if (joined.base === "configHome") {
    return { base: "xdg-config", path: joined.suffix };
  }
  const environmentHome = environmentHomes[joined.base];
  if (environmentHome) {
    return {
      base: "environment-home",
      environment: environmentHome.environment,
      fallback: environmentHome.fallback,
      path: joined.suffix,
    };
  }
  throw new Error(`Unsupported globalSkillsDir base: ${joined.base}`);
}

function parseAgents(source) {
  const declaration = source.indexOf("export const agents:");
  const end = source.indexOf("\n};", declaration);
  if (declaration < 0 || end < 0) {
    throw new Error("Could not find the agents registry declaration");
  }

  const registrySource = source.slice(declaration, end);
  const blockPattern = /^  (?:'([^']+)'|([a-z0-9-]+)): \{\n([\s\S]*?)^  \},/gm;
  const agents = [];
  for (const match of registrySource.matchAll(blockPattern)) {
    const id = match[1] ?? match[2];
    const body = match[3];
    const name = /name: '([^']+)'/.exec(body)?.[1];
    const displayName = /displayName: '([^']+)'/.exec(body)?.[1];
    const projectPath = /skillsDir: '([^']+)'/.exec(body)?.[1];
    const globalExpression = /globalSkillsDir: ([^,\n]+(?:,[^)\n]+)*\)?)/.exec(
      body,
    )?.[1];

    if (
      !name ||
      name !== id ||
      !displayName ||
      !projectPath ||
      !globalExpression
    ) {
      throw new Error(`Could not parse complete agent definition for ${id}`);
    }

    agents.push({
      id,
      displayName,
      projectPath,
      global: normalizeGlobal(globalExpression.trim()),
    });
  }

  if (agents.length < 50) {
    throw new Error(
      `Parsed only ${agents.length} agents; upstream format may have changed`,
    );
  }
  return agents;
}

const options = parseArguments(process.argv.slice(2));
const source = await readSource(options.source);
const agents = parseAgents(source);
const registry = {
  source: {
    url: DEFAULT_SOURCE,
    revision: options.revision,
  },
  agents,
};

await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(registry, null, 2)}\n`);
console.log(
  `Synced ${agents.length} agents to ${path.relative(process.cwd(), OUTPUT_PATH)}`,
);
