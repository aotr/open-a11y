import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
const packageRoot = fileURLToPath(new URL('../..', import.meta.url))

export default defineConfig({
  root,
  resolve: {
    alias: {
      '@aotr/open-a11y': fileURLToPath(new URL('../../dist/index.js', import.meta.url)),
    },
  },
  server: {
    port: 4174,
    strictPort: true,
    fs: { allow: [packageRoot] },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
