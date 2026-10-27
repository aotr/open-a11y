# Svelte adapter

> `@aotr/open-a11y/svelte`

Svelte 5 adapter. It exports a readable store and a widget action, so the package
does not need to compile or ship `.svelte` components.

## Install

```bash
npm install @aotr/open-a11y svelte
```

## Store

```svelte
<script lang="ts">
  import { AccessibilityEngine, localStorageAdapter } from '@aotr/open-a11y'
  import { createAccessibilityStore } from '@aotr/open-a11y/svelte'

  const engine = new AccessibilityEngine({ storage: localStorageAdapter })
  const a11y = createAccessibilityStore(engine)

  void engine.init()
</script>

<button
  type="button"
  aria-pressed={$a11y.states['font-weight'] === true}
  on:click={() => a11y.toggleTool('font-weight')}
>
  Bold text
</button>
```

The store subscribes lazily through `svelte/store`. It exposes the engine,
settings actions, `showWidget`, and `hideWidget`.

## Widget action

```svelte
<script lang="ts">
  import { accessibilityWidget } from '@aotr/open-a11y/svelte'

  const options = { engine }
</script>

<div use:accessibilityWidget={options}></div>
```

Update the action value to remount with new UI options. The action destroys its
controller when the node is removed.

## Tests

`__tests__/svelte-adapter.test.ts` covers store subscriptions, actions, mount,
update, and destroy.
