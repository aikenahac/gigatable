#!/bin/sh

set -eu

SKILL_RELEASE_VERSION="skills-v1.0.0"
REGISTRY_DIGEST="37f082488fbdb6213d2bcd846ce0f9647973b963b298a90262d161b846089572"
REPOSITORY="aikenahac/gigatable"
SKILL_NAME="gigatable"
SCOPE=""
AGENTS=""
ASSUME_YES=0
LIST_AGENTS=0
TMP_DIR=""

fail() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

cleanup() {
  if [ -n "$TMP_DIR" ] && [ -d "$TMP_DIR" ]; then
    rm -rf "$TMP_DIR"
  fi
}

usage() {
  cat <<'EOF'
Install the Gigatable agent skill.

Usage:
  install-gigatable-skill.sh [options]

Options:
  --agents <ids>     Comma-separated agent IDs, "detected", or "all"
  --scope <scope>    "local" (current directory) or "global"
  --version <tag>    Skill release tag (default: embedded reviewed release)
  --list-agents      Print supported agents and resolved paths
  --yes              Skip the final confirmation
  --help             Show this help
EOF
}

agent_data() {
  cat <<'AGENT_DATA' | sed '/^#/d'
# BEGIN GENERATED AGENTS
aider-desk|AiderDesk|.aider-desk/skills|home|.aider-desk/skills||
amp|Amp|.agents/skills|xdg-config|agents/skills||
antigravity|Antigravity|.agents/skills|home|.gemini/antigravity/skills||
antigravity-cli|Antigravity CLI|.agents/skills|home|.gemini/antigravity-cli/skills||
astrbot|AstrBot|data/skills|home|.astrbot/data/skills||
autohand-code|Autohand Code CLI|.autohand/skills|environment-home|skills|AUTOHAND_HOME|.autohand
augment|Augment|.augment/skills|home|.augment/skills||
bob|IBM Bob|.bob/skills|home|.bob/skills||
claude-code|Claude Code|.claude/skills|environment-home|skills|CLAUDE_CONFIG_DIR|.claude
openclaw|OpenClaw|skills|openclaw|skills||
cline|Cline|.agents/skills|home|.agents/skills||
codearts-agent|CodeArts Agent|.codeartsdoer/skills|home|.codeartsdoer/skills||
codebuddy|CodeBuddy|.codebuddy/skills|home|.codebuddy/skills||
codemaker|Codemaker|.codemaker/skills|home|.codemaker/skills||
codestudio|Code Studio|.codestudio/skills|home|.codestudio/skills||
codex|Codex|.agents/skills|environment-home|skills|CODEX_HOME|.codex
command-code|Command Code|.commandcode/skills|home|.commandcode/skills||
continue|Continue|.continue/skills|home|.continue/skills||
cortex|Cortex Code|.cortex/skills|home|.snowflake/cortex/skills||
crush|Crush|.crush/skills|home|.config/crush/skills||
cursor|Cursor|.agents/skills|home|.cursor/skills||
deepagents|Deep Agents|.agents/skills|home|.deepagents/agent/skills||
devin|Devin for Terminal|.devin/skills|xdg-config|devin/skills||
dexto|Dexto|.agents/skills|home|.agents/skills||
droid|Droid|.factory/skills|home|.factory/skills||
eve|Eve|agent/skills||||
firebender|Firebender|.agents/skills|home|.firebender/skills||
forgecode|ForgeCode|.forge/skills|home|.forge/skills||
gemini-cli|Gemini CLI|.agents/skills|home|.gemini/skills||
github-copilot|GitHub Copilot|.agents/skills|home|.copilot/skills||
goose|Goose|.goose/skills|xdg-config|goose/skills||
grok|Grok Build|.grok/skills|environment-home|skills|GROK_HOME|.grok
hermes-agent|Hermes Agent|.hermes/skills|environment-home|skills|HERMES_HOME|.hermes
inference-sh|inference.sh|.inferencesh/skills|home|.inferencesh/skills||
jazz|Jazz|.jazz/skills|home|.jazz/skills||
junie|Junie|.junie/skills|home|.junie/skills||
iflow-cli|iFlow CLI|.iflow/skills|home|.iflow/skills||
kilo|Kilo Code|.kilocode/skills|home|.kilocode/skills||
kimchi|Kimchi|.kimchi/skills|home|.config/kimchi/harness/skills||
kimi-code-cli|Kimi Code CLI|.agents/skills|home|.agents/skills||
kiro-cli|Kiro CLI|.kiro/skills|home|.kiro/skills||
kode|Kode|.kode/skills|home|.kode/skills||
lingma|Lingma|.lingma/skills|home|.lingma/skills||
loaf|Loaf|.agents/skills|home|.agents/skills||
mcpjam|MCPJam|.mcpjam/skills|home|.mcpjam/skills||
mistral-vibe|Mistral Vibe|.vibe/skills|environment-home|skills|VIBE_HOME|.vibe
moxby|Moxby|.moxby/skills|home|.moxby/skills||
mux|Mux|.mux/skills|home|.mux/skills||
opencode|OpenCode|.agents/skills|xdg-config|opencode/skills||
openhands|OpenHands|.openhands/skills|home|.openhands/skills||
ona|Ona|.ona/skills|home|.ona/skills||
pi|Pi|.pi/skills|home|.pi/agent/skills||
qoder|Qoder|.qoder/skills|home|.qoder/skills||
qoder-cn|Qoder CN|.qoder/skills|home|.qoder-cn/skills||
qwen-code|Qwen Code|.qwen/skills|home|.qwen/skills||
replit|Replit|.agents/skills|xdg-config|agents/skills||
reasonix|Reasonix|.reasonix/skills|home|.reasonix/skills||
rovodev|Rovo Dev|.rovodev/skills|home|.rovodev/skills||
roo|Roo Code|.roo/skills|home|.roo/skills||
tabnine-cli|Tabnine CLI|.tabnine/agent/skills|home|.tabnine/agent/skills||
terramind|Terramind|.terramind/skills|home|.terramind/skills||
tinycloud|Tinycloud|.tinycloud/skills|home|.tinycloud/skills||
trae|Trae|.trae/skills|home|.trae/skills||
trae-cn|Trae CN|.trae/skills|home|.trae-cn/skills||
warp|Warp|.agents/skills|home|.agents/skills||
windsurf|Windsurf|.windsurf/skills|home|.codeium/windsurf/skills||
zed|Zed|.agents/skills|home|.agents/skills||
zcode|ZCode|.zcode/skills|home|.zcode/skills||
zencoder|Zencoder|.zencoder/skills|home|.zencoder/skills||
zenflow|Zenflow|.zencoder/skills|home|.zencoder/skills||
neovate|Neovate|.neovate/skills|home|.neovate/skills||
pochi|Pochi|.pochi/skills|home|.pochi/skills||
promptscript|PromptScript|.agents/skills||||
adal|AdaL|.adal/skills|home|.adal/skills||
universal|Universal|.agents/skills|xdg-config|agents/skills||
# END GENERATED AGENTS
AGENT_DATA
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --agents)
      [ "$#" -ge 2 ] || fail "--agents requires a value"
      AGENTS=$2
      shift 2
      ;;
    --scope)
      [ "$#" -ge 2 ] || fail "--scope requires a value"
      SCOPE=$2
      shift 2
      ;;
    --version)
      [ "$#" -ge 2 ] || fail "--version requires a value"
      SKILL_RELEASE_VERSION=$2
      shift 2
      ;;
    --list-agents)
      LIST_AGENTS=1
      shift
      ;;
    --yes)
      ASSUME_YES=1
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      fail "Unknown option: $1"
      ;;
  esac
