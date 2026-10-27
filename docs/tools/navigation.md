# 🧭 Navigation Tools — Big Cursor, Visible Focus

> `src/tools/navigation/`

Navigation tools improve the visibility of the cursor and keyboard focus indicators — critical for users with motor disabilities, low vision, or those who navigate exclusively by keyboard.

---

## 🖱️ Big Cursor (`bigCursor.ts`)

**Type:** Boolean toggle

Enlarges the mouse cursor for better visibility.

**How it works:**

```ts
// src/tools/navigation/bigCursor.ts
export default function bigCursor(enable: boolean): void {
  upsertStylesheet(
    "asw-big-cursor",
    enable ? `* { cursor: url('data:image/svg+xml,...'), auto !important; }` : "",
  );
}
```

**Implementation detail:** Uses a **base64-encoded SVG cursor** injected via CSS `cursor` property:

```css
* {
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"
    width="48" height="48" viewBox="0 0 48 48">
    <path d="M8 4l8 28 6-6 10 16 6-4-10-16 8-2z" fill="black" stroke="white"/>
  </svg>') 24 4, auto !important;
}
```

**Why SVG data URI:**

- No external file dependency
- Works in all modern browsers
- The `auto` fallback ensures a cursor is always shown
- The hotspot coordinates (24, 4) position the cursor tip correctly

---

## 👁️ Visible Focus (`visibleFocus.ts`)

**Type:** Boolean toggle

Adds a **bold, high-contrast focus ring** to all focusable elements. This is one of the most important accessibility tools — many sites remove or reduce the default browser focus indicator, making keyboard navigation impossible.

**How it works:**

```ts
// src/tools/navigation/visibleFocus.ts
export default function visibleFocus(enable: boolean): void {
  upsertStylesheet(
    "asw-visible-focus",
    enable
      ? `*:focus {
         outline: 3px solid #FFD700 !important;
         outline-offset: 3px !important;
         box-shadow: 0 0 0 6px rgba(0, 0, 0, 0.8) !important;
       }`
      : "",
  );
}
```

**Visual design:**

- **Gold (#FFD700) outline** — visible on both light and dark backgrounds
- **3px outline-offset** — creates breathing room between the element and the indicator
- **Black box-shadow** — double-layer effect (gold ring + black ring) for maximum contrast
- `!important` overrides any site CSS that may have hidden focus indicators

**WCAG relevance:**

- Satisfies **WCAG 2.4.7 Focus Visible** (Level AA)
- Satisfies **WCAG 2.4.13 Focus Appearance** (Level AAA, draft)

---

## 🧪 Why These Matter

### Big Cursor

| User need        | Without big cursor                 | With big cursor                      |
| ---------------- | ---------------------------------- | ------------------------------------ |
| Low vision       | Can't locate cursor on screen      | 3x larger, high-contrast black/white |
| Motor disability | Difficult to target small elements | Larger cursor = easier targeting     |
| Elderly users    | Standard cursor is too small       | Clearly visible at any screen size   |

### Visible Focus

| User need               | Without visible focus                         | With visible focus                                  |
| ----------------------- | --------------------------------------------- | --------------------------------------------------- |
| Keyboard navigation     | Tab key "disappears" — no idea where focus is | Gold ring clearly shows active element              |
| Cognitive disability    | Can't track where they are on the page        | Unmistakable visual indicator                       |
| Screen reader + sighted | Confusion about which element is being read   | Focus ring synchronizes with screen reader position |

---

## 🔧 CSS Injection Mechanism

Both tools use `upsertStylesheet()`:

```ts
// ON: create/update <style id="asw-big-cursor">
// OFF: remove <style id="asw-big-cursor">
```

This is the same mechanism used by all boolean tools. Each tool gets a unique stylesheet ID for clean toggling without affecting other tools.
