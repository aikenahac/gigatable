[CmdletBinding()]
param(
  [string[]]$Agents,
  [ValidateSet("Local", "Global")]
  [string]$Scope,
  [string]$Version = "",
  [switch]$ListAgents,
  [switch]$Yes
)

$ErrorActionPreference = "Stop"
$SkillReleaseVersion = "skills-v1.0.0"
$RegistryDigest = "37f082488fbdb6213d2bcd846ce0f9647973b963b298a90262d161b846089572"
$Repository = "aikenahac/gigatable"
$SkillName = "gigatable"

if ($Version) {
  $SkillReleaseVersion = $Version
}
if ($SkillReleaseVersion -notmatch "^skills-v\d+\.\d+\.\d+$") {
  throw "Version must look like skills-v1.0.0"
}

$AgentDataText = @'
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
'@

$AgentRegistry = $AgentDataText -split "\r?\n" |
  Where-Object { $_ -and -not $_.StartsWith("#") } |
  ConvertFrom-Csv -Delimiter "|" -Header @(
    "Id",
    "DisplayName",
    "ProjectPath",
    "GlobalBase",
    "GlobalPath",
    "Environment",
    "Fallback"
  )

function Get-UserHome {
  $value = [Environment]::GetFolderPath([Environment+SpecialFolder]::UserProfile)
  if (-not $value) {
    $value = $HOME
  }
  if (-not $value) {
    throw "Could not resolve the user home directory"
  }
  return $value
}

function Get-GlobalBase([pscustomobject]$Agent) {
  $userHome = Get-UserHome
  switch ($Agent.GlobalBase) {
    "home" {
      return $userHome
    }
    "xdg-config" {
      $xdg = [Environment]::GetEnvironmentVariable("XDG_CONFIG_HOME")
      if ($xdg) {
        return $xdg
      }
      return Join-Path $userHome ".config"
    }
    "environment-home" {
      $configured = [Environment]::GetEnvironmentVariable($Agent.Environment)
      if ($configured) {
        return $configured
      }
      return Join-Path $userHome $Agent.Fallback
    }
    "openclaw" {
      foreach ($directory in @(".openclaw", ".clawdbot", ".moltbot")) {
        $candidate = Join-Path $userHome $directory
        if (Test-Path -LiteralPath $candidate -PathType Container) {
          return $candidate
        }
      }
      return Join-Path $userHome ".openclaw"
    }
    "" {
      return $null
    }
    default {
      throw "Unsupported global path base: $($Agent.GlobalBase)"
    }
  }
}

function Get-AgentDirectory(
  [pscustomobject]$Agent,
  [string]$RequestedScope
) {
  if ($RequestedScope -eq "Local") {
    return [IO.Path]::GetFullPath(
      (Join-Path (Get-Location).Path $Agent.ProjectPath)
    )
  }
  $base = Get-GlobalBase $Agent
  if (-not $base) {
    return $null
  }
  return [IO.Path]::GetFullPath((Join-Path $base $Agent.GlobalPath))
}

function Show-AgentTable {
  $rows = foreach ($agent in $AgentRegistry) {
    $global = Get-AgentDirectory $agent "Global"
    [pscustomobject]@{
      ID = $agent.Id
      Agent = $agent.DisplayName
      "Project path" = $agent.ProjectPath
      "Global path" = if ($global) { $global } else { "project-only" }
    }
  }
  $rows | Format-Table -AutoSize | Out-Host
}

if ($ListAgents) {
  Show-AgentTable
  return
}

if (-not $Scope) {
  $scopeAnswer = Read-Host "Install locally in the current project or globally? [local/global]"
  if (-not $scopeAnswer) {
    $scopeAnswer = "local"
  }
  if ($scopeAnswer -notin @("local", "global")) {
    throw "Scope must be local or global"
  }
  $Scope = (Get-Culture).TextInfo.ToTitleCase($scopeAnswer)
}

$DetectedAgents = foreach ($agent in $AgentRegistry) {
  $candidate = Get-AgentDirectory $agent $Scope
  if ($candidate -and (Test-Path -LiteralPath $candidate -PathType Container)) {
    $agent.Id
  }
}

if (-not $Agents -or $Agents.Count -eq 0) {
  Show-AgentTable
  if ($DetectedAgents.Count -gt 0) {
    Write-Host ""
    Write-Host "Detected: $($DetectedAgents -join ',')"
  }
  $Agents = @(
    Read-Host 'Choose comma-separated agent IDs, "detected", or "all"'
  )
}

$SelectedIds = (($Agents -join ",") -split ",") |
  ForEach-Object { $_.Trim() } |
  Where-Object { $_ }
if ($SelectedIds.Count -eq 1 -and $SelectedIds[0] -eq "all") {
  $SelectedIds = @($AgentRegistry.Id)
} elseif ($SelectedIds.Count -eq 1 -and $SelectedIds[0] -eq "detected") {
  if ($DetectedAgents.Count -eq 0) {
    throw "No installed agents were detected for $Scope scope"
  }
  $SelectedIds = @($DetectedAgents)
}
if ($SelectedIds.Count -eq 0) {
  throw "No agents selected"
}

