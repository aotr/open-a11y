# ⚙️ Configuration System — Schema, Defaults & Merge Logic

> `src/config/accessibility.config.ts`

The configuration system defines what the accessibility widget CAN do, what features are visible, and how project-level overrides merge with package defaults.

---

## 📐 Configuration Schema

```ts
interface IAccessibilityConfig {
  side?: 'right' | 'left'
  defaultLanguage?: string
  lang?: string
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  offset?: [number, number]
  blur?: boolean
  enabled?: boolean
  buttonSize?: number
  showButton?: boolean
  triggerSelector?: string
  brand?: IAccessibilityBrand
  labels?: Record<string, string>
  features?: IAccessibilityFeatures
  hooks?: IAccessibilityHooks
}
```

### Layout & Behaviour

| Field | Type | Default | Description |
|---|---|---|---|
| `side` | `'right' \| 'left'` | `'right'` | Panel slide direction |
| `position` | string | `'bottom-right'` | Floating button position |
| `offset` | `[number, number]` | `[20, 20]` | Button offset from edge in px |
| `blur` | `boolean` | `false` | Backdrop blur when panel is open |
| `enabled` | `boolean` | `true` | Master switch — set `false` to disable the entire widget |
| `buttonSize` | `number` | `56` | Floating button diameter in px (icon scales proportionally) |
| `showButton` | `boolean` | `true` | Show/hide the floating button (user can override via menu toggle) |
| `triggerSelector` | `string` | `''` | CSS selector for external trigger elements that toggle the sidebar on click |
| `brand` | `IAccessibilityBrand` | neutral green | Name, URL, footer copy, and `--asw-brand-*` colors |
| `labels` | `Record<string, string>` | `{}` | Override any UI string by i18n key (e.g. `widget.menuTitle`) |

### Features

```ts
interface IAccessibilityFeatures {
  tools?: Record<string, boolean>     // 'font-size': true/false
  profiles?: Record<string, boolean>  // 'vision-impaired': true/false
  languageChange?: boolean            // Show language switcher
  shortcuts?: boolean                 // Show keyboard shortcuts card
  hideButtonToggle?: boolean          // Show "Hide floating button" toggle near the bottom of the panel
}
```

**`tools` flags** control visibility, not functionality. Setting `'monochrome': false` hides it from the panel but doesn't prevent programmatic use.

**`profiles` flags** same principle — hide profiles you don't want users to see.

### Hooks

```ts
interface IAccessibilityHooks {
  onAction?: (event: {
    action: string         // 'toggle-tool' | 'apply-profile' | 'change-language' | 'reset'
    id?: string
    value?: unknown
    states: Record<string, unknown>  // Full state snapshot
  }) => void
}
```

The `onAction` callback fires after every user interaction. Use it for analytics, logging, or triggering side effects.

---

## 🏭 Default Configuration

```ts
export const DEFAULT_ACCESSIBILITY_CONFIG: Required<IAccessibilityConfig> = {
  side: 'right',
  defaultLanguage: 'en',
  lang: 'en',
  position: 'bottom-right',
  offset: [20, 20],
  blur: false,
  enabled: true,
  buttonSize: 56,
  showButton: true,
  triggerSelector: '',
  brand: {
    name: '',
    url: '',
    // footerText omitted: falls back to "Accessibility by {name}"
    primary: 'hsl(158, 64%, 35%)',
    primaryDark: 'hsl(158, 64%, 28%)',
    accent: 'hsl(47.9, 95.8%, 53.1%)',
  },
  labels: {},
  features: {
    // Derived from the tool manifest: every tool is visible by default.
    tools: Object.fromEntries(TOOLS.map((tool) => [tool.id, true])),
    // Derived from the profile registry: every profile is visible by default.
    profiles: Object.fromEntries(Object.keys(PROFILES).map((id) => [id, true])),
    languageChange: true,
    shortcuts: true,
    hideButtonToggle: true,
  },
  hooks: {
    onAction: () => {},
  },
}
```

**Design philosophy:** All tools and profiles are visible by default. Projects opt out of the features they don't want. This is the inverse of the old opt-in model, which silently hid tools whenever the manifest grew.

---

## 🔀 Merge Logic (`mergeConfig`)

**The most important function.** Merges a partial user config on top of defaults
or an already-resolved engine config:

```ts
export function mergeConfig(
  custom?: IAccessibilityConfig,
  base: Required<IAccessibilityConfig> = DEFAULT_ACCESSIBILITY_CONFIG
): Required<IAccessibilityConfig>
```

`custom` wins, then `base`, then package defaults. Objects merge shallowly:
`brand`, `labels`, `features.tools`, `features.profiles`, and `hooks` keep
unspecified base keys.

### Merge Rules

| Pattern | Example | Result |
|---|---|---|
| `??` nullish coalescing | `custom.side ?? base.side` | Custom if provided, else base |
| Spread for objects | `{ ...base.brand, ...custom.brand }` | Custom keys override base keys |
| Side → position inference | `custom.side === 'left' ? 'bottom-left' : ...` | Position follows an explicit side change |
| `lang` / `defaultLanguage` fallback | `custom.lang ?? custom.defaultLanguage ?? base.lang` | Three-level fallback |
| Deep clone | `cloneConfig(base)` | The engine snapshot is never mutated |

### Example

```ts
const config = mergeConfig({
  side: 'left',
  blur: false,
  features: {
    tools: { 'monochrome': true, 'readable-font': true },
    languageChange: true,
  },
})

// Result:
// side: 'left'
// position: 'bottom-left'  (auto-inferred from side)
// blur: false
// features.tools.font-size: true   (from defaults)
// features.tools.monochrome: true   (from custom)
// features.tools.readable-font: true (from custom)
// features.languageChange: true      (from custom)
```

---

## 🔗 Usage in the Widget

```ts
// AccessibilityEngine constructor
const engine = new AccessibilityEngine({
  storage: localStorageAdapter,
  config: mergeConfig({ side: 'left' }),
})

// UI adapters consume the resolved snapshot
const merged = engine.config
menu.setFeatures(merged.features)
if (!merged.blur) menu.setAttribute('no-blur', '')
```

The engine resolves config **once**. `createAccessibilityUI`, the provider, and the
web components read `engine.config`; explicit UI options are overlaid with
`mergeConfig(uiOptions, engine.config)`. Do not call `mergeConfig()` a second time
without passing the engine snapshot.

---

## 📁 Project-Level Config Pattern

```ts
// src/config/accessibility.config.ts (in YOUR project)
import { mergeConfig } from '@aotr/open-a11y'

export default mergeConfig({
  side: 'right',
  features: {
    tools: {
      'monochrome': true,
      'readable-font': true,
      'highlight-links': true,
    },
    languageChange: true,
  },
})
```

This is the recommended pattern. The package provides defaults via `mergeConfig()`;
your project overrides only what it needs. **Never edit the package source.**
