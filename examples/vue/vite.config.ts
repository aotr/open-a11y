import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
const packageRoot = fileURLToPath(new URL('../..', import.meta.url))

export default defineConfig({
  base: './',
  root,
  plugins: [vue()],
  resolve: {
    alias: {
      '@aotr/open-a11y/vue': fileURLToPath(new URL('../../dist/vue.js', import.meta.url)),
      '@aotr/open-a11y': fileURLToPath(new URL('../../dist/index.js', import.meta.url)),
    },
  },
  server: { port: 4176, strictPort: true, fs: { allow: [packageRoot] } },
  build: { outDir: 'dist', emptyOutDir: true },
})
