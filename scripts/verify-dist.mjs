import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const dist = new URL('../dist/', import.meta.url)
const read = (file) => readFile(new URL(file, dist), 'utf8')

const files = {
  coreEsm: await read('index.js'),
  coreCjs: await read('index.cjs'),
  reactEsm: await read('react.js'),
  reactCjs: await read('react.cjs'),
  vueEsm: await read('vue.js'),
  vueCjs: await read('vue.cjs'),
  svelteEsm: await read('svelte.js'),
  svelteCjs: await read('svelte.cjs'),
  angularEsm: await read('angular/fesm2022/open-a11y-angular.mjs'),
  angularTypes: await read('angular/types/open-a11y-angular.d.ts'),
  browser: await read('open-a11y.js'),
  coreTypes: await read('types/index.d.ts'),
}

assert.match(files.coreEsm, /asw-user-settings/)
assert.match(files.coreCjs, /asw-user-settings/)
for (const name of ['react', 'vue', 'svelte']) {
  assert.doesNotMatch(files[`${name}Esm`], /asw-user-settings/, `${name} ESM must not copy the core`)
  assert.doesNotMatch(files[`${name}Cjs`], /asw-user-settings/, `${name} CJS must not copy the core`)
  assert.match(files[`${name}Esm`], /from"\.\/index\.js"|from '\.\/index\.js'/, `${name} ESM must import core`)
  assert.match(files[`${name}Cjs`], /require\("\.\/index\.cjs"\)|require\('\.\/index\.cjs'\)/, `${name} CJS must require core`)
}
assert.doesNotMatch(files.angularEsm, /asw-user-settings/, 'Angular must not copy the core')
assert.match(files.angularEsm, /@aotr\/open-a11y/, 'Angular must import the core package')
assert.match(files.angularTypes, /ɵdir/, 'Angular directive metadata must be present for AOT')
assert.match(files.browser, /OpenA11y/)
assert.match(files.browser, /asw-user-settings/)
assert.match(files.coreTypes, /AccessibilityEngine/)

const core = await import(new URL('index.js', dist).href)
const react = await import(new URL('react.js', dist).href)
const vue = await import(new URL('vue.js', dist).href)
const svelte = await import(new URL('svelte.js', dist).href)

for (const [name, adapter] of Object.entries({ react, vue, svelte })) {
  assert.equal(typeof adapter.AccessibilityEngine, 'function', `${name} must export AccessibilityEngine`)
  assert.equal(adapter.AccessibilityEngine, core.AccessibilityEngine, `${name} must share the core engine`)
  assert.equal(adapter.localStorageAdapter, core.localStorageAdapter, `${name} must share core storage`)
}

const require = createRequire(import.meta.url)
const coreCjs = require(fileURLToPath(new URL('index.cjs', dist)))
for (const name of ['react', 'vue', 'svelte']) {
  const adapter = require(fileURLToPath(new URL(`${name}.cjs`, dist)))
  assert.equal(adapter.AccessibilityEngine, coreCjs.AccessibilityEngine, `${name} CJS must share the core engine`)
}

console.log('dist smoke test passed: core, React, Vue, Svelte, and Angular share one runtime')