done

case "$SKILL_RELEASE_VERSION" in
  skills-v[0-9]*.[0-9]*.[0-9]*) ;;
  *) fail "Version must look like skills-v1.0.0" ;;
esac

resolve_environment_home() {
  environment_name=$1
  fallback=$2
  environment_value=$(printenv "$environment_name" 2>/dev/null || true)
  if [ -n "$environment_value" ]; then
    printf '%s\n' "$environment_value"
  else
    printf '%s/%s\n' "${HOME:?HOME is required}" "$fallback"
  fi
}

resolve_openclaw_home() {
  for directory in .openclaw .clawdbot .moltbot; do
    if [ -d "${HOME:?HOME is required}/$directory" ]; then
      printf '%s/%s\n' "$HOME" "$directory"
      return
    fi
  done
  printf '%s/.openclaw\n' "$HOME"
}

resolve_global_base() {
  base_type=$1
  environment_name=$2
  fallback=$3
  case "$base_type" in
    home)
      printf '%s\n' "${HOME:?HOME is required}"
      ;;
    xdg-config)
      printf '%s\n' "${XDG_CONFIG_HOME:-${HOME:?HOME is required}/.config}"
      ;;
    environment-home)
      resolve_environment_home "$environment_name" "$fallback"
      ;;
    openclaw)
      resolve_openclaw_home
      ;;
    "")
      return 1
      ;;
    *)
      fail "Unsupported global path base: $base_type"
      ;;
  esac
}

get_agent_row() {
  agent_data | awk -F '|' -v requested="$1" '$1 == requested { print; exit }'
}

