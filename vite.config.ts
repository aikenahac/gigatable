import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { docsAssetsPlugin } from "./scripts/docs-assets-plugin";

export default defineConfig({
  plugins: [docsAssetsPlugin(__dirname), tailwindcss(), react()],
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
