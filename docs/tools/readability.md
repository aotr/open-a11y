# 📖 Readability Tools — Reading Guide, Reading Ruler, Focus Mode, Reading Mask, Screen Reader

> `src/tools/readability/`

Readability tools help users track their position on the page and reduce visual distraction. Unlike typography tools, these create **DOM overlay elements** rather than just injecting CSS.

---

## 📏 Reading Guide (`readingGuide.ts`)

**Type:** Boolean toggle

A **horizontal line** that follows the mouse cursor, helping users track which line they're reading.

**How it works:**

```ts
// src/tools/readability/readingGuide.ts
export default function readingGuide(enable: boolean): void {
  if (enable) {
    // Create overlay element
    const guide = createOrGetElement("asw-reading-guide");
    guide.style.cssText = `
      position: fixed;
      left: 0;
      width: 100%;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      pointer-events: none;
      z-index: 999999;
    `;
    // Track mouse position
    document.addEventListener("mousemove", updateGuidePosition);
  } else {
    removeElement("asw-reading-guide");
    document.removeEventListener("mousemove", updateGuidePosition);
  }
}
```

**DOM Structure:**

```
<body>
  <div id="asw-reading-guide" style="position:fixed; ...">
  </div>
  <!-- rest of page -->
</body>
```

**Behavior:**

- Element is `pointer-events: none` — doesn't block clicks
- Follows the Y-coordinate of the mouse
- Full width of the viewport
- Semi-transparent for minimal visual obstruction

---

## 📐 Reading Ruler (`readingRuler.ts`)

**Type:** Boolean toggle

A **vertical highlight bar** that moves with the mouse, dimming content above and below the reading area.

**How it works:**

```ts
export default function readingRuler(enable: boolean): void {
  if (enable) {
    const ruler = createOrGetElement("asw-reading-ruler");
    ruler.style.cssText = `
      position: fixed;
      left: 0;
      width: 100%;
      height: 120px;
      background: rgba(255, 255, 0, 0.15);
      pointer-events: none;
      z-index: 999999;
      box-shadow: 0 0 30px 20px rgba(0,0,0,0.4);
    `;
    document.addEventListener("mousemove", updateRulerPosition);
  } else {
    removeElement("asw-reading-ruler");
    document.removeEventListener("mousemove", updateRulerPosition);
  }
}
```

**Visual effect:**

- A ~120px tall semi-transparent yellow band at cursor position
- Dark shadow on top and bottom edges creates a "spotlight" effect
- Content above and below is slightly dimmed → focus stays on the current line area

**Difference from Reading Guide:**

- Reading Guide: thin horizontal **line** (precise line tracking)
- Reading Ruler: broad horizontal **band** (context-aware reading zone)

---

## 🎯 Focus Mode (`focusMode.ts`)

**Type:** Boolean toggle

**Dims everything except the currently hovered element**, creating a spotlight effect that reduces visual noise.

**How it works:**

```ts
export default function focusMode(enable: boolean): void {
  if (enable) {
    // Create full-screen overlay
    const overlay = createOrGetElement("asw-focus-overlay");
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999998;
      pointer-events: none;
    `;
    // Highlight hovered elements
    document.addEventListener("mouseover", highlightElement);
    document.addEventListener("mouseout", unhighlightElement);
  } else {
    removeElement("asw-focus-overlay");
    document.removeEventListener("mouseover", highlightElement);
    document.removeEventListener("mouseout", unhighlightElement);
  }
}
```

**How the spotlight works:**

```ts
function highlightElement(e: MouseEvent): void {
  const target = e.target as HTMLElement;
  target.style.outline = "3px solid #FFD700";
  target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  target.style.zIndex = "999999";
  target.style.position = "relative";
}

