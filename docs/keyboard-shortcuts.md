# ⌨️ Keyboard Shortcuts & Focus Management

> `src/ui/wire-up.ts` (keyboard handler section)

The widget provides keyboard shortcuts for keyboard-only users and implements focus trapping within the sidebar panel.

---

## 🎹 Keyboard Shortcuts

| Key | Action | Notes |
|---|---|---|
| `Alt` + `A` | Toggle panel open/close | `Option` + `A` on macOS |
| `Alt` + `R` | Reset all settings | `Option` + `R` on macOS |
| `Esc` | Close panel | Only when panel is open |
| `Tab` | Move to next focusable element | Trapped within panel when open |
| `Shift` + `Tab` | Move to previous focusable element | Trapped within panel when open |

---

## 🔧 Implementation

### Keyboard Handler

```ts
// src/ui/wire-up.ts
function onKeyDown(e: KeyboardEvent): void {
  // Option+A (Mac) or Alt+A (Windows/Linux) — Toggle
  if (e.altKey && e.code === 'KeyA') {
    e.preventDefault()
    e.stopPropagation()
    toggleSidebar()
    return
  }

  // Option+R (Mac) or Alt+R (Windows/Linux) — Reset
  if (e.altKey && e.code === 'KeyR') {
    e.preventDefault()
    e.stopPropagation()
    engine.reset()
    closeSidebar()
    return
  }

  // Escape — Close (only when open)
  if (e.key === 'Escape' && menu.isOpen) {
    e.preventDefault()
    closeSidebar()
    return
  }

  // Tab — Trap focus within sidebar when open
  if (e.key === 'Tab' && menu.isOpen) {
    trapFocus(e)
  }
}

document.addEventListener('keydown', onKeyDown)
```

**Key design decisions:**
- `e.preventDefault()` + `e.stopPropagation()` prevents default browser behavior (e.g., Alt+A on Windows opens the browser menu)
- Escape only works when the panel is open — doesn't interfere with other Escape handlers
- Tab trapping only applies when the panel is open

---

## 🔒 Focus Trap

When the sidebar is open, Tab and Shift+Tab cycle through focusable elements **within the panel only** — focus never escapes to the page behind.

```ts
function trapFocus(e: KeyboardEvent): void {
  if (e.key !== 'Tab' || !menu.isOpen) return

  const focusable = menu.getFocusableElements()
  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const activeEl = menu.shadowRoot?.activeElement as HTMLElement | null

  if (e.shiftKey) {
    // Shift+Tab: if at first element, wrap to last
    if (activeEl === first || !activeEl) {
      e.preventDefault()
      last.focus()
    }
  } else {
    // Tab: if at last element, wrap to first
    if (activeEl === last) {
      e.preventDefault()
      first.focus()
    }
  }
}
```

**Focusable elements within the panel:**

```ts
getFocusableElements(): HTMLElement[] {
  const selectors =
    'button, [href], select, [tabindex]:not([tabindex="-1"]), [role="button"]'
  return Array.from(this.shadowRoot!.querySelectorAll(selectors))
}
```

**Shadow DOM note:** Focus trap queries elements WITHIN the Shadow DOM (`this.shadowRoot!.querySelectorAll`). This is crucial — the trap doesn't apply to page elements.

---

## 🔄 Focus Management on Open/Close

### Opening

```ts
function openSidebar(): void {
  menu.setAttribute('open', 'true')
  widget.setExpanded(true)
  lockScroll()

  menu.syncTools(engine.settings.states ?? {})

  // Focus the close button after animation
  requestAnimationFrame(() => {
    const closeBtn = menu.getCloseButton()
    closeBtn?.focus()
  })
}
```

**Why `requestAnimationFrame`:** The sidebar slides in with a CSS transition. `requestAnimationFrame` waits for the animation to start before placing focus.

### Closing

```ts
function closeSidebar(): void {
  menu.removeAttribute('open')
  widget.setExpanded(false)
  unlockScroll()

  // Return focus to the floating button
  requestAnimationFrame(() => {
    const btn = widget.shadowRoot?.querySelector('button')
    btn?.focus()
  })
}
```

**Focus restoration:** Focus returns to the floating button — the element the user clicked to open the panel.

---

## 🔒 Scroll Lock

When the panel is open, the page body scroll is locked:

```ts
function lockScroll(): void {
  if (isLocked) return
  savedOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  isLocked = true
}

function unlockScroll(): void {
  if (!isLocked) return
  document.body.style.overflow = savedOverflow
  isLocked = false
}
```

**Why:** Prevents the page behind the overlay from scrolling when the user scrolls within the sidebar panel. The original `overflow` value is saved and restored on close.

---

## 🖥️ OS Detection

The keyboard shortcuts badge adapts to the user's OS:

```ts
const isMac = /Mac|iPod|iPad|iPhone/.test(navigator.platform || navigator.userAgent)
if (isMac) {
  // Show "Opt+A" / "Opt+R" instead of "Alt+A" / "Alt+R"
}
```

On macOS, `Alt` is the `Option (⌥)` key. The UI reflects this correctly for both OS.
