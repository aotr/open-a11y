import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const site = path.join(root, 'site')

fs.rmSync(site, { recursive: true, force: true })
fs.mkdirSync(site, { recursive: true })

const run = (command, args) => {
  execFileSync(command, args, { cwd: root, stdio: 'inherit' })
}

run('npm', ['run', 'build'])
run('node', ['scripts/link-self.mjs'])

for (const app of ['vanilla', 'react', 'vue', 'svelte']) {
  run('npx', ['vite', 'build', '--config', `examples/${app}/vite.config.ts`])
  fs.cpSync(path.join(root, 'examples', app, 'dist'), path.join(site, app), { recursive: true })
}

run('pnpm', ['--dir', 'examples/angular', 'build'])
fs.cpSync(
  path.join(root, 'examples', 'angular', 'dist', 'open-a11y-angular', 'browser'),
  path.join(site, 'angular'),
  { recursive: true }
)

fs.copyFileSync(
  path.join(root, 'examples', 'landing', 'index.html'),
  path.join(site, 'index.html')
)

console.log(`Demo site built at ${site}`)