$Targets = [System.Collections.Generic.List[object]]::new()
$SeenDestinations = [System.Collections.Generic.HashSet[string]]::new(
  [StringComparer]::OrdinalIgnoreCase
)
foreach ($id in $SelectedIds) {
  $agent = $AgentRegistry | Where-Object { $_.Id -eq $id } | Select-Object -First 1
  if (-not $agent) {
    throw "Unknown agent: $id"
  }
  $agentDirectory = Get-AgentDirectory $agent $Scope
  if (-not $agentDirectory) {
    throw "$id supports project-local installation only"
  }
  $destination = [IO.Path]::GetFullPath((Join-Path $agentDirectory $SkillName))
  if ($destination.Contains("`n") -or $destination.Contains("`r")) {
    throw "Unsafe destination for $id"
  }
  if ($SeenDestinations.Add($destination)) {
    $Targets.Add(
      [pscustomobject]@{ Agent = $id; Destination = $destination }
    )
  }
}

Write-Host "Gigatable skill $SkillReleaseVersion will be installed to:"
foreach ($target in $Targets) {
  Write-Host ("  {0,-22} {1}" -f $target.Agent, $target.Destination)
}

if (-not $Yes) {
  $confirmation = Read-Host "Continue? [y/N]"
  if ($confirmation -notin @("y", "Y", "yes", "YES")) {
    Write-Host "Cancelled."
    return
  }
}

$TemporaryDirectory = Join-Path ([IO.Path]::GetTempPath()) (
  "gigatable-skill-" + [Guid]::NewGuid().ToString("N")
)
New-Item -ItemType Directory -Path $TemporaryDirectory | Out-Null

try {
  $archive = Join-Path $TemporaryDirectory "gigatable-skill.zip"
  $checksums = Join-Path $TemporaryDirectory "SHA256SUMS"
  if ($env:GIGATABLE_SKILL_ARCHIVE) {
    if (-not $env:GIGATABLE_SKILL_CHECKSUMS) {
      throw "GIGATABLE_SKILL_CHECKSUMS is required with a local archive"
    }
    Copy-Item -LiteralPath $env:GIGATABLE_SKILL_ARCHIVE -Destination $archive
    Copy-Item -LiteralPath $env:GIGATABLE_SKILL_CHECKSUMS -Destination $checksums
  } else {
    $releaseBase = $env:GIGATABLE_SKILL_RELEASE_BASE_URL
    if (-not $releaseBase) {
      $releaseBase =
        "https://github.com/$Repository/releases/download/$SkillReleaseVersion"
    }
    Invoke-WebRequest "$releaseBase/gigatable-skill.zip" -OutFile $archive
    Invoke-WebRequest "$releaseBase/SHA256SUMS" -OutFile $checksums
  }

  $checksumLine = Get-Content -LiteralPath $checksums |
    Where-Object { $_ -match "^[a-fA-F0-9]{64}\s+\*?gigatable-skill\.zip$" } |
    Select-Object -First 1
  if (-not $checksumLine) {
    throw "SHA256SUMS does not contain gigatable-skill.zip"
  }
  $expectedHash = ($checksumLine -split "\s+")[0].ToLowerInvariant()
  $actualHash = (
    Get-FileHash -Algorithm SHA256 -LiteralPath $archive
  ).Hash.ToLowerInvariant()
  if ($actualHash -ne $expectedHash) {
    throw "Checksum verification failed"
  }

  Add-Type -AssemblyName System.IO.Compression.FileSystem
  $zip = [IO.Compression.ZipFile]::OpenRead($archive)
  try {
    $skillFileCount = 0
    foreach ($entry in $zip.Entries) {
      $entryName = $entry.FullName
      if ($entryName -eq "gigatable/SKILL.md") {
        $skillFileCount += 1
      }
      $segments = $entryName -split "/"
      if (
        -not $entryName.StartsWith("gigatable/") -or
        $segments -contains ".." -or
        $entryName.StartsWith("/") -or
        $entryName.Contains("\")
      ) {
        throw "Archive contains files outside one gigatable skill folder"
      }
    }
    if ($skillFileCount -ne 1) {
      throw "Archive must contain exactly one gigatable/SKILL.md"
    }
  } finally {
    $zip.Dispose()
  }

  $extracted = Join-Path $TemporaryDirectory "extracted"
  Expand-Archive -LiteralPath $archive -DestinationPath $extracted
  $sourceDirectory = Join-Path $extracted $SkillName
  if (-not (Test-Path -LiteralPath (Join-Path $sourceDirectory "SKILL.md"))) {
    throw "Archive does not contain gigatable/SKILL.md"
  }

  $timestamp = (Get-Date).ToUniversalTime().ToString("yyyyMMddHHmmss")
  foreach ($target in $Targets) {
    $destination = $target.Destination
    $parent = Split-Path -Parent $destination
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
    $stage = "$destination.tmp.$PID"
    $backup = $null
    if (Test-Path -LiteralPath $stage) {
      Remove-Item -Recurse -Force -LiteralPath $stage
    }
    Copy-Item -Recurse -LiteralPath $sourceDirectory -Destination $stage
    if (Test-Path -LiteralPath $destination) {
      $backup = "$destination.backup-$timestamp-$PID"
      Move-Item -LiteralPath $destination -Destination $backup
    }
    try {
      Move-Item -LiteralPath $stage -Destination $destination
    } catch {
      if ($backup -and (Test-Path -LiteralPath $backup)) {
        Move-Item -LiteralPath $backup -Destination $destination
      }
      throw
    }
    if ($backup) {
      Write-Host "Installed $destination (backup: $backup)"
    } else {
      Write-Host "Installed $destination"
    }
  }
} finally {
  if (Test-Path -LiteralPath $TemporaryDirectory) {
    Remove-Item -Recurse -Force -LiteralPath $TemporaryDirectory
  }
}

Write-Host (
  "Done. Restart or reload the selected agent if it does not discover " +
  "the skill immediately."
)
