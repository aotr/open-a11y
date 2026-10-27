# 🏪 StateManager — Internal Preference Store

> `src/state/StateManager.ts` · **internal, not a package-root export**

The **StateManager** is a lightweight observable state machine that holds all
accessibility preferences, normalizes canonical keys, notifies subscribers, and
persists to a storage adapter automatically. `AccessibilityEngine` is the public
state owner; consumers should use the engine API.

The class remains importable from `src/state/StateManager` for tests and internal
code. It is not exported from `open-a11y`.

---

## 🧠 Responsibilities

| Responsibility        | Implementation                                        |
| --------------------- | ----------------------------------------------------- |
| Hold current settings | `ISettings { lang, states, updatedAt }`               |
| Notify subscribers    | `Set<StateChangeListener>` — called on every mutation |
| Persist automatically | Writes to `IStorageAdapter` on every state change     |
| Hydrate from storage  | Reads from `IStorageAdapter` on initialization        |
| Support batch updates | `setMany()` for multi-tool profile application        |
| Support full reset    | `reset()` clears all states, preserves language       |

---

## 📊 State Shape

```ts
interface ISettings {
  lang?: string; // Active language code ('en', 'hi')
  states?: ISettingsStates; // Tool states keyed by tool ID
  updatedAt?: string; // ISO timestamp of last change
}

interface ISettingsStates {
  // Boolean tools
  "font-weight"?: boolean;
  "readable-font"?: boolean;
  "highlight-links"?: boolean;
  invert?: boolean;
  "big-cursor"?: boolean;
  "visible-focus"?: boolean;
  "stop-animations"?: boolean;
  "reduced-motion"?: boolean;
  "reading-guide"?: boolean;
  "reading-ruler"?: boolean;
  "focus-mode"?: boolean;
  // ... all other boolean tools

  // Continuous tools
  fontSize?: number; // 0.1–2.0
  lineHeight?: number; // 1.0–3.0
  letterSpacing?: number; // 0–10

  // Exclusive contrast (string, not boolean)
  contrast?: string; // 'dark-contrast' | 'light-contrast' | etc.

  // Profile tracking
  activeProfile?: string | null; // Currently active profile ID, or null
}
```

---

## 🔄 How It Works

### Constructor

```ts
constructor(storage: IStorageAdapter, initial?: Partial<ISettings>)
```

1. Stores the storage adapter reference
2. Merges initial settings on top of defaults
3. Creates an empty `Set` of listeners

### Reading State

```ts
getState(): Readonly<ISettings>
```

Returns a **frozen** (immutable) snapshot with a shallow-cloned `states` object. Prevents accidental mutation by consumers.

### Writing State — `setTool()`

```ts
setTool(key: string, value: unknown): void {
  this.settings.states = { ...this.settings.states, [key]: value }
  this.settings.updatedAt = new Date().toISOString()
  this.notify()     // Call all listeners
  this.persist()    // Write to localStorage
}
```

**Every mutation:**

1. Creates a new `states` object (immutable update pattern)
2. Sets the `updatedAt` timestamp
3. Calls `notify()` — iterates all listeners with the new settings
4. Calls `persist()` — writes to the storage adapter

### Batch Updates — `setMany()`

```ts
setMany(states: ISettingsStates): void {
  this.settings.states = { ...this.settings.states, ...states }
  // ... notify + persist
}
```

Merges ALL profile states at once — only one notification + one persistence call, instead of one per tool.

### Reset

```ts
reset(): void {
  this.settings = {
    ...DEFAULT_SETTINGS,
    lang: this.settings.lang, // Preserve language
  }
  // ... notify + persist
}
```

Note: **Language preference is preserved** across resets.

### Persistence

```ts
private persist(): void {
  try {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(this.settings))
  } catch (err) {
    console.warn('Failed to persist accessibility settings:', err)
  }
}
```

- Storage key: `'asw-user-settings'`
- Serializes to JSON
- Errors are caught and logged (e.g., localStorage full, private browsing)

### Hydration

```ts
hydrate(): void {
  try {
    const raw = this.storage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      this.settings = { ...DEFAULT_SETTINGS, ...parsed }
      this.notify()
    }
  } catch (err) {
    console.warn('Failed to hydrate accessibility settings:', err)
  }
}
```

Called once at engine startup. Reads from storage, parses JSON, merges with defaults. If parsing fails (corrupted data), falls back to defaults.

---

## 📡 Subscriber Pattern

```ts
// Subscribe
const unsubscribe = stateManager.subscribe((settings) => {
  console.log("Settings changed:", settings.states);
  // React setState, UI update, analytics, etc.
});

// Unsubscribe
unsubscribe();
```

Listeners receive a **frozen** settings object — safe to read but not to mutate.

---

## 🔗 Storage Key

```ts
export const STORAGE_KEY = "asw-user-settings";
```

Same key across all adapters (localStorage, memory, cookie). This is the single source of truth for persisted preferences.
