# ⚙️ AccessibilityEngine — Main Orchestrator

> `src/engine/AccessibilityEngine.ts`

The **AccessibilityEngine** is the public state owner for the widget. It resolves
configuration once, dispatches manifest tools, applies profiles, persists state,
and owns the reset transaction.

---

## 🧠 Responsibilities

| Responsibility | How |
|---|---|
| Resolve config | `mergeConfig(options.config)` plus explicit engine options, exposed as `engine.config` |
| State | Creates an internal `StateManager` with the storage adapter |
| Translations | Calls `initTranslations(lang)` on startup |
| Hydration | Restores saved settings and migrates legacy exclusive-tool keys |
| Tool dispatch | Resolves the tool from the manifest and calls its executor |
| Exclusive groups | Stores the active ID under `contrast` / `textAlign` |
| Continuous values | `fontSize`, `lineHeight`, `letterSpacing` |
| Profiles | One `setMany` write, then apply the resulting state |
| Reset | One state reset, remove tool effects, clear injected CSS |

`StateManager` is internal. Import it from `src/state/StateManager` in tests or
internals, not from the package root.

---

## 🔄 Lifecycle

```
new AccessibilityEngine({ storage, config })
        │
        ▼
  engine.init()
        │
        ├── 1. load translations
        ├── 2. hydrate + normalize saved state
        ├── 3. runAllTools()
        │       ├── continuous tools
        │       ├── exclusive group state (contrast / textAlign)
        │       └── boolean tools
        └── 4. initialized = true
```

`createAccessibilityUI(engine)` mounts the UI and subscribes to `engine`.
Mount/open/close ownership lives in `src/ui/lifecycle.ts`.

---

## 🔌 Public API

### `engine.init(): Promise<void>`

Idempotent. Loads translations, hydrates state, and applies active tools.

### `engine.settings: Readonly<ISettings>`

Frozen current settings snapshot. Use `subscribe()` for updates.

### `engine.config: Readonly<Required<IAccessibilityConfig>>`

The resolved config. Adapters consume this snapshot; they do not resolve a second
config. Explicit UI options passed to `createAccessibilityUI` override it.

### `engine.subscribe(listener): () => void`

Subscribe to state changes. Returns an unsubscribe function.

### `engine.toggleTool(toolId, value?): void`

Toggles or sets a boolean, exclusive, or continuous tool. The call is one state
transaction and one persistence write. It clears `activeProfile` in the same
write. Continuous tools use the manifest range and formatter.

### `engine.setContinuousTool(toolId, value): void`

Generic setter for any manifest continuous tool. Clamps to the manifest range.

### `engine.setFontScale(value)`, `setLineHeight(value)`, `setLetterSpacing(value)`

Compatibility wrappers around `setContinuousTool`.

### `engine.applyProfile(profileId): void`

Applies the profile's canonical states in one transaction, sets `activeProfile`,
then applies every tool. Unknown profiles are ignored.

### `engine.deactivateProfile(profileId): void`

Only clears state when `profileId` is the active profile.

### `engine.setLanguage(lang): void`

Updates language state and reloads translations.

### `engine.reset(): void`

Resets state in one transaction, applies default tool states, then removes all
injected styles and tool classes. `StateManager` keeps the current language.

### `engine.isToolEnabled(toolId)` / `engine.getToolValue(toolId)`

Read canonical state for exclusive groups and continuous tools.

---

## 🧩 State Vocabulary

Exclusive tools store the active tool ID under their group key:

```ts
{
  contrast: 'high-contrast',        // or false
  textAlign: 'text-align-center',   // or false
  fontSize: 1.5,
  lineHeight: 1.4,
  letterSpacing: 2,
  'font-weight': true,
  activeProfile: 'vision-impaired',
}
```

Legacy saved states like `{ 'high-contrast': true }` are normalized on hydration.

---

## 📊 Tool Dispatch

```
UI action
   │
   ▼
engine.toggleTool(toolId, value)
   │
   ├── manifest lookup
   ├── one StateManager.setMany(...)
   ├── executor / group.apply() / continuous.apply()
   └── subscribers + persistence
```

All visual effects go through `src/css/cssInjector.ts`; continuous tools use the
same `data-asw` stylesheets as every other tool.
