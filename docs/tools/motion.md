# 🎬 Motion Tools — Stop Animations, Reduced Motion

> `src/tools/motion/`

Motion tools control CSS animations, transitions, and motion effects on the page. Critical for users with vestibular disorders, photosensitive epilepsy, and motion sickness.

---

## ⏸️ Stop Animations (`stopAnimations.ts`)

**Type:** Boolean toggle

Freezes ALL CSS animations and transitions on the page.

**How it works:**

```ts
// src/tools/motion/stopAnimations.ts
export default function stopAnimations(enable: boolean): void {
  upsertStylesheet('asw-stop-animations', enable
    ? `*, *::before, *::after {
         animation-duration: 0s !important;
         animation-delay: 0s !important;
         transition-duration: 0s !important;
         transition-delay: 0s !important;
         animation-iteration-count: 1 !important;
         scroll-behavior: auto !important;
       }`
    : '')
}
```

**What it does:**

| Property | Set to | Effect |
|---|---|---|
| `animation-duration` | `0s` | Animations complete instantly |
| `animation-delay` | `0s` | No delay before animation starts |
| `transition-duration` | `0s` | Transitions are instantaneous |
| `transition-delay` | `0s` | No delay before transitions |
| `animation-iteration-count` | `1` | Looping animations run only once |
| `scroll-behavior` | `auto` | Disables smooth scrolling |

**Why `!important` everywhere:** Site CSS may have inline styles or high-specificity rules. `!important` ensures the override takes effect regardless.

**What's NOT affected:**
- JavaScript-based animations (GSAP, Framer Motion, requestAnimationFrame)
- `<video>` playback
- GIF animations
- CSS `transform` (static transforms not affected, only animated ones)

---

## 🐢 Reduced Motion (`reducedMotion.ts`)

**Type:** Boolean toggle

Applies the browser's `prefers-reduced-motion` media query behavior — a less aggressive alternative to Stop Animations.

**How it works:**

```ts
// src/tools/motion/reducedMotion.ts
export default function reducedMotion(enable: boolean): void {
  upsertStylesheet('asw-reduced-motion', enable
    ? `@media (prefers-reduced-motion: reduce) {
         *, *::before, *::after {
           animation-duration: 0.01ms !important;
           animation-iteration-count: 1 !important;
           transition-duration: 0.01ms !important;
           scroll-behavior: auto !important;
         }
       }`
    : '')
}
```

**Key difference from Stop Animations:**

| Aspect | Stop Animations | Reduced Motion |
|---|---|---|
| Duration set to | `0s` | `0.01ms` |
| Effect | Instant | Nearly instant (1 frame) |
| Scope | All elements | Elements inside `@media` query |
| Animation events | `animationend` may not fire | `animationend` fires normally |

**Why `0.01ms` instead of `0s`?** Setting duration to `0s` causes some JavaScript animation libraries to skip firing `animationend` events, which can break carousel or slideshow logic. `0.01ms` triggers the event after one frame, maintaining compatibility.

---

## 🏥 Use Cases

### Seizure Safe Profile
```
stopAnimations: true
reducedMotion: true
```
- Stops ALL motion immediately
- Most aggressive setting — nothing moves
- Used in the Seizure Safe profile

### Individual Preference
- **Migraine**: stopAnimations ON (flashing/animations trigger pain)
- **Motion sickness**: reducedMotion ON (parallax scrolling causes nausea)
- **ADHD**: stopAnimations ON (moving elements distract attention)
- **Elderly**: reducedMotion ON (smooth scrolling can be disorienting)

---

## 🧪 WCAG Compliance

| Criterion | How we satisfy it |
|---|---|
| **2.2.2 Pause, Stop, Hide** (Level A) | Stop Animations freezes all auto-playing motion |
| **2.3.1 Three Flashes or Below** (Level A) | Animation freeze prevents rapid flashing |
| **2.3.3 Animation from Interactions** (Level AAA) | Reduced Motion respects user preference |

---

## 🔧 CSS Injection

Both tools use unique stylesheet IDs:
- `asw-stop-animations` — removed when tool is OFF
- `asw-reduced-motion` — removed when tool is OFF

Both can be active simultaneously (stopAnimations is stricter; reducedMotion applies the media query behavior).
