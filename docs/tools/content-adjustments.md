# 📝 Content Adjustments — Font Size, Weight, Line Height, Letter Spacing, Dyslexia Font, Hide Images, Text Alignment

> `src/tools/content/`

Content adjustment tools modify typography and text presentation. Unlike boolean on/off tools, **font-size, line-height, and letter-spacing** are **continuous values** with stepped adjustment controls.

---

## 🔤 Font Size (`fontSize.ts`)

**Range:** 0.1 – 2.0 (10% – 200%)

**How it works:**

```ts
// src/tools/content/fontSize.ts
export function adjustFontSize(scale: number): void {
  const clamped = Math.max(0.1, Math.min(2.0, scale));
  document.documentElement.style.setProperty("--asw-font-scale", String(clamped));
}
```

1. Clamps the value to `[0.1, 2.0]`
2. Sets `--asw-font-scale` CSS custom property on `<html>`
3. All site CSS references this variable:

```css
/* In your existing CSS */
body {
  font-size: calc(1rem * var(--asw-font-scale, 1));
}
```

**UI Controls:** The adjustment panel shows +/- buttons with a live percentage display. Each step = ±0.1 (10%).

**Engine Integration:**

```ts
// engine.setFontScale(1.5)
// → adjusts font-size to 150%
// → stores `{ fontSize: 1.5 }` in StateManager
// → clears active profile (manual adjustment)
```

---

## 💪 Font Weight (`fontWeight.ts`)

**Type:** Boolean toggle

**How it works:**

```ts
// src/tools/content/fontWeight.ts
export default function fontWeight(enable: boolean): void {
  upsertStylesheet("asw-font-weight", enable ? `* { font-weight: 600 !important; }` : "");
}
```

- **ON:** Injects `* { font-weight: 600 !important; }` via a `<style>` tag
- **OFF:** Removes the `<style>` tag
- Uses `upsertStylesheet(id, css)` — creates/updates a `<style>` element with a unique ID

**CSS Injection:** The stylesheet is identified by `asw-font-weight` so it can be cleanly removed.

---

## 📏 Line Height (`lineHeight.ts`)

**Range:** 1.0 – 3.0 (adjustable in 0.2 steps)

**How it works:**

```ts
// src/tools/content/lineHeight.ts
export function adjustLineHeight(value: number): void {
  upsertStylesheet(
    "asw-line-height",
    `body, p, li, td, div, span, a {
       line-height: calc(1em * ${value}) !important;
     }`,
  );
}
```

- Re-calculates the CSS for the full selector list every time the value changes
- Same `upsertStylesheet` mechanism — replaces the old `<style>` with new values
- Selector list is broad to cover all common text elements

**UI Display:** Shows `1.0x`, `1.2x`, `1.4x` ... `3.0x`

---

## ↔️ Letter Spacing (`letterSpacing.ts`)

**Range:** 0 – 10px (adjustable in 1px steps)

**How it works:**

```ts
// src/tools/content/letterSpacing.ts
export function adjustLetterSpacing(value: number): void {
  upsertStylesheet(
    "asw-letter-spacing",
    `body, p, li, td, div, span, a {
       letter-spacing: ${value}px !important;
     }`,
  );
}
```

Same mechanism as line height — regenerates the CSS rule with the current value.

---

## 📖 Dyslexia Font / Readable Font (`readableFont.ts`)

**Type:** Boolean toggle

**How it works:**

```ts
// src/tools/content/readableFont.ts
export default function readableFont(enable: boolean): void {
  upsertStylesheet(
    "asw-readable-font",
    enable
      ? `body, p, li, td, div, span, a, h1, h2, h3, h4, h5, h6 {
         font-family: 'OpenDyslexic', 'Comic Sans MS', sans-serif !important;
       }`
      : "",
  );
}
```

- **ON:** Changes ALL text to a dyslexia-friendly font stack
- Falls back from `OpenDyslexic` (specialized) → `Comic Sans MS` (widely available) → `sans-serif`
- The irregular letter shapes of Comic Sans / OpenDyslexic help dyslexic readers distinguish between similar characters (b/d, p/q, m/n)

---

## 🔗 Highlight Links (`highlightLinks.ts`)

**Type:** Boolean toggle

**How it works:**

