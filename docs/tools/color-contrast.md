# 🎨 Color & Contrast — Contrast Modes, Invert, Saturation, Monochrome

> `src/tools/color/`

Color adjustment tools modify the visual palette of the entire page. **Contrast modes are exclusive** — only one can be active at a time.

---

## 🎯 Contrast System (`contrast.ts`)

**Type:** Exclusive string selection (not boolean)

Unlike other tools, contrast modes use a **single string value** (`contrast`) in the state, not individual boolean flags. The engine enforces exclusivity via `CONTRAST_KEYS`.

**Available modes:**

| Mode              | CSS Filter                        | Use Case                      |
| ----------------- | --------------------------------- | ----------------------------- |
| `dark-contrast`   | `invert(1) hue-rotate(180deg)`    | Light text on dark background |
| `light-contrast`  | Reduced contrast, soft palette    | Light sensitivity             |
| `high-contrast`   | `contrast(200%) brightness(110%)` | Maximum readability           |
| `high-saturation` | `saturate(200%)`                  | Better color differentiation  |
| `low-saturation`  | `saturate(20%)`                   | Reduced visual stimulation    |
| `monochrome`      | `grayscale(100%)`                 | Complete color removal        |

**How it works:**

```ts
// src/tools/color/contrast.ts
const FILTERS: Record<string, string> = {
  "dark-contrast": "invert(1) hue-rotate(180deg)",
  "light-contrast": "brightness(110%) contrast(90%)",
  "high-contrast": "contrast(200%) brightness(110%)",
  "high-saturation": "saturate(200%)",
  "low-saturation": "saturate(20%)",
  monochrome: "grayscale(100%)",
};

export function enableContrast(mode: string | false): void {
  if (mode === false) {
    // Remove all contrast filters
    upsertStylesheet("asw-contrast", "");
    return;
  }
  const filter = FILTERS[mode];
  if (filter) {
    upsertStylesheet("asw-contrast", `html { filter: ${filter} !important; }`);
  }
}
```

**Exclusivity enforcement in the engine:**

```ts
// When 'monochrome' is toggled ON:
handleContrastToggle('monochrome', true)
  → for each key in CONTRAST_KEYS:
      if key !== 'monochrome' → StateManager.setTool(key, false)
  → enableContrast('monochrome')
```

This ensures only ONE filter is applied to `<html>` at any time.

---

## 🔄 Invert Colors (`invert.ts`)

**Type:** Boolean toggle

**How it works:**

```ts
// src/tools/color/invert.ts
export default function invert(enable: boolean): void {
  upsertStylesheet(
    "asw-invert",
    enable
      ? `html { filter: invert(1) hue-rotate(180deg) !important; }
       img, video, canvas { filter: invert(1) hue-rotate(180deg) !important; }`
      : "",
  );
}
```

**Key detail:** Images, videos, and canvas elements get a **double inversion** — inverting the already-inverted parent restores their original colors. Without this, photos would appear with negative colors.

**CSS cascade:**

```
html → invert(1)        [everything inverted]
  img → invert(1)       [re-inverted → looks normal]
  video → invert(1)     [re-inverted → looks normal]
```

---

## 🎨 CSS Filter Pipeline

All color tools inject CSS `filter` properties on `<html>`. Browsers apply filters in the order specified:

```
html {
  filter: grayscale(100%) contrast(200%) saturate(200%);
}
```

Each filter function is composable — you can combine them in a single rule. However, **contrast modes are exclusive** to prevent conflicting filters (e.g., `grayscale(100%)` + `saturate(200%)` would be contradictory).

---

## 🔧 Engine Integration

### Toggle Flow

```
User clicks "Monochrome" in panel
  → wire-up.ts fires asw:contrast event
  → engine.toggleTool('monochrome', true)
      ├── handleContrastToggle('monochrome', true)
      │     ├── Disable all other CONTRAST_KEYS in StateManager
      │     └── enableContrast('monochrome')
      │           └── upsertStylesheet('asw-contrast',
      │               'html { filter: grayscale(100%) !important; }')
      └── StateManager.setTool('monochrome', true)
            └── Notify subscribers, persist to localStorage
```

### Toggle OFF: Clicking an active contrast mode deselects it

```
User clicks "Monochrome" (already active)
  → asw:contrast event with enabled: false
  → enableContrast(false)
      └── upsertStylesheet('asw-contrast', '')
            └── Removes the <style> tag from <head>
  → StateManager.setTool('monochrome', false)
```
