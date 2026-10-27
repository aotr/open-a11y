import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const packageRoot = fileURLToPath(new URL("../..", import.meta.url));

export default defineConfig({
  base: "./",
  root,
  plugins: [react()],
  resolve: {
    alias: {
      "@aotr/open-a11y/react": fileURLToPath(new URL("../../dist/react.js", import.meta.url)),
      "@aotr/open-a11y": fileURLToPath(new URL("../../dist/index.js", import.meta.url)),
    },
  },
  server: { port: 4175, strictPort: true, fs: { allow: [packageRoot] } },
  build: { outDir: "dist", emptyOutDir: true },
});