```ts
// src/tools/content/highlightLinks.ts
export default function highlightLinks(enable: boolean): void {
  upsertStylesheet(
    "asw-highlight-links",
    enable
      ? `a { text-decoration: underline !important;
           color: #0000EE !important;
           font-weight: 700 !important; }`
      : "",
  );
}
```

- **ON:** Forces ALL links to be underlined, bold, and classic blue
- Ensures links are visually distinct from surrounding text — critical for color-blind users

---

## 🏷️ Highlight Titles (`highlightTitles.ts`)

**Type:** Boolean toggle

**How it works:**

```ts
// src/tools/content/highlightTitles.ts
export default function highlightTitles(enable: boolean): void {
  upsertStylesheet(
    "asw-highlight-title",
    enable
      ? `h1, h2, h3, h4, h5, h6 {
         outline: 2px solid #000 !important;
         background: #FFFF00 !important;
         padding: 5px !important;
       }`
      : "",
  );
}
```

- **ON:** Adds a black outline + yellow background to all headings
- Makes document structure visually obvious — helps users with cognitive disabilities navigate content hierarchy

---

## 🔧 CSS Upsert Mechanism

All boolean tools use `upsertStylesheet()`:

```ts
// src/css/cssInjector.ts
export function upsertStylesheet(id: string, css: string): void {
  let el = document.getElementById(id) as HTMLStyleElement | null;
  if (!css) {
    el?.remove(); // CSS is empty → remove the style tag
    return;
  }
  if (!el) {
    el = document.createElement("style");
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = css; // Update existing or set new content
}
```

---

## 🖼️ Hide Images (`hideImages.ts`)

**Type:** Boolean toggle

Completely hides all images and media elements to reduce visual distraction.

**How it works:**

```ts
// src/tools/content/hideImages.ts
export default function hideImages(enable: boolean): void {
  injectToolCSS({ ...hideImagesConfig, enable });
}
```

**Config:**

```ts
export const hideImagesConfig: IToolConfig = {
  id: "hide-images",
  selector: "html",
  childrenSelector: ["img", "picture", "svg", "canvas", "video", '[role="img"]'],
  styles: { display: "none !important" },
};
```

**CSS Generated (ON):**

```css
html.asw-hide-images img,
html.asw-hide-images picture,
html.asw-hide-images svg,
html.asw-hide-images canvas,
html.asw-hide-images video,
html.asw-hide-images [role="img"] {
  display: none !important;
}
```

**Use cases:**

- ADHD users overwhelmed by visual clutter
- Cognitive disabilities where images distract from text comprehension
- Low-bandwidth connections where images slow down page loading
- Screen reader users who prefer text-only content

---

## ↔️ Text Alignment (`textAlignment.ts`)

**Type:** Exclusive selection (4 mutually exclusive options)

Aligns all text content to left, center, right, or justify. Text alignment options are handled like contrast filters — only one can be active at a time.

**How it works:**

```ts
import { enableTextAlignment } from "./textAlignment";

// Enable left alignment
enableTextAlignment("text-align-left");
// Clear alignment
enableTextAlignment(false);
```

**Alignment options:**

| Key                 | CSS Rule              | Description                            |
| ------------------- | --------------------- | -------------------------------------- |
| `text-align-left`   | `text-align: left`    | Align text to the left edge            |
| `text-align-center` | `text-align: center`  | Center text horizontally               |
| `text-align-right`  | `text-align: right`   | Align text to the right edge           |
| `text-justify`      | `text-align: justify` | Distribute text evenly between margins |

**Exclusivity:** Text alignment uses the same exclusive pattern as contrast — `TEXT_ALIGN_KEYS` in the engine ensures only one alignment is active at a time.

**CSS Generated (ON for center):**

```css
html.asw-text-align p,
html.asw-text-align h1,
html.asw-text-align h2,
html.asw-text-align h3,
html.asw-text-align h4,
html.asw-text-align h5,
html.asw-text-align h6,
html.asw-text-align li,
html.asw-text-align td,
html.asw-text-align th,
html.asw-text-align blockquote,
html.asw-text-align figcaption,
html.asw-text-align dd,
html.asw-text-align dt,
html.asw-text-align caption {
  text-align: center;
}
```

**Key design:** If CSS string is empty, the stylesheet is REMOVED (tool OFF). If non-empty, it's CREATED or UPDATED (tool ON). This avoids duplicate `<style>` tags and enables clean toggling.
