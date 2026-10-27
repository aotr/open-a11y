<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { AccessibilityEngine, localStorageAdapter } from "@aotr/open-a11y";
import { A11yWidget } from "@aotr/open-a11y/vue";
import {
  DEFAULT_DEMO_STATE,
  createDemoCustomizer,
  mountStateInspector,
  toDemoConfig,
  type DemoUiState,
} from "../../shared/customizer";

const engine = new AccessibilityEngine({ storage: localStorageAdapter });
const state = ref<DemoUiState>({ ...DEFAULT_DEMO_STATE });
const ready = ref(false);
const config = computed(() => toDemoConfig(state.value));
const customizer = ref<HTMLElement | null>(null);
const statePanel = ref<HTMLElement | null>(null);
let unsubscribe: (() => void) | undefined;

onMounted(async () => {
  await engine.init();
  ready.value = true;
  if (customizer.value) {
    createDemoCustomizer(customizer.value, DEFAULT_DEMO_STATE, (next) => {
      state.value = next;
    });
  }
  if (statePanel.value) unsubscribe = mountStateInspector(statePanel.value, engine);
  void engine.setLanguage(state.value.language);
});

onBeforeUnmount(() => unsubscribe?.());

watch(
  () => state.value.language,
  (lang) => {
    void engine.setLanguage(lang);
  },
);
</script>

<template>
  <main class="demo-shell">
    <header class="demo-header">
      <div>
        <div class="demo-brand"><span class="demo-mark">a11y</span> open-a11y</div>
        <h1>Accessibility that fits the page, not the other way around.</h1>
      </div>
      <span class="demo-badge">Vue 3</span>
    </header>

    <p class="demo-lede">
      The Vue adapter is a plugin plus a composable. <code>useAccessibility()</code>
      returns reactive settings and typed actions; the declarative widget mounts through the same
      lifecycle registry as every other adapter.
    </p>

    <div class="demo-grid">
      <section class="demo-card">
        <h2>Reactive by design</h2>
        <p>
          Settings are exposed as a readonly ref, so templates and computed values update whenever
          the engine changes. Profiles and tools stay canonical.
        </p>
        <ul>
          <li>Vue 3.5+ plugin.</li>
          <li><code>useAccessibility()</code> composable.</li>
          <li><code>&lt;A11yWidget /&gt;</code> declarative component.</li>
        </ul>
      </section>
      <section class="demo-card">
        <h2>Live state</h2>
        <div ref="statePanel" />
      </section>
    </div>

    <div ref="customizer" />

    <A11yWidget v-if="ready" :options="{ config }" />

    <footer class="demo-footer">
      <span>open-a11y · MIT licensed</span>
      <a href="https://github.com/aotr/open-a11y">GitHub</a>
    </footer>
  </main>
</template>
