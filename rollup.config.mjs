import { defineConfig } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import esbuild from "rollup-plugin-esbuild";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const adapterRoots = ["src/react", "src/vue", "src/svelte"].map((dir) => path.resolve(root, dir));

function rawcss() {
  return {
    name: "rawcss",
    resolveId(source, importer) {
      if (!source.endsWith(".rawcss")) return null;
      return path.resolve(importer ? path.dirname(importer) : root, source);
    },
    load(id) {
      if (!id.endsWith(".rawcss")) return null;
      return `export default ${JSON.stringify(fs.readFileSync(id, "utf8"))}`;
    },
  };
}

function externalizeCore() {
  return {
    name: "externalize-core",
    resolveId(source, importer) {
      if (!importer || !source.startsWith(".")) return null;
      const importerDir = path.resolve(path.dirname(importer));
      const adapterRoot = adapterRoots.find(
        (dir) => importerDir === dir || importerDir.startsWith(dir + path.sep),
      );
      if (!adapterRoot) return null;
      const resolved = path.resolve(path.dirname(importer), source);
      if (resolved === adapterRoot || resolved.startsWith(adapterRoot + path.sep)) return null;
      return { id: "@open-a11y/core", external: true };
    },
  };
}

const terserPlugin = terser({ format: { comments: false } });

const useClient = {
  name: "use-client",
  renderChunk(code, chunk) {
    if (chunk.fileName !== "react.js" && chunk.fileName !== "react.cjs") return null;
    return { code: `'use client';\n${code}`, map: null };
  },
};

export default defineConfig([
  // Core ESM and CJS.
  {
    input: "src/index.ts",
    external: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "lucide"],
    plugins: [
      rawcss(),
      resolve({ extensions: [".ts", ".tsx", ".js", ".json"] }),
      commonjs(),
      json(),
      esbuild({ target: "es2020", jsx: "automatic", jsxImportSource: "react" }),
      terserPlugin,
    ],
    output: [
      {
        file: "dist/index.js",
        format: "esm",
        sourcemap: true,
        exports: "named",
      },
      {
        file: "dist/index.cjs",
        format: "cjs",
        sourcemap: true,
        exports: "named",
        interop: "auto",
      },
    ],
  },

  // Standalone browser bundle. Everything, including icons, is bundled.
  {
    input: "src/index.ts",
    plugins: [
      rawcss(),
      resolve({ browser: true, extensions: [".ts", ".tsx", ".js", ".json"] }),
      commonjs(),
      json(),
      esbuild({ target: "es2020", jsx: "automatic", jsxImportSource: "react" }),
      terserPlugin,
    ],
    output: {
      file: "dist/open-a11y.js",
      format: "iife",
      name: "OpenA11y",
      sourcemap: false,
      exports: "named",
    },
  },

  // Framework adapters. The core stays external and resolves to the sibling entry.
  {
    input: {
      react: "src/react/index.ts",
      vue: "src/vue/index.ts",
      svelte: "src/svelte/index.ts",
    },
    external: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "vue",
      "svelte",
      "svelte/store",
      "lucide",
    ],
    onwarn(warning, warn) {
      if (warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes("use client"))
        return;
      warn(warning);
    },
    plugins: [
      rawcss(),
      externalizeCore(),
      resolve({ extensions: [".ts", ".tsx", ".js", ".json"] }),
      commonjs(),
      json(),
      esbuild({ target: "es2020", jsx: "automatic", jsxImportSource: "react" }),
      terserPlugin,
    ],
    output: [
      {
        dir: "dist",
        format: "esm",
        entryFileNames: "[name].js",
        sourcemap: true,
        exports: "named",
        paths: (id) => (id === "@open-a11y/core" ? "./index.js" : id),
        plugins: [useClient],
      },
      {
        dir: "dist",
        format: "cjs",
        entryFileNames: "[name].cjs",
        sourcemap: true,
        exports: "named",
        interop: "auto",
        paths: (id) => (id === "@open-a11y/core" ? "./index.cjs" : id),
        plugins: [useClient],
      },
    ],
  },
]);
