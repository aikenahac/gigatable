import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@root": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    exclude: ["node_modules", "dist", ".idea", ".git", ".cache", "gigatable"],
    passWithNoTests: true,
  },
});
