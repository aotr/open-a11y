<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { AccessibilityEngine, localStorageAdapter } from '@aotr/open-a11y'
  import { accessibilityWidget } from '@aotr/open-a11y/svelte'
  import {
    DEFAULT_DEMO_STATE,
    createDemoCustomizer,
    mountStateInspector,
    toDemoConfig,
    type DemoUiState,
  } from '../../shared/customizer'

  const engine = new AccessibilityEngine({ storage: localStorageAdapter })
  let state = $state<DemoUiState>({ ...DEFAULT_DEMO_STATE })
  let ready = $state(false)
  let customizerEl: HTMLElement
  let stateEl: HTMLElement
  let unsubscribe: (() => void) | undefined

  const options = $derived({ engine, config: toDemoConfig(state) })

  onMount(async () => {
    await engine.init()
    ready = true
    createDemoCustomizer(customizerEl, DEFAULT_DEMO_STATE, (next) => {
      state = next
    })
    unsubscribe = mountStateInspector(stateEl, engine)
    void engine.setLanguage(state.language)
  })

  onDestroy(() => unsubscribe?.())

  $effect(() => {
    if (ready) void engine.setLanguage(state.language)
  })
</script>

<main class="demo-shell">
  <header class="demo-header">
    <div>
      <div class="demo-brand"><span class="demo-mark">a11y</span> open-a11y</div>
      <h1>Accessibility that fits the page, not the other way around.</h1>
    </div>
    <span class="demo-badge">Svelte 5</span>
  </header>

  <p class="demo-lede">
    The Svelte adapter ships a readable store and a widget action. There is no
    compiled component to fight; the engine already owns the UI. Use the store
    anywhere and mount the widget with one directive.
  </p>

  <div class="demo-grid">
    <section class="demo-card">
      <h2>Store, not ceremony</h2>
      <p>
        <code>createAccessibilityStore(engine)</code> returns a readable settings
        store plus typed actions. The <code>accessibilityWidget</code> action
        mounts and updates through the shared lifecycle.
      </p>
      <ul>
        <li>Svelte 5 compatible.</li>
        <li>Readable store and typed actions.</li>
        <li>Action mount, update, and destroy.</li>
      </ul>
    </section>
    <section class="demo-card">
      <h2>Live state</h2>
      <div bind:this={stateEl} />
    </section>
  </div>

  <div bind:this={customizerEl} />

  {#if ready}
    <div use:accessibilityWidget={options}></div>
  {/if}

  <footer class="demo-footer">
    <span>open-a11y · MIT licensed</span>
    <a href="https://github.com/aotr/open-a11y">GitHub</a>
  </footer>
</main>
