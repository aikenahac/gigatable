#!/usr/bin/env node
import { init } from "../commands/init";

const [, , command] = process.argv;

if (command === "init") {
  init().catch((err: Error) => {
    console.error(err.message);
    process.exit(1);
  });
} else {
  console.error(`Unknown command: ${command ?? "(none)"}`);
  console.error("Usage: npx gigatable init");
  process.exit(1);
}
