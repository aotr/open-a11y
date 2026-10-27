# ⚛️ React Adapter — Provider, Hooks & Components

> `src/react/`

The React adapter wraps the framework-agnostic `AccessibilityEngine` in idiomatic React patterns: Context, hooks, and ready-to-use components.

---

## 🏗️ Architecture

```
┌───────────────────────────────┐
│ <AccessibilityProvider>        │  ← React Context provider
│   engine={engine}              │     Wraps the AccessibilityEngine
│   autoInit                     │     Calls engine.init() on mount
│   showWidgetOnMount            │     Auto-mounts the UI widget
│                                │
│   ┌─────────────────────────┐ │
│   │ <App>                    │ │  ← Your app
│   │   <AccessibilityWidget>  │ │  ← Floating button (auto-mounted)
│   │   {children}             │ │
│   │ </App>                   │ │
│   └─────────────────────────┘ │
└───────────────────────────────┘
```

---

## 📦 `<AccessibilityProvider>`

**File:** `src/react/provider/AccessibilityProvider.tsx`

The root component that provides accessibility state to the entire React tree.

### Props

```ts
interface AccessibilityProviderProps {
  children: ReactNode
  engine: AccessibilityEngine          // Pre-initialized engine instance
  autoInit?: boolean                   // Call engine.init() on mount (default: true)
  showWidgetOnMount?: boolean          // Auto-mount the floating button (default: false)
  widgetOptions?: UIOptions            // Options for the UI widget if auto-mounted
}
```

### How It Works

**1. Creates a React Context:**

```ts
const AccessibilityReactContext = createContext<AccessibilityContextValue | null>(null)
```

**2. Initializes the engine on mount:**

```ts
useEffect(() => {
  if (!autoInit || initialized) return
  engine.init().then(() => {
    setSettings(engine.settings)
    setInitialized(true)
  })
  const unsub = engine.subscribe((newSettings) => {
    setSettings(newSettings)  // React state → re-render
  })
  return () => unsub()
}, [engine, autoInit])
```

**3. Subscribes to engine state changes:**

The `engine.subscribe()` callback calls `setSettings()`, triggering React re-renders. This bridges the imperative engine API with React's declarative model.

**4. Provides memoized callbacks:**

```ts
const toggleTool = useCallback(
  (toolId: string, enabled?: boolean) => engine.toggleTool(toolId, enabled),
  [engine]
)
```

All engine methods are wrapped in `useCallback` for referential stability.

---

## 🪝 Hooks

### `useAccessibilityContext()`

Returns the full context value. Throws if used outside `<AccessibilityProvider>`.

```ts
const { settings, toggleTool, setFontScale, applyProfile, engine } =
  useAccessibilityContext()
```

### `useAccessibility()`

Primary hook for most use cases. Returns a convenient API:

```ts
const {
  states,        // Current tool states
  lang,          // Current language
  toggleTool,     // (toolId, enabled?) => void
  setFontScale,   // (scale: 0.1-2.0) => void
  applyProfile,   // (profileId) => void
  setLanguage,    // (lang) => void
  reset,          // () => void
} = useAccessibility()
```

### `useAccessibilityTool(toolId: string)`

Hook for a single tool:

```ts
const { enabled, toggle, setEnabled } = useAccessibilityTool('monochrome')
// enabled: boolean — current state
// toggle: () => void — toggle on/off
// setEnabled: (v: boolean) => void — set explicitly
```

### `useAccessibilityProfile()`

Hook for profile management:

```ts
const { apply, availableProfiles, isProfileActive } = useAccessibilityProfile()
// apply: (profileId) => void
// availableProfiles: IProfile[]
// isProfileActive: (id) => boolean
```

---

## 🧩 Components

### `<AccessibilityWidget>`

**File:** `src/react/components/AccessibilityWidget.tsx`

Mounts the Web Component UI (floating button + sidebar) into the DOM. This component renders **nothing** — it calls `createAccessibilityUI()` as a side effect.

```tsx
<AccessibilityWidget
  position="bottom-right"
  side="right"
  blur={true}
/>
```

**Props:**
| Prop | Type | Description |
|---|---|---|
| `position` | `'bottom-left' \| 'bottom-right' \| 'top-left' \| 'top-right'` | Button position |
| `side` | `'right' \| 'left'` | Panel slide direction |
| `blur` | `boolean` | Backdrop blur when open |
| `offsetX` | `number` | Horizontal offset in px |
| `offsetY` | `number` | Vertical offset in px |

**How it works:**

```ts
useEffect(() => {
  uiRef.current = createAccessibilityUI(engine, {
    position, offsetX, offsetY, side, blur,
    container: target ?? undefined,
  })
  return () => { uiRef.current?.destroy() }
}, [engine, position, offsetX, offsetY, side, blur, container, mountSelector])
```

- Props are explicit UI overrides; omitted values come from `engine.config`
- Cleanup calls `destroy()` only if this mount still owns the active session
- Provider `showWidget` / `hideWidget` and the declarative widget use the same
  process-wide registry, so a declarative widget plus `showWidgetOnMount` still
  produces exactly one widget

### `<AccessibilityPanel>`

**File:** `src/react/components/AccessibilityPanel.tsx`

Renders the full settings panel **inline** — useful for embedding in a settings/dashboard page rather than as a floating widget.

```tsx
<AccessibilityPanel />
```

**What it renders:**
- Profile cards (7 profiles in a 3-column grid)
- Language selector (`<select>`)
- Font size adjuster with +/- buttons
- Content adjustments grid
- Color adjustments grid
- Tools grid

Uses the same `useAccessibility()` hook as the Web Component menu — toggling here syncs with the floating widget automatically.

---

## 🔄 Data Flow

```
User clicks toggle in <AccessibilityPanel>
  → useAccessibility().toggleTool('monochrome')
    → AccessibilityContextValue.toggleTool
      → engine.toggleTool('monochrome', true)
        → internal StateManager.setTool(...)
          → notify() → engine.subscribe callback
            → setSettings(newSettings)
              → React re-renders all consumers
                → UI updates in both <AccessibilityPanel> AND <asw-menu>
```
