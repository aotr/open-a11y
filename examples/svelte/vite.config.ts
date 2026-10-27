import { defineConfig } from "vite-plus";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const packageRoot = fileURLToPath(new URL("../..", import.meta.url));

export default defineConfig({
  base: "./",
  root,
  plugins: [svelte()],
  resolve: {
    alias: {
      "@aotr/open-a11y/svelte": fileURLToPath(new URL("../../dist/svelte.js", import.meta.url)),
      "@aotr/open-a11y": fileURLToPath(new URL("../../dist/index.js", import.meta.url)),
    },
  },
  server: { port: 4177, strictPort: true, fs: { allow: [packageRoot] } },
  build: { outDir: "dist", emptyOutDir: true },
});
