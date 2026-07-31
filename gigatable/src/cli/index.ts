#!/usr/bin/env node
import { init } from "../commands/init";
import { addCells } from "../commands/add-cells";

const [, , command, subcommand] = process.argv;

if (command === "init") {
  init().catch((err: Error) => {
    console.error(err.message);
    process.exit(1);
  });
} else if (command === "add" && subcommand === "cells") {
  addCells().catch((err: Error) => {
    console.error(err.message);
    process.exit(1);
  });
} else if (command === "help" || command === "--help" || command === "-h") {
  console.log(
    [
      "Usage:",
      "  npx gigatable init       Install the Gigatable core source",
      "  npx gigatable add cells  Add optional editable cell source",
    ].join("\n"),
  );
} else {
  console.error(`Unknown command: ${command ?? "(none)"}`);
  console.error("Run `npx gigatable help` for usage.");
  process.exit(1);
}
