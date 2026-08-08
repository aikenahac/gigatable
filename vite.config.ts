import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import { fumadocsMdx } from "fumadocs-mdx/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { docsAssetsPlugin } from "./scripts/docs-assets-plugin";

export default defineConfig({
  plugins: [
    docsAssetsPlugin(__dirname),
    ...fumadocsMdx({ macro: { include: ["src/docs/source.ts"] } }),
    tailwindcss(),
    reactRouter(),
  ],
  resolve: {
    alias: {
      "@root": path.resolve(__dirname, "./src"),
    },
  },
});
