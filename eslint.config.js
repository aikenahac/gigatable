import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig(
  {
    ignores: [
      "**/node_modules/**",
      "dist/**",
      ".prettierrc.js",
      ".eslintrc.js",
      "tailwind.config.js",
      "eslint.config.js",
      "postcss.config.js",
      "vite.config.ts",
      "scripts/**",
      "**/*.d.ts",
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettierConfig,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 2023,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2023,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      // "curly": ["error", "all"],
      "no-console": "off",
      "no-unexpected-multiline": "warn",
      "prefer-arrow-callback": "error",
      "func-names": ["error", "always"],
      "no-unused-vars": "off",

      "react/prop-types": "off",
      "react-hooks/exhaustive-deps": "warn",
      "react/jsx-no-leaked-render": [
        "error",
        { validStrategies: ["coerce", "ternary"] },
      ],

      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      "@typescript-eslint/no-duplicate-enum-values": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/dot-notation": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/array-type": [
        "error",
        {
          default: "generic",
        },
      ],
    },
  },
);
