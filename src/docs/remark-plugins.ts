type MarkdownNode = {
  type: string;
  value?: string;
  lang?: string | null;
  meta?: string | null;
  name?: string;
  attributes?: Array<{
    type: "mdxJsxAttribute";
    name: string;
    value: string;
  }>;
  children?: MarkdownNode[];
};

type MarkdownRoot = MarkdownNode & {
  children: MarkdownNode[];
};

const packageManagerMarker = /^<!-- package-manager-tabs(?::add-cells)? -->$/;

const packageManagerNames = ["npm", "pnpm", "yarn", "bun"] as const;

function packageManagerForCommand(command: string) {
  if (command.startsWith("pnpm ")) return "pnpm";
  if (command.startsWith("yarn ")) return "yarn";
  if (command.startsWith("bunx ")) return "bun";
  return "npm";
}

/**
 * Convert the existing package-manager marker plus four-line bash block into
 * Fumadocs' native persistent code tabs. The Markdown source stays unchanged.
 */
export function remarkPackageManagerTabs() {
  return (tree: MarkdownRoot) => {
    for (let index = 0; index < tree.children.length - 1; index += 1) {
      const marker = tree.children[index];
      const code = tree.children[index + 1];

      if (
        marker.type !== "html" ||
        !packageManagerMarker.test(marker.value?.trim() ?? "") ||
        code.type !== "code" ||
        code.lang !== "bash"
      ) {
        continue;
      }

      const commands = (code.value ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (commands.length !== packageManagerNames.length) continue;

      const tabs: MarkdownNode[] = commands.map((command, commandIndex) => {
        const manager = packageManagerForCommand(command);
        const persistence =
          commandIndex === 0 ? ' tab-group="gigatable-package-manager"' : "";

        return {
          type: "code",
          lang: "bash",
          meta: `tab="${manager}"${persistence}`,
          value: command,
        };
      });

      tree.children.splice(index, 2, ...tabs);
      index += tabs.length - 1;
    }
  };
}

const calloutTypes = {
  NOTE: "info",
  TIP: "idea",
  WARNING: "warning",
} as const;

function removeCalloutMarker(node: MarkdownNode, label: string): boolean {
  if (node.type === "text" && node.value !== undefined) {
    const nextValue = node.value.replace(
      new RegExp(`^\\s*\\[!${label}\\]\\s*`, "i"),
      "",
    );
    if (nextValue !== node.value) {
      node.value = nextValue;
      return true;
    }
  }

  for (const child of node.children ?? []) {
    if (removeCalloutMarker(child, label)) return true;
  }

  return false;
}

/** Convert the existing GitHub alert syntax into Fumadocs Callouts. */
export function remarkGithubAlerts() {
  return (tree: MarkdownRoot) => {
    for (const node of tree.children) {
      if (node.type !== "blockquote") continue;

      const firstText = node.children?.[0]?.children?.find(
        (child) => child.type === "text",
      )?.value;
      const match = /^\s*\[!(NOTE|TIP|WARNING)]/i.exec(firstText ?? "");
      if (!match) continue;

      const label = match[1].toUpperCase() as keyof typeof calloutTypes;
      removeCalloutMarker(node, label);

      node.type = "mdxJsxFlowElement";
      node.name = "Callout";
      node.attributes = [
        {
          type: "mdxJsxAttribute",
          name: "title",
          value: label,
        },
        {
          type: "mdxJsxAttribute",
          name: "type",
          value: calloutTypes[label],
        },
      ];
    }
  };
}

