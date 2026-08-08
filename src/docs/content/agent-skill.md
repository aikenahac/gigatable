---
title: "Agent Skill"
description: "Install the Gigatable agent skill with npx, shell, PowerShell, or a manual ZIP for project-local or global use."
summary: "Install Gigatable development guidance in Codex, Claude Code, Cursor, and other compatible agents."
seoTitle: "Install the Gigatable Agent Skill | Gigatable"
seoDescription: "Install the Gigatable agent skill with npx, shell, PowerShell, or a manual ZIP for project-local or global use."
section: "start"
sectionTitle: "Start"
keywords: ["agent skill","skills cli","codex","claude code","cursor","install"]
audience: "consumer"
---

# Agent Skill

Install the Gigatable agent skill to give compatible coding agents focused guidance for building, customizing, optimizing, and troubleshooting Gigatable in React applications.

The skill is source-controlled in [`skills/gigatable`](https://github.com/aikenahac/gigatable/tree/master/skills/gigatable). It contains a fit-selection workflow plus on-demand references for editing, spreadsheet interactions, composition, performance, and the public API.

## Install With the Skills CLI

The open [`skills` CLI](https://github.com/vercel-labs/skills) detects compatible agents and supports project-local or global installation:

```bash
npx skills add aikenahac/gigatable --skill gigatable
```

Target a specific agent and global scope non-interactively:

```bash
npx skills add aikenahac/gigatable \
  --skill gigatable \
  --agent codex \
  --global \
  --copy \
  --yes
```

Omit `--agent`, `--global`, and `--yes` to choose interactively.

## Install on macOS or Linux

The reviewed release installer asks which agents to target and whether to install into the current project or globally:

```bash
curl -fsSL https://github.com/aikenahac/gigatable/releases/download/skills-v1.0.0/install-gigatable-skill.sh | sh
```

For non-interactive use, download the script and pass explicit options:

```bash
curl -fsSL \
  https://github.com/aikenahac/gigatable/releases/download/skills-v1.0.0/install-gigatable-skill.sh \
  -o install-gigatable-skill.sh

sh install-gigatable-skill.sh \
  --scope global \
  --agents codex,claude-code \
  --yes
```

Use `--list-agents` to see every supported agent and its resolved project and global paths. Use `--version skills-v1.0.0` to install a specific reviewed release.

## Install on Windows

Run the interactive PowerShell installer:

```powershell
irm "https://github.com/aikenahac/gigatable/releases/download/skills-v1.0.0/install-gigatable-skill.ps1" | iex
```

Download it first to pass non-interactive parameters:

```powershell
irm `
  "https://github.com/aikenahac/gigatable/releases/download/skills-v1.0.0/install-gigatable-skill.ps1" `
  -OutFile "install-gigatable-skill.ps1"

.\install-gigatable-skill.ps1 `
  -Scope Global `
  -Agents "codex","claude-code" `
  -Yes
```

Use `-ListAgents` to inspect destinations and `-Version skills-v1.0.0` to select an immutable release.

## Download the Skill Folder

Download [`gigatable-skill.zip`](https://github.com/aikenahac/gigatable/releases/download/skills-v1.0.0/gigatable-skill.zip), verify it against the release `SHA256SUMS`, and extract it. The archive contains one ready-to-install `gigatable/` folder.

Copy that folder below an agent's skills directory. Examples:

| Agent and scope              | Destination                   |
| ---------------------------- | ----------------------------- |
| Universal project location   | `.agents/skills/gigatable/`   |
| Claude Code project location | `.claude/skills/gigatable/`   |
| Codex global location        | `~/.codex/skills/gigatable/`  |
| Claude Code global location  | `~/.claude/skills/gigatable/` |

The installers contain the complete current agent registry and are the easiest way to resolve less common paths.

## Installer Safety

Both fallback installers:

- download an immutable `skills-vX.Y.Z` release;
- verify `gigatable-skill.zip` against `SHA256SUMS`;
- validate the archive before copying;
- deduplicate agents that share a skills directory;
- stage the new skill before moving it into place;
- retain an existing installation as a timestamped backup.

Reload or restart the selected agent if it does not discover the skill immediately.
