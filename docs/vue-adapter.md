# Vue adapter

> `@aotr/open-a11y/vue`

Vue 3.5+ adapter. It provides an injection context, a composable, and a
declarative widget component.

## Install

```bash
npm install @aotr/open-a11y vue
```

## Plugin

```ts
import { createApp } from 'vue'
import { AccessibilityEngine, localStorageAdapter } from '@aotr/open-a11y'
import { createAccessibilityPlugin } from '@aotr/open-a11y/vue'

const engine = new AccessibilityEngine({ storage: localStorageAdapter })

createApp(App)
  .use(createAccessibilityPlugin(engine, { showWidgetOnMount: true }))
  .mount('#app')
```

| Option | Type | Description |
|---|---|---|
| `showWidgetOnMount` | `boolean` | Mount the floating widget during app install |
| `widgetOptions` | `UIOptions` | Position, side, offset, blur, container, and config overrides |

## Composable

```vue
<script setup lang="ts">
import { useAccessibility } from '@aotr/open-a11y/vue'

const { settings, states, toggleTool, applyProfile, reset } = useAccessibility()
</script>

<template>
  <button
    type="button"
    :aria-pressed="states['font-weight'] === true"
    @click="toggleTool('font-weight')"
  >
    Bold text: {{ settings.states['font-weight'] ? 'on' : 'off' }}
  </button>
</template>
```

The context exposes `settings`, `states`, `engine`, tool/profile/language actions,
`showWidget`, `hideWidget`, and `dispose`.

## Widget component

```vue
<script setup lang="ts">
import { A11yWidget } from '@aotr/open-a11y/vue'

const options = { position: 'bottom-right' as const }
</script>

<template>
  <A11yWidget :options="options" />
</template>
```

The component renders no markup. It mounts the core web components and tears
down only its own session. Changing `options` remounts the widget while keeping
engine state.

## Tests

`__tests__/vue-adapter.test.ts` covers plugin provisioning, reactive settings,
actions, auto-mount, and teardown.
