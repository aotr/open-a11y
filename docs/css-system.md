# 🎨 CSS System — Dynamic Generation & Injection

> `src/css/`

The CSS system dynamically generates and injects `<style>` elements into the page `<head>`. Every accessibility tool effect is delivered via CSS — there's no direct DOM manipulation for visual changes.

---

## 🏗️ Architecture

```
┌─────────────────────┐
│ cssGenerator.ts      │  Generates CSS strings from tool configs
│ generateCSS()         │  Pure functions — no side effects
│ generateCSSFromConfig()│
│ wrapCSSToSelector()   │
└─────────┬───────────┘
          │ CSS string
          ▼
┌─────────────────────┐
│ cssInjector.ts       │  Injects/removes <style> elements
│ upsertStylesheet()   │  Create, update, or remove by ID
│ injectToolCSS()      │  Higher-level injection with validation
│ removeStylesheet()   │  Remove by ID
│ removeAllStylesheets()│  Cleanup on reset
└─────────┬───────────┘
          │ <style> element
          ▼
┌─────────────────────┐
│ Page <head>          │
│ <style id="asw-..."> │  Multiple style tags, one per tool
│   ...css rules...    │
│ </style>             │
└─────────────────────┘
```

---

## 📝 CSS Generator (`cssGenerator.ts`)

### `generateCSS(config: IToolConfig): string`

Generates a CSS string for a single tool configuration.

```ts
export function generateCSS(config: IToolConfig): string {
  const selectors = config.selectors ?? ALL_ELEMENT_SELECTORS
  const properties = Object.entries(config.cssProperties ?? {})
    .map(([prop, value]) => `${prop}: ${value}`)
    .join('; ')
  return `${selectors} { ${properties} }`
}
```

### `generateCSSFromConfig(tools: IToolConfig[]): string`

Generates CSS for multiple tools at once.

### `wrapCSSToSelector(css: string, selector: string): string`

Wraps existing CSS in a parent selector for scoping.

---

## 💉 CSS Injector (`cssInjector.ts`)

### `upsertStylesheet(id: string, css: string): void`

**The most important function.** Creates, updates, or removes a `<style>` element by ID.

```ts
export function upsertStylesheet(id: string, css: string): void {
  let el = document.getElementById(id) as HTMLStyleElement | null

  // Empty CSS → remove the style tag
  if (!css) {
    el?.remove()
    return
  }

  // Create if not exists
  if (!el) {
    el = document.createElement('style')
    el.id = id
    el.setAttribute('data-asw', 'true')
    document.head.appendChild(el)
  }

  // Update content
  el.textContent = css
}
```

Every injected stylesheet carries `data-asw="true"`. The React build, continuous
tools, and generated tool CSS all go through this one injector.

**States:**
| CSS value | Action |
|---|---|
| `''` (empty string) | Remove the `<style>` element |
| Non-empty string | Create new or update existing |

**Example:**

```ts
// Tool ON:
upsertStylesheet('asw-font-weight',
  '* { font-weight: 600 !important; }')
// → Creates <style id="asw-font-weight">* { font-weight: 600 !important; }</style>

// Tool OFF:
upsertStylesheet('asw-font-weight', '')
// → Removes <style id="asw-font-weight">
```

### `injectToolCSS(id: string, css: string): void`

Higher-level injection with safety checks. Wraps `upsertStylesheet`.

### `removeStylesheet(id: string): void`

```ts
export function removeStylesheet(id: string): void {
  document.getElementById(id)?.remove()
}
```

### `setStyleNonce(nonce: string | null): void`

Sets the CSP nonce applied to every existing and future `data-asw` stylesheet:

```ts
import { setStyleNonce } from '@aotr/open-a11y'

setStyleNonce(document.querySelector('meta[name="csp-nonce"]')?.content)
```

### `removeAllStylesheets(): void`

Removes ALL accessibility-injected stylesheets plus root classes and
`--asw-font-scale`. Called on `engine.reset()`.

```ts
export function removeAllStylesheets(): void {
  document.querySelectorAll('style[id^="asw-"]').forEach(el => el.remove())
  document.documentElement.classList.forEach((name) => {
    if (name.startsWith('asw-')) document.documentElement.classList.remove(name)
  })
  document.documentElement.style.removeProperty('--asw-font-scale')
}
```

### Continuous tools

Font size, line height, and letter spacing are not special-cased style tags.
They call `upsertStylesheet()` too:

```ts
adjustLineHeight(1.4)
// → <style id="asw-line-height" data-asw="true">...</style>

adjustLineHeight(1)
// → removeStylesheet('asw-line-height')
```

---

## 🎯 Selectors (`selectors.ts`)

Pre-defined CSS selector strings shared across all tools:

```ts
// src/css/selectors.ts
export const ALL_ELEMENT_SELECTORS =
  'body, p, li, td, div, span, a, h1, h2, h3, h4, h5, h6'

export const ALL_SELECTORS =
  '*, *::before, *::after'
```

Tools choose the appropriate selector:
- **Typography tools** → `ALL_ELEMENT_SELECTORS` (text elements only)
- **Stop animations** → `ALL_SELECTORS` (every element)
- **Big cursor** → `ALL_SELECTORS` (every element needs the cursor)
- **Contrast** → `html` (applied to root)

---

## 🔬 Why CSS Instead of DOM Manipulation?

| Approach | Pros | Cons |
|---|---|---|
| **CSS injection** (our approach) | Instant; works on dynamic content; no mutation observers needed | Can't override inline styles without `!important` |
| DOM manipulation | Precise control | Fails on dynamically added elements; requires MutationObserver; slow |

**CSS injection is the right choice for accessibility** because:
1. **New content is automatically covered** — no need to watch for DOM changes
2. **Performance** — a single `<style>` element affects the entire page
3. **Clean teardown** — removing the `<style>` element instantly reverts all changes

---

## 🧹 Cleanup on Reset

```ts
// engine.reset()
removeAllStylesheets()
// → Removes ALL <style id="asw-*"> elements
// → Removes asw-* root classes and --asw-font-scale
// → Page returns to its original visual state
```

The `id^="asw-"` / `asw-` prefix convention ensures only accessibility-injected
styles and root classes are removed — site CSS is never touched.
