# Installation

Gigatable is shipped as a shadcn-style source installer. The CLI copies the React component files into your app so you own the code after installation.

## Requirements

Gigatable expects a modern React TypeScript project:

| Requirement  | Version                      |
| ------------ | ---------------------------- |
| React        | 19 or newer                  |
| TypeScript   | enabled with `tsconfig.json` |
| Tailwind CSS | v4                           |
| Node.js      | 18 or newer                  |

## Install With Your Package Manager

Run one of these commands from the root of your app:

<!-- package-manager-tabs -->

```bash
npx gigatable init
pnpm dlx gigatable init
yarn dlx gigatable init
bunx gigatable init
```

## What the CLI does

The init command validates your project, prompts for a target directory, and copies the component source into that directory. The default destination is `src/gigatable`.

It also installs the runtime dependencies Gigatable needs:

```bash
@tanstack/react-table
@tanstack/react-virtual
clsx
```

The website presents these commands as package-manager tabs. They all run the
same `init` workflow.

## TypeScript setup

Add the TanStack Table augmentation file to your `tsconfig.json` include list. This enables `meta: { editable: true }` on column definitions.

```json
{
  "include": ["src", "src/gigatable/types/react-table.ts"]
}
```

## Import path

After installation, import from the local directory the CLI copied into your project:

```tsx
import { Gigatable, useGigatable, EditableCell, themes } from "./gigatable";
```

If you choose a different target path during installation, adjust the import path to match it.

## Verify the Installation

Import the barrel and render a minimal table:

```tsx
import { Gigatable, useGigatable } from "./gigatable";

const { table } = useGigatable({ columns, data });

return <Gigatable table={table} />;
```

Continue with [Quickstart](/docs/quickstart) to enable spreadsheet behavior.

## Troubleshooting

| Problem                               | Fix                                                                    |
| ------------------------------------- | ---------------------------------------------------------------------- |
| `meta.editable` is unknown            | Include the copied TanStack augmentation file in `tsconfig.json`       |
| Tailwind utilities do not render      | Confirm the target app uses Tailwind CSS v4                            |
| CLI chooses the wrong package manager | Run the corresponding `npx`, `pnpm dlx`, `yarn dlx`, or `bunx` command |
| Import cannot be resolved             | Match the import path to the directory chosen during `init`            |
