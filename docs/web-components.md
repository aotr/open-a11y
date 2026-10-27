# 🧩 Web Components — Shadow DOM UI Elements

> `src/ui/components/`

The accessibility widget UI is built with **Web Components** (Custom Elements v1) using **Shadow DOM** for fully encapsulated styles. This means the widget's CSS never leaks into the page, and the page's CSS never affects the widget.

---

## 🏗️ Component Tree

```
<asw-widget>            ← Floating button (fixed position)
    │
    └── (click) → opens/closes <asw-menu>

<asw-menu>              ← Sidebar panel (slide-in)
    ├── Profile cards   ← <button class="asw-profile">
    ├── Language select ← <select id="asw-language">
    ├── Font adjuster   ← <div class="asw-adjust-font">
    ├── Tool buttons    ← <button class="asw-btn asw-filter">
    ├── Shortcuts card  ← <div class="asw-shortcuts-card">
    └── Reset button    ← <button class="asw-menu-reset">

<asw-toggle>            ← reusable toggle switch
<asw-slider>            ← reusable range slider
```

---

## 🔲 `<asw-widget>` — Floating Button

**File:** `src/ui/components/asw-widget.ts`

A fixed-position circular button with a trust-green gradient.

**Attributes:**

| Attribute            | Type   | Default        | Description                                            |
| -------------------- | ------ | -------------- | ------------------------------------------------------ |
| `position`           | string | `bottom-right` | `bottom-left`, `bottom-right`, `top-left`, `top-right` |
| `offset-x`           | number | `20`           | Horizontal offset in px                                |
| `offset-y`           | number | `20`           | Vertical offset in px                                  |
| `button-size`        | number | `56`           | Desktop diameter in px. Sets `--asw-btn-size`          |
| `button-size-mobile` | number | `44`           | Diameter at ≤768px. Sets `--asw-btn-size-mobile`       |
| `show-button`        | string | `true`         | `"true"` / `"false"` — show or hide the button         |
| `aria-expanded`      | string | `false`        | Synced with sidebar state                              |

**Methods (public API):**

| Method                   | Description                                   |
| ------------------------ | --------------------------------------------- |
| `showButton()`           | Make the floating button visible              |
| `hideButton()`           | Hide the floating button                      |
| `buttonVisible` (getter) | Returns `true` if button is currently visible |
| `setExpanded(bool)`      | Sync ARIA expanded state                      |

**Events:**

| Event      | When                                    |
| ---------- | --------------------------------------- |
| `asw:open` | Button is clicked → sidebar should open |

**How positioning works:**

```ts
private _applyPosition(): void {
  const position = this.getAttribute('position') ?? 'bottom-right'
  const offsetX = parseInt(this.getAttribute('offset-x') ?? '20', 10)
  const offsetY = parseInt(this.getAttribute('offset-y') ?? '20', 10)

  switch (position) {
    case 'bottom-right':
      this.style.bottom = `${offsetY}px`
      this.style.right = `${offsetX}px`
      break
    case 'bottom-left':
      this.style.bottom = `${offsetY}px`
      this.style.left = `${offsetX}px`
      break
    // ... etc
  }
}
```

**Pulse animation:** On first mount, the button plays a CSS pulse animation 3 times (1.8s each) to draw attention. A `setTimeout` removes the pulse class after 5.5s.

---

## 📋 `<asw-menu>` — Settings Sidebar

**File:** `src/ui/components/asw-menu.ts`

The main sidebar panel with all accessibility controls. Rendered entirely in Shadow DOM via an HTML template string.

**Attributes:**

| Attribute | Type                  | Description                         |
| --------- | --------------------- | ----------------------------------- |
| `lang`    | string                | Current language code               |
| `open`    | `"true"` or absent    | Sidebar visibility                  |
| `side`    | `"left"` or `"right"` | Which side the panel slides from    |
| `no-blur` | `""` or absent        | Disables backdrop blur when present |

**Events (dispatched outward):**

| Event                                 | Detail                | When                                              |
| ------------------------------------- | --------------------- | ------------------------------------------------- |
| `asw:toggle`                          | `{ toolId, enabled }` | Boolean tool clicked                              |
| `asw:contrast`                        | `{ key, enabled }`    | Contrast filter clicked                           |
| `asw:profile`                         | `{ profileId }`       | Profile card clicked                              |
| `asw:profile-deactivate`              | `{ profileId }`       | Profile deselected                                |
| `asw:textalign`                       | `{ key, enabled }`    | Text alignment clicked                            |
| `asw:continuous`                      | `{ toolId, value }`   | Font size, line height, or letter spacing changed |
| `asw:language`                        | `{ lang }`            | Language changed                                  |
| `asw:reset`                           | —                     | Reset button clicked                              |
| `asw:hide-button` / `asw:show-button` | —                     | Floating button visibility toggled                |
| `asw:closed`                          | —                     | Close button or overlay clicked                   |
| `asw:opened`                          | —                     | Sidebar opened                                    |

**How the template works:**

The entire UI is defined as an HTML string in `getMenuTemplate()`. On construction, it's stamped into the Shadow DOM:

