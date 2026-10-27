# 🏷️ Accessibility Profiles — Pre-Configured Presets

> `src/profiles/`

Profiles are **batch tool configurations** designed for specific accessibility needs. Each profile is defined as a data object and applied atomically — one click replaces all current tool states.

---

## 📊 Profile Data Structure

```ts
// src/profiles/types.ts
interface IProfile {
  id: string; // Unique identifier ('vision-impaired')
  label: string; // i18n key for display name
  description: string; // i18n key for tooltip/description
  icon: string; // Icon key from the sprite sheet
  states: Record<string, unknown>; // Tool states to apply
}
```

Each profile defines ONLY the states it needs. Unspecified states remain at their previous value (no reset of unrelated tools).

---

## 🧠 How Profiles Work

### Application Flow

```
User clicks "Vision Impaired" in panel
        │
        ▼
  asw:profile event fires with { profileId: 'vision-impaired' }
        │
        ▼
  engine.applyProfile('vision-impaired')
        │
        ├── 1. Look up profile in PROFILES['vision-impaired']
        │       → { fontSize: 1.5, 'font-weight': true, contrast: 'high-contrast', ... }
        │
        ├── 2. StateManager.setMany({ ...profile.states })
        │       → Batch-set ALL profile states at once
        │       → Only 1 notification + 1 persistence call
        │
        ├── 3. Iterate profile.states and run tools:
        │       ├── fontSize: 1.5  → adjustFontSize(1.5)
        │       ├── font-weight: true → fontWeight(true)
        │       ├── contrast: 'high-contrast' → enableContrast('high-contrast')
        │       ├── big-cursor: true → bigCursor(true)
        │       └── ... (all profile states)
        │
        └── 4. Menu.syncTools(states) → update UI toggles
```

### Profile State Override

Profiles **replace** the current state for keys they define, but **preserve** unspecified keys:

```ts
// Before applying "Vision Impaired":
states: {
  'monochrome': true,
  'stop-animations': false,
  fontSize: 1.0,
}

// PROFILES['vision-impaired'].states:
{ fontSize: 1.5, 'font-weight': true, contrast: 'high-contrast', ... }

// After applying:
states: {
  'monochrome': true,        // ← PRESERVED (not in profile)
  'stop-animations': false,  // ← PRESERVED
  fontSize: 1.5,             // ← UPDATED (in profile)
  'font-weight': true,       // ← ADDED (in profile)
  contrast: 'high-contrast',     // ← ADDED (in profile)
  activeProfile: 'vision-impaired', // ← SET
}
```

---

## 🏷️ All 7 Profiles

### 1. Vision Impaired (`visionImpaired.ts`)

```ts
states: {
  fontSize: 1.5,            // 150% text size
  'font-weight': true,      // Bold text
  contrast: 'high-contrast',    // Maximum contrast
  'big-cursor': true,       // Larger mouse cursor
  'visible-focus': true,    // Focus indicators
  'highlight-links': true,  // Underlined links
  'highlight-title': true,  // Emphasized headings
}
```

**Target users:** Seniors, macular degeneration, glaucoma, cataracts, refractive errors.

---

### 2. Cognitive Disability (`cognitiveDisability.ts`)

```ts
states: {
  'readable-font': true,      // Dyslexia-friendly font
  letterSpacing: 1,     // Increased spacing between characters
  lineHeight: 1.6,        // Increased spacing between lines
  'font-weight': true,        // Bold text
  'highlight-links': true,    // Underlined links
  'reading-guide': true,      // Horizontal reading line
}
```

**Target users:** Dyslexia, dyscalculia, learning disabilities, low literacy.

---

### 3. Keyboard Navigation (`keyboardNavigation.ts`)

```ts
states: {
  'visible-focus': true,      // Bold focus ring
  'big-cursor': true,         // Larger cursor
  'stop-animations': true,    // No moving elements
}
```

**Target users:** Motor disabilities, Parkinson's, cerebral palsy, arthritis, RSI, keyboard-only users.

---

### 4. Motor Impaired (`motorImpaired.ts`)

```ts
states: {
  'big-cursor': true,         // Larger cursor
  'visible-focus': true,      // Focus indicators
  'stop-animations': true,    // No moving elements
  'reduced-motion': true,     // Minimize motion
  'reading-guide': true,      // Horizontal reading line
}
```

**Target users:** Motor control difficulties, tremors, limited fine motor control, users who benefit from reduced motion and reading aids.

**Key difference from Keyboard Navigation:** The Motor Impaired profile adds `reduced-motion` and `reading-guide` — it's designed for users who need both motion reduction and reading assistance, not just keyboard navigation.

---

### 5. Seizure Safe (`seizureSafe.ts`)

```ts
states: {
  'stop-animations': true,    // Freeze all motion
  'reduced-motion': true,     // Respect OS motion settings
  contrast: false,     // Explicitly disable (strobing risk)
  'monochrome': false,        // Explicitly disable
  'low-saturation': false,    // Explicitly disable
}
```

**Key detail:** Disables contrast modes EXPLICITLY (sets to `false`). Some high-contrast transitions can create strobing effects. This profile ensures a safe, static visual environment.

**Target users:** Photosensitive epilepsy, vestibular disorders, migraines.

---

### 6. Blind Users (`blindUsers.ts`)

```ts
states: {
  fontSize: 2.0,              // 200% — maximum text
  'font-weight': true,        // Bold
  contrast: 'high-contrast',      // Maximum contrast
  'big-cursor': true,         // Large cursor
  'visible-focus': true,      // Focus indicators
  'stop-animations': true,    // No movement
}
```

**Target users:** Screen reader users (NVDA, JAWS, VoiceOver), severe low vision, legal blindness.

---

### 7. ADHD Friendly (`adhdFriendly.ts`)

```ts
states: {
  'focus-mode': true,         // Spotlight on hovered element
  'stop-animations': true,    // No distractions
  'reading-ruler': true,      // Reading band follows cursor
  lineHeight: 1.6,        // Better text spacing
  'visible-focus': true,      // Clear focus indicators
}
```

**Note:** `reading-guide` is explicitly set to `false` — the reading ruler (band) is more effective for ADHD than the thin line (guide).

**Target users:** ADHD, attention disorders, executive dysfunction, sensory processing issues.

---

## 🔄 Profile Registry

```ts
// src/profiles/index.ts
export const PROFILES: Record<string, IProfile> = {
  "seizure-safe": seizureSafeProfile,
  "vision-impaired": visionImpairedProfile,
  "adhd-friendly": adhdFriendlyProfile,
  "cognitive-disability": cognitiveDisabilityProfile,
  "keyboard-navigation": keyboardNavigationProfile,
  "blind-users": blindUsersProfile,
  "motor-impaired": motorImpairedProfile,
};
```

**Extensibility:** To add a new profile:

1. Create `src/profiles/myNewProfile.ts` following the `IProfile` interface
2. Export from `src/profiles/index.ts` and add to `PROFILES` map
3. Add the icon to the sprite sheet
4. Add i18n keys for label and description

---

## 🔗 Profile Deactivation

When a user manually toggles any individual tool, the active profile is cleared:

```ts
// In engine.toggleTool():
if (this.stateManager.getState().states?.activeProfile) {
  this.stateManager.setTool("activeProfile", null);
}
```

This prevents confusion — if a user applies "Vision Impaired" then manually turns off bold text, the profile badge should clear because the preset is no longer fully active.