resolve_agent_directory() {
  row_value=$1
  requested_scope=$2
  old_ifs=$IFS
  IFS='|'
  set -- $row_value
  IFS=$old_ifs
  project_path=${3-}
  global_base=${4-}
  global_path=${5-}
  environment_name=${6-}
  fallback=${7-}

  if [ "$requested_scope" = "local" ]; then
    printf '%s/%s\n' "$PWD" "$project_path"
    return
  fi
  [ -n "$global_base" ] || return 1
  base_path=$(resolve_global_base "$global_base" "$environment_name" "$fallback")
  printf '%s/%s\n' "${base_path%/}" "$global_path"
}

print_agents() {
  printf '%-22s %-24s %-30s %s\n' "ID" "AGENT" "PROJECT PATH" "GLOBAL PATH"
  agent_data | while IFS='|' read -r id display project base global_path environment fallback; do
    [ -n "$id" ] || continue
    if [ -n "$base" ]; then
      base_path=$(resolve_global_base "$base" "$environment" "$fallback")
      resolved_global="${base_path%/}/$global_path"
    else
      resolved_global="project-only"
    fi
    printf '%-22s %-24s %-30s %s\n' "$id" "$display" "$project" "$resolved_global"
  done
}

if [ "$LIST_AGENTS" -eq 1 ]; then
  print_agents
  exit 0
fi

case "$SCOPE" in
  "")
    [ -r /dev/tty ] || fail "Use --scope local|global in non-interactive mode"
    printf 'Install locally in the current project or globally? [local/global] ' >/dev/tty
    IFS= read -r SCOPE </dev/tty
    SCOPE=${SCOPE:-local}
    ;;
  local|global) ;;
  *) fail "--scope must be local or global" ;;
esac

TMP_DIR=$(mktemp -d 2>/dev/null || mktemp -d -t gigatable-skill)
trap cleanup EXIT HUP INT TERM
DETECTED_FILE="$TMP_DIR/detected"
: >"$DETECTED_FILE"

agent_data | while IFS='|' read -r id display project base global_path environment fallback; do
  [ -n "$id" ] || continue
  if [ "$SCOPE" = "local" ]; then
    candidate="$PWD/$project"
  elif [ -n "$base" ]; then
    base_path=$(resolve_global_base "$base" "$environment" "$fallback")
    candidate="${base_path%/}/$global_path"
  else
    continue
  fi
  if [ -d "$candidate" ]; then
    printf '%s\n' "$id" >>"$DETECTED_FILE"
  fi
done

if [ -z "$AGENTS" ]; then
  [ -r /dev/tty ] || fail "Use --agents <ids>|detected|all in non-interactive mode"
  print_agents >/dev/tty
  detected=$(paste -sd, "$DETECTED_FILE" 2>/dev/null || true)
  if [ -n "$detected" ]; then
    printf '\nDetected: %s\n' "$detected" >/dev/tty
  fi
  printf 'Choose comma-separated agent IDs, "detected", or "all": ' >/dev/tty
  IFS= read -r AGENTS </dev/tty
fi

AGENTS=$(printf '%s' "$AGENTS" | tr -d '[:space:]')
[ -n "$AGENTS" ] || fail "No agents selected"
if [ "$AGENTS" = "all" ]; then
  AGENTS=$(agent_data | awk -F '|' 'NF { ids = ids (ids ? "," : "") $1 } END { print ids }')
elif [ "$AGENTS" = "detected" ]; then
  AGENTS=$(paste -sd, "$DETECTED_FILE" 2>/dev/null || true)
  [ -n "$AGENTS" ] || fail "No installed agents were detected for $SCOPE scope"
fi

TARGETS_FILE="$TMP_DIR/targets"
: >"$TARGETS_FILE"
old_ifs=$IFS
IFS=','
set -- $AGENTS
IFS=$old_ifs
for id in "$@"; do
  row_value=$(get_agent_row "$id")
  [ -n "$row_value" ] || fail "Unknown agent: $id"
  if ! agent_directory=$(resolve_agent_directory "$row_value" "$SCOPE"); then
    fail "$id supports project-local installation only"
  fi
  destination="${agent_directory%/}/$SKILL_NAME"
  case "$destination" in
    *'
'*) fail "Unsafe destination for $id" ;;
  esac
  if ! awk -F '|' -v destination="$destination" '$2 == destination { found = 1 } END { exit !found }' "$TARGETS_FILE"; then
    printf '%s|%s\n' "$id" "$destination" >>"$TARGETS_FILE"
  fi
done

