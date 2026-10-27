import { defineConfig } from "vite-plus";
import fs from "node:fs";
import path from "node:path";

function rawcss() {
  return {
    name: "rawcss",
    resolveId(source: string, importer?: string) {
      if (!source.endsWith(".rawcss")) return null;
      return path.resolve(importer ? path.dirname(importer) : process.cwd(), source);
    },
    load(id: string) {
      if (!id.endsWith(".rawcss")) return null;
      return `export default ${JSON.stringify(fs.readFileSync(id, "utf8"))}`;
    },
  };
}

export default defineConfig({
  plugins: [rawcss()],
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    clearMocks: false,
    environment: "jsdom",
    globals: true,
    include: ["__tests__/**/*.test.{ts,tsx}"],
  },
  fmt: {},
  lint: {
    ignorePatterns: ["examples/**", "angular-lib/**", "site/**", "dist/**"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