```ts
constructor() {
  super()
  this.attachShadow({ mode: 'open' })
  const tpl = document.createElement('template')
  tpl.innerHTML = getMenuTemplate()
  this.shadowRoot!.appendChild(tpl.content.cloneNode(true))
}
```

**Event delegation:** All button clicks are handled via event listeners attached in `connectedCallback()`:

```ts
this.shadowRoot!.querySelectorAll(".asw-btn").forEach((el) => {
  el.addEventListener("click", (e) => this._onToolClick(e));
});
```

**Category of clicks:**

- `.asw-filter` → dispatches `asw:contrast`
- `.asw-text-align` → dispatches `asw:textalign`
- `.asw-profile` → dispatches `asw:profile` or `asw:profile-deactivate`
- Continuous controls → dispatch `asw:continuous`
- Everything else → dispatches `asw:toggle`

---

## 🔄 State Synchronization

### `menu.syncTools(states)`

Updates all button `aria-pressed` states and class toggles to match engine state:

```ts
syncTools(states: Record<string, unknown>): void {
  this.shadowRoot!.querySelectorAll('.asw-btn').forEach((btn) => {
    const key = btn.dataset.key
    const shouldBeSelected = isProfile
      ? (states?.activeProfile === key)
      : !!states?.[key]

    btn.classList.toggle('asw-selected', shouldBeSelected)
    btn.setAttribute('aria-pressed', String(shouldBeSelected))
  })
}
```

Called on every engine state change (via `engine.subscribe()`).

### `menu.setFeatures(features)`

Shows/hides sections based on the `features` config:

```ts
setFeatures(features): void {
  // Hide individual tools where features.tools[id] === false
  // Hide entire cards where ALL tools in that card are disabled
  // Hide language switcher if features.languageChange === false
  // Hide shortcuts card if features.shortcuts === false
}
```

---

## 🎨 Shadow DOM CSS (`accessibility.rawcss`)

**File:** `src/ui/styles/accessibility.rawcss`

All widget styles live in a single raw CSS file imported as a string. This is injected into the Shadow DOM's `<style>` tag — **fully encapsulated**.

**CSS Custom Properties (theme):**

```css
:host {
  --asw-primary: #1f4bd8; /* Default cobalt */
  --asw-accent: hsl(47.9, 95.8%, 53.1%); /* Golden yellow */
  --asw-bg: #f0f2f6;
  --asw-card-bg: #ffffff;
  --asw-text: #242424;
  --asw-sidebar-width: 420px;
}
```

**Dark mode support:**

```css
:host-context(.dark) {
  --asw-bg: hsl(213, 39%, 9%);
  --asw-card-bg: hsl(20, 14.3%, 4.1%);
  --asw-text: #a2adc8;
}
```

Uses `:host-context(.dark)` — when the parent page has class `.dark`, the widget switches to dark theme.

---

## 🔧 Custom Element Registration

Each component self-registers:

```ts
if (typeof customElements !== "undefined") {
  customElements.define("asw-menu", AswMenu);
}
```

The `typeof customElements !== 'undefined'` guard prevents SSR crashes — `customElements` doesn't exist in Node.js.

---

## 🔗 External Triggers & Global API

The accessibility sidebar can be toggled from **any element on the page**, not just the floating button. This is handled in `src/ui/wire-up.ts`.

### 1. `data-asw-toggle` attribute

Add the `data-asw-toggle` attribute to any HTML element. Clicking it toggles the sidebar:

```html
<button data-asw-toggle>Accessibility</button>
<!-- or an icon in the header -->
<span data-asw-toggle class="header-icon">♿</span>
```

### 2. `triggerSelector` config option

Pass a CSS selector in the configuration — all matching elements become toggle triggers:

```js
const config = mergeConfig({
  triggerSelector: "#header-accessibility-btn, .nav-icon--a11y",
});
```

### 3. Custom DOM event

Dispatch `asw:toggle-accessibility` anywhere on `document`:

```js
document.dispatchEvent(new CustomEvent("asw:toggle-accessibility"));
```

### 4. Global JavaScript API

Three functions are exposed on `window` for programmatic control:

```js
window.__aswToggle(); // Toggle sidebar open/close
window.__aswOpen(); // Open the sidebar
window.__aswClose(); // Close the sidebar
```

### Priority

When the floating button is hidden (via menu toggle or `showButton: false`), external triggers still work — they remain the only way to open the sidebar.

---

## 🙈 Hide Floating Button

The menu includes a **"Hide floating button"** checkbox in its footer. When checked:

- The floating `<asw-widget>` button is hidden
- The preference is saved to `localStorage` under key `asw-hide-button`
- The sidebar can still be opened via external triggers, `data-asw-toggle`, or the global API
- Unchecking the box restores the button and removes the localStorage entry

### Configuration

Control whether the "Hide floating button" toggle appears in the menu:

```js
const config = mergeConfig({
  features: {
    hideButtonToggle: false, // hides the toggle from the menu footer (default: true)
  },
});
```

Setting `showButton: false` in the top-level config initially hides the button without showing the toggle.