printf 'Gigatable skill %s will be installed to:\n' "$SKILL_RELEASE_VERSION"
while IFS='|' read -r id destination; do
  printf '  %-22s %s\n' "$id" "$destination"
done <"$TARGETS_FILE"

if [ "$ASSUME_YES" -ne 1 ]; then
  [ -r /dev/tty ] || fail "Use --yes in non-interactive mode"
  printf 'Continue? [y/N] ' >/dev/tty
  IFS= read -r confirmation </dev/tty
  case "$confirmation" in
    y|Y|yes|YES) ;;
    *) printf 'Cancelled.\n'; exit 0 ;;
  esac
fi

ARCHIVE="$TMP_DIR/gigatable-skill.zip"
CHECKSUMS="$TMP_DIR/SHA256SUMS"
if [ -n "${GIGATABLE_SKILL_ARCHIVE:-}" ]; then
  cp "$GIGATABLE_SKILL_ARCHIVE" "$ARCHIVE"
  [ -n "${GIGATABLE_SKILL_CHECKSUMS:-}" ] ||
    fail "GIGATABLE_SKILL_CHECKSUMS is required with a local archive"
  cp "$GIGATABLE_SKILL_CHECKSUMS" "$CHECKSUMS"
else
  command -v curl >/dev/null 2>&1 || fail "curl is required"
  release_base=${GIGATABLE_SKILL_RELEASE_BASE_URL:-"https://github.com/$REPOSITORY/releases/download/$SKILL_RELEASE_VERSION"}
  curl -fsSL "$release_base/gigatable-skill.zip" -o "$ARCHIVE"
  curl -fsSL "$release_base/SHA256SUMS" -o "$CHECKSUMS"
fi

expected_hash=$(awk '$2 == "gigatable-skill.zip" || $2 == "*gigatable-skill.zip" { print $1; exit }' "$CHECKSUMS")
[ -n "$expected_hash" ] || fail "SHA256SUMS does not contain gigatable-skill.zip"
if command -v sha256sum >/dev/null 2>&1; then
  actual_hash=$(sha256sum "$ARCHIVE" | awk '{print $1}')
elif command -v shasum >/dev/null 2>&1; then
  actual_hash=$(shasum -a 256 "$ARCHIVE" | awk '{print $1}')
elif command -v openssl >/dev/null 2>&1; then
  actual_hash=$(openssl dgst -sha256 "$ARCHIVE" | awk '{print $NF}')
else
  fail "A SHA-256 tool (sha256sum, shasum, or openssl) is required"
fi
[ "$actual_hash" = "$expected_hash" ] || fail "Checksum verification failed"

command -v unzip >/dev/null 2>&1 || fail "unzip is required"
ARCHIVE_LISTING="$TMP_DIR/archive-listing"
unzip -Z1 "$ARCHIVE" >"$ARCHIVE_LISTING" ||
  fail "Could not inspect the skill archive"
awk '
  BEGIN { skill = 0; valid = 1 }
  {
    if ($0 == "gigatable/SKILL.md") skill += 1
    if ($0 !~ /^gigatable\// || $0 ~ /(^|\/)\.\.(\/|$)/ || $0 ~ /^\// || index($0, "\\") > 0) valid = 0
  }
  END { exit !(valid && skill == 1) }
' "$ARCHIVE_LISTING" || fail "Archive contains files outside one gigatable skill folder"
EXTRACTED="$TMP_DIR/extracted"
mkdir -p "$EXTRACTED"
unzip -q "$ARCHIVE" -d "$EXTRACTED"
SOURCE_DIR="$EXTRACTED/$SKILL_NAME"
[ -f "$SOURCE_DIR/SKILL.md" ] || fail "Archive does not contain gigatable/SKILL.md"

timestamp=$(date -u +%Y%m%d%H%M%S)
while IFS='|' read -r id destination; do
  parent=$(dirname "$destination")
  mkdir -p "$parent"
  stage="${destination}.tmp.$$"
  backup=""
  rm -rf "$stage"
  cp -R "$SOURCE_DIR" "$stage"
  if [ -e "$destination" ] || [ -L "$destination" ]; then
    backup="${destination}.backup-${timestamp}-$$"
    mv "$destination" "$backup"
  fi
  if ! mv "$stage" "$destination"; then
    [ -n "$backup" ] && mv "$backup" "$destination"
    fail "Could not install to $destination"
  fi
  if [ -n "$backup" ]; then
    printf 'Installed %s (backup: %s)\n' "$destination" "$backup"
  else
    printf 'Installed %s\n' "$destination"
  fi
done <"$TARGETS_FILE"

printf 'Done. Restart or reload the selected agent if it does not discover the skill immediately.\n'
