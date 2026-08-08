import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@root": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    exclude: ["node_modules", "dist", "build", ".idea", ".git", ".cache", "gigatable"],
    passWithNoTests: true,
  },
});
