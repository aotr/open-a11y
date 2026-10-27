import { defineConfig } from 'vitest/config'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['__tests__/**/*.test.{ts,tsx}'],
  },
  plugins: [
    {
      name: 'rawcss',
      transform(_code: string, id: string) {
        if (id.endsWith('.rawcss')) {
          const css = fs.readFileSync(id, 'utf-8')
          return `export default ${JSON.stringify(css)}`
        }
      },
    },
  ],
  resolve: {
    alias: {
      // Allow tests to import from 'vitest' without issues
    },
  },
})