function unhighlightElement(e: MouseEvent): void {
  const target = e.target as HTMLElement;
  target.style.outline = "";
  target.style.backgroundColor = "";
  target.style.zIndex = "";
  target.style.position = "";
}
```

**Visual effect:**

- Dark semi-transparent overlay covers the entire page
- Currently hovered element gets a gold outline + subtle highlight + raised z-index
- Mouse movement creates a "scanning" effect — each element lights up as you pass over it

**Use cases:**

- ADHD users: reduces competing visual stimuli
- Low vision users: clearly identifies interactive elements
- Elderly users: makes click targets unmistakable

---

## 🎭 Reading Mask (`readingMask.ts`)

**Type:** Boolean toggle

Creates a full-page translucent overlay with a transparent slit/band that follows the mouse cursor, helping users focus on one line at a time.

**How it works:**

```ts
export default function readingMask(enable: boolean): void {
  if (enable) {
    // Create container with 3 elements:
    // 1. Top overlay — semi-transparent, covers everything above the slit
    // 2. Bottom overlay — semi-transparent, covers everything below the slit
    // 3. Slit indicator — thin bordered band showing the reading area
    const container = createContainer();
    document.body.appendChild(container);

    document.addEventListener("mousemove", updateSlitPosition);
  } else {
    removeContainer();
    document.removeEventListener("mousemove", updateSlitPosition);
  }
}
```

**Visual effect:**

- Dark (65% opacity) overlay covers the full page
- A ~28px transparent slit reveals the content under the cursor
- The slit has subtle white border lines for visibility
- A small drag handle indicator appears on the right side of the slit
- Mouse movement smoothly repositions the slit

**Difference from Reading Guide:**

| Feature  | Reading Guide         | Reading Mask                     |
| -------- | --------------------- | -------------------------------- |
| Visual   | Thin horizontal line  | Wide transparent band            |
| Masking  | None (just a line)    | Full-page dark overlay with slit |
| Best for | Precise line tracking | Focused reading zone             |

**Cleanup:** Removes all DOM elements and event listeners when disabled.

---

## 🦻 Screen Reader (`screenReader.ts`)

**Type:** Boolean toggle

Enhances the page for screen reader compatibility by adding visible skip-to-content links, ARIA announcement regions, and focus enhancements.

**How it works:**

```ts
export default function screenReader(enable: boolean): void {
  if (enable) {
    // 1. Inject CSS for skip link styling
    injectToolCSS({ ...screenReaderConfig, enable });

    // 2. Add skip-to-content link (hidden until focused)
    const skipLink = document.createElement("a");
    skipLink.id = "asw-skip-link";
    skipLink.href = "#main-content";
    skipLink.textContent = "Skip to main content";
    document.body.prepend(skipLink);

    // 3. Add aria-live announcement region
    const announcer = document.createElement("div");
    announcer.id = "asw-announce";
    announcer.setAttribute("aria-live", "polite");
    document.body.appendChild(announcer);
  } else {
    // Remove all added elements
    document.getElementById("asw-skip-link")?.remove();
    document.getElementById("asw-announce")?.remove();
    injectToolCSS({ ...screenReaderConfig, enable: false });
  }
}
```

**Features:**

- **Skip to content link**: Appears at the very top of the page, becomes visible when focused via Tab key
- **ARIA live region**: A `div[aria-live="polite"]` for dynamic content announcements
- **Focus styles**: Enhanced outline on all interactive elements

**CSS for Skip Link:**

```css
#asw-skip-link {
  position: fixed;
  top: -100%;
  left: 0;
  z-index: 100000;
  padding: 10px 16px;
  background: #0048ff;
  color: #fff;
  text-decoration: none;
  transition: top 0.2s ease;
}
#asw-skip-link:focus {
  top: 0;
  outline: 3px solid #ffd700;
}
```

**Use cases:**

- Screen reader users (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation
- Users who rely on skip links to bypass repetitive navigation

---

## 🔧 Common Patterns

All readability tools share these patterns:

### Element Management

```ts
function createOrGetElement(id: string): HTMLElement {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("div");
    el.id = id;
    document.body.appendChild(el);
  }
  return el;
}

function removeElement(id: string): void {
  document.getElementById(id)?.remove();
}
```

### Event Listener Cleanup

- All tools **clean up event listeners** when disabled
- Prevents memory leaks and zombie event handlers
- Uses named function references (not anonymous) for clean `removeEventListener`

### Pointer Events

- ALL overlay elements have `pointer-events: none`
- Users can still click, type, and interact with the page normally
- Tools are purely visual aids — never block interaction
