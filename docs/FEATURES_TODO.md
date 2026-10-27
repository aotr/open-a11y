# ♿ `open-a11y` — Feature Todo & Specification

> **Purpose:** Comprehensive inventory of all features across every subsystem, tracking what's built, what's missing, and what needs to change. Organized by feature category for sprint planning and team coordination.

---

## 📋 How to Read This Document

Each section lists features grouped by **category** (Content, Color, Readability, Navigation, Motion, Profiles, Widget/UI, i18n, Config). For each feature:

| Column          | Meaning                                                |
| --------------- | ------------------------------------------------------ |
| **Feature ID**  | The tool/profile/option key used in code               |
| **Engine**      | ✅ = tool executor exists in `AccessibilityEngine`     |
| **UI Button**   | ✅ = button rendered in `<asw-menu>` template          |
| **Icon**        | ✅ = Lucide icon mapped in `lucide.ts`                 |
| **Config Gate** | ✅ = toggle exists in `IAccessibilityFeatures`         |
| **App Enabled** | ✅ = turned ON in `src/config/accessibility.config.ts` |
| **i18n Key**    | ✅ = translation entry exists in locale JSON           |
| **Status**      | 🟢 Complete / 🟡 Partial / 🔴 Missing / 📋 Planned     |

---

## 1. 🏷️ Content Adjustments

Tools that modify text appearance and typography.

| #    | Feature ID          | Engine     | UI Button | Icon               | Config Gate | App Enabled | i18n Key                   | Status |
| ---- | ------------------- | ---------- | --------- | ------------------ | ----------- | ----------- | -------------------------- | ------ |
| 1.1  | `font-size`         | ✅         | ✅        | ✅ Type            | ✅          | ✅ ON       | ✅ `tools.fontSize`        | 🟢     |
| 1.2  | `font-weight`       | ✅         | ✅        | ✅ Bold            | ✅          | ✅ ON       | ✅ `tools.fontWeight`      | 🟢     |
| 1.3  | `line-height`       | ✅         | ✅        | ✅ StretchVertical | ✅          | ✅ ON       | ✅ `tools.lineHeight`      | 🟢     |
| 1.4  | `letter-spacing`    | ✅         | ✅        | ✅ LetterText      | ✅          | ✅ ON       | ✅ `tools.letterSpacing`   | 🟢     |
| 1.5  | `readable-font`     | ✅         | ✅        | ✅ BookOpenText    | ✅          | ✅ ON       | ✅ `tools.readableFont`    | 🟢     |
| 1.6  | `highlight-links`   | ✅         | ✅        | ✅ Link            | ✅          | ✅ ON       | ✅ `tools.highlightLinks`  | 🟢     |
| 1.7  | `highlight-title`   | ✅         | ✅        | ✅ Heading1        | ✅          | ❌ OFF      | ✅ `tools.highlightTitles` | 🟢     |
| 1.8  | `hide-images`       | ✅         | ✅        | ✅ ImageOff        | ✅          | ❌ OFF      | ✅ `tools.hideImages`      | 🟢     |
| 1.9  | `text-align-left`   | ✅         | ✅        | ✅ AlignLeft       | ✅          | ❌ OFF      | ✅ `tools.textAlignLeft`   | 🟢     |
| 1.10 | `text-align-center` | ✅         | ✅        | ✅ AlignCenter     | ✅          | ❌ OFF      | ✅ `tools.textAlignCenter` | 🟢     |
| 1.11 | `text-align-right`  | ✅         | ✅        | ✅ AlignRight      | ✅          | ❌ OFF      | ✅ `tools.textAlignRight`  | 🟢     |
| 1.12 | `text-justify`      | ✅         | ✅        | ✅ AlignJustify    | ✅          | ❌ OFF      | ✅ `tools.textJustify`     | 🟢     |
| 1.13 | `content-scaling`   | 📋 Planned | ❌        | ❌                 | ❌          | ❌          | ❌                         | 📋     |

### 🛠️ Changes Needed — Content

| ID   | Priority  | What                                                      | Why                                   |
| ---- | --------- | --------------------------------------------------------- | ------------------------------------- |
| 1.7  | 🟡 Low    | Enable `highlight-title` in app config                    | Feature works, just needs config flip |
| 1.13 | 🟢 Future | Implement content scaling (global zoom via CSS transform) | Listed in original dev plan           |

---

## 2. 🎨 Color & Contrast Adjustments

CSS filter-based color modifications. All contrast keys are **exclusive** — only one active at a time.

| #   | Feature ID        | Engine     | UI Button      | Icon        | Config Gate | App Enabled | i18n Key                  | Status |
| --- | ----------------- | ---------- | -------------- | ----------- | ----------- | ----------- | ------------------------- | ------ |
| 2.1 | `monochrome`      | ✅         | ✅             | ✅ Palette  | ✅          | ✅ ON       | ✅ `tools.monochrome`     | 🟢     |
| 2.2 | `low-saturation`  | ✅         | ✅             | ✅ Droplet  | ✅          | ❌ OFF      | ✅ `tools.lowSaturation`  | 🟢     |
| 2.3 | `high-saturation` | ✅         | ✅             | ✅ Droplets | ✅          | ❌ OFF      | ✅ `tools.highSaturation` | 🟢     |
| 2.4 | `high-contrast`   | ✅         | ✅             | ✅ Contrast | ✅          | ❌ OFF      | ✅ `tools.highContrast`   | 🟢     |
| 2.5 | `light-contrast`  | ✅         | ✅             | ✅ Sun      | ✅          | ❌ OFF      | ✅ `tools.lightContrast`  | 🟢     |
| 2.6 | `dark-contrast`   | ✅         | ✅             | ✅ Moon     | ✅          | ❌ OFF      | ✅ `tools.darkContrast`   | 🟢     |
| 2.7 | `invert`          | ✅         | **❌ MISSING** | ✅ Circle   | ✅          | ❌ OFF      | ❌ Missing                | 🟡     |
| 2.8 | `custom-hue`      | 📋 Planned | ❌             | ❌          | ❌          | ❌          | ❌                        | 📋     |

### 🛠️ Changes Needed — Color

| ID  | Priority    | What                                                                 | Why                                                                 |
| --- | ----------- | -------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 2.7 | 🔴 **High** | Add `invert` button to `FILTER_TOOLS` array in `asw-menu.ts`         | Tool exists in engine, icon exists, but no UI button to activate it |
| 2.7 | 🔴 **High** | Add `tools.invert` i18n key to `en.json` and `hi.json`               | Translation missing for the invert label                            |
| 2.7 | 🟡 Medium   | Enable `invert` in app config after UI button added                  | Make it visible to users                                            |
| 2.8 | 🟢 Future   | Implement custom hue rotation tool (slider-based `hue-rotate(Ndeg)`) | Planned Phase 2 feature                                             |

---

## 3. 📖 Readability Tools

Tools that aid reading focus and comprehension.

| #   | Feature ID       | Engine     | UI Button | Icon          | Config Gate | App Enabled | i18n Key                | Status |
| --- | ---------------- | ---------- | --------- | ------------- | ----------- | ----------- | ----------------------- | ------ |
| 3.1 | `reading-guide`  | ✅         | ✅        | ✅ BookMarked | ✅          | ❌ OFF      | ✅ `tools.readingGuide` | 🟢     |
| 3.2 | `reading-ruler`  | ✅         | ✅        | ✅ Ruler      | ✅          | ❌ OFF      | ✅ `tools.readingRuler` | 🟢     |
| 3.3 | `focus-mode`     | ✅         | ✅        | ✅ ScanEye    | ✅          | ❌ OFF      | ✅ `tools.focusMode`    | 🟢     |
| 3.4 | `reading-mask`   | ✅         | ✅        | ✅ ScanLine   | ✅          | ❌ OFF      | ✅ `tools.readingMask`  | 🟢     |
| 3.5 | `screen-reader`  | ✅         | ✅        | ✅ Ear        | ✅          | ❌ OFF      | ✅ `tools.screenReader` | 🟢     |
| 3.6 | `text-magnifier` | 📋 Planned | ❌        | ❌            | ❌          | ❌          | ❌                      | 📋     |

### 🛠️ Changes Needed — Readability

| ID  | Priority  | What                                                   | Why                     |
| --- | --------- | ------------------------------------------------------ | ----------------------- |
| 3.6 | 🟢 Future | Implement text magnifier (hover tooltip magnification) | Planned Phase 2 feature |

---

## 4. 🧭 Navigation Tools

Tools for cursor visibility and keyboard focus indicators.

| #   | Feature ID      | Engine | UI Button | Icon             | Config Gate | App Enabled | i18n Key                | Status |
| --- | --------------- | ------ | --------- | ---------------- | ----------- | ----------- | ----------------------- | ------ |
| 4.1 | `big-cursor`    | ✅     | ✅        | ✅ MousePointer2 | ✅          | ❌ OFF      | ✅ `tools.bigCursor`    | 🟢     |
| 4.2 | `visible-focus` | ✅     | ✅        | ✅ Eye           | ✅          | ❌ OFF      | ✅ `tools.visibleFocus` | 🟢     |

### 🛠️ Changes Needed — Navigation

| ID  | Priority | What                         | Why |
| --- | -------- | ---------------------------- | --- |
| —   | 🟢 None  | Both tools fully implemented |     |

---

## 5. 🎬 Motion Tools

Tools that control animations, transitions, and motion effects.

| #   | Feature ID        | Engine | UI Button      | Icon           | Config Gate | App Enabled | i18n Key                  | Status |
| --- | ----------------- | ------ | -------------- | -------------- | ----------- | ----------- | ------------------------- | ------ |
| 5.1 | `stop-animations` | ✅     | ✅             | ✅ PauseCircle | ✅          | ❌ OFF      | ✅ `tools.stopAnimations` | 🟢     |
| 5.2 | `reduced-motion`  | ✅     | **❌ MISSING** | ✅ Gauge       | ✅          | ❌ OFF      | ❌ Missing                | 🟡     |

### 🛠️ Changes Needed — Motion

| ID  | Priority    | What                                                                 | Why                                                                 |
| --- | ----------- | -------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 5.2 | 🔴 **High** | Add `reduced-motion` button to `TOOL_BUTTONS` array in `asw-menu.ts` | Tool exists in engine, icon exists, but no UI button to activate it |
| 5.2 | 🔴 **High** | Add `tools.reducedMotion` i18n key to `en.json` and `hi.json`        | Translation missing for the reduced motion label                    |

---

## 6. 🏷️ Accessibility Profiles

Pre-configured bundles of tool settings for specific needs. **All currently disabled in the app config.** When a profile is active, manually toggling any tool clears the profile.

| #   | Profile ID             | Engine | UI Button | Icon           | Config Gate | App Enabled | i18n Key                          | Status |
| --- | ---------------------- | ------ | --------- | -------------- | ----------- | ----------- | --------------------------------- | ------ |
| 6.1 | `seizure-safe`         | ✅     | ✅        | ✅ ShieldCheck | ✅          | ❌ OFF      | ✅ `profiles.seizureSafe`         | 🟢     |
| 6.2 | `vision-impaired`      | ✅     | ✅        | ✅ Glasses     | ✅          | ❌ OFF      | ✅ `profiles.visionImpaired`      | 🟢     |
| 6.3 | `adhd-friendly`        | ✅     | ✅        | ✅ Brain       | ✅          | ❌ OFF      | ✅ `profiles.adhdFriendly`        | 🟢     |
| 6.4 | `cognitive-disability` | ✅     | ✅        | ✅ Puzzle      | ✅          | ❌ OFF      | ✅ `profiles.cognitiveDisability` | 🟢     |
| 6.5 | `keyboard-navigation`  | ✅     | ✅        | ✅ Keyboard    | ✅          | ❌ OFF      | ✅ `profiles.keyboardNavigation`  | 🟢     |
| 6.6 | `blind-users`          | ✅     | ✅        | ✅ EyeOff      | ✅          | ❌ OFF      | ✅ `profiles.blindUsers`          | 🟢     |
| 6.7 | `motor-impaired`       | ✅     | ✅        | ✅ Hand        | ✅          | ❌ OFF      | ✅ `profiles.motorImpaired`       | 🟢     |

### 🛠️ Changes Needed — Profiles

| ID  | Priority  | What                                                                                      | Why                                                                                                                                      |
| --- | --------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| All | 🟡 Medium | Audit and enable relevant profiles in app config                                          | Currently all 7 are disabled; users see nothing. Start with 2-3 most relevant (e.g., `vision-impaired`, `adhd-friendly`, `seizure-safe`) |
| All | 🟡 Medium | Add profile descriptions to profile cards                                                 | Currently each profile card only shows icon + name; users need to understand what each preset does before clicking                       |
| 6.5 | 🟡 Medium | Keyboard nav profile should auto-show when user starts using keyboard (Tab key detection) | Progressive enhancement — detect keyboard usage and suggest enabling                                                                     |

---

## 7. 🧩 Widget / UI Chrome

The floating button, sidebar panel, and all UI chrome elements.

| #    | Feature                            | Engine         | UI Button | Icon             | Config Gate         | App Enabled | i18n Key               | Status |
| ---- | ---------------------------------- | -------------- | --------- | ---------------- | ------------------- | ----------- | ---------------------- | ------ |
| 7.1  | Floating button (`<asw-widget>`)   | ✅             | ✅        | ✅ Accessibility | ✅ `position`       | ✅          | ✅ `widget.menuTitle`  | 🟢     |
| 7.2  | Sidebar panel (`<asw-menu>`)       | ✅             | ✅        | —                | ✅ `side`           | ✅          | ✅                     | 🟢     |
| 7.3  | Panel slide direction (left/right) | ✅             | ✅        | —                | ✅ `side`           | ✅ `right`  | —                      | 🟢     |
| 7.4  | Backdrop blur                      | ✅             | ✅        | —                | ✅ `blur`           | ❌ OFF      | —                      | 🟢     |
| 7.5  | Close button                       | ✅             | ✅        | ✅ X             | —                   | ✅          | ✅ `widget.closeMenu`  | 🟢     |
| 7.6  | Reset button (header)              | ✅             | ✅        | ✅ RotateCcw     | —                   | ✅          | ✅ `widget.resetTitle` | 🟢     |
| 7.7  | Reset button (footer)              | ✅             | ✅        | —                | —                   | ✅          | ✅ `widget.reset`      | 🟢     |
| 7.8  | Language switcher                  | ✅             | ✅        | ✅ Globe         | ✅ `languageChange` | ❌ OFF      | ✅                     | 🟢     |
| 7.9  | Keyboard shortcuts card            | ✅             | ✅        | —                | ✅ `shortcuts`      | ✅ ON       | —                      | 🟢     |
| 7.10 | `<asw-toggle>` component           | **❌ MISSING** | —         | —                | —                   | —           | —                      | 🔴     |
| 7.11 | `<asw-slider>` component           | **❌ MISSING** | —         | —                | —                   | —           | —                      | 🔴     |
| 7.12 | Pulse animation on first mount     | ✅             | ✅        | —                | —                   | ✅          | —                      | 🟢     |
| 7.13 | Scroll lock when panel open        | ✅             | ✅        | —                | —                   | ✅          | —                      | 🟢     |
| 7.14 | Focus trap in sidebar              | ✅             | ✅        | —                | —                   | ✅          | —                      | 🟢     |
| 7.15 | Keyboard shortcut Alt+A            | ✅             | ✅        | —                | —                   | ✅          | —                      | 🟢     |
| 7.16 | Keyboard shortcut Alt+R            | ✅             | ✅        | —                | —                   | ✅          | —                      | 🟢     |
| 7.17 | Keyboard shortcut Esc              | ✅             | ✅        | —                | —                   | ✅          | —                      | 🟢     |

### 🛠️ Changes Needed — Widget / UI

| ID    | Priority    | What                                                                                     | Why                                                                                                                  |
| ----- | ----------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 7.10  | 🔴 **High** | Build `<asw-toggle>` Web Component with ARIA `role="switch"`                             | Phase 1 priority — current buttons lack proper switch semantics                                                      |
| 7.11  | 🔴 **High** | Build `<asw-slider>` Web Component with ARIA slider role                                 | Phase 1 priority — current +/- buttons are imprecise; range slider needed for font size, line height, letter spacing |
| 7.10b | 🟡 Medium   | Replace `.asw-btn` toggles in menu with `<asw-toggle>` components                        | Integration after component is built                                                                                 |
| 7.11b | 🟡 Medium   | Replace font size +/- controls with `<asw-slider>`                                       | Better UX for precise adjustment                                                                                     |
| 7.8   | 🟡 Medium   | Enable `languageChange` in app config                                                    | Already works, just needs config flip                                                                                |
| 7.18  | 🟢 Future   | Dual icon system cleanup — migrate `iconSvg()` from sprite to Lucide, remove `sprite.ts` | Eliminate dead code                                                                                                  |

---

## 8. 🌐 Internationalization (i18n)

| #   | Feature                            | Engine | UI Button | Config Gate | App Enabled | Status |
| --- | ---------------------------------- | ------ | --------- | ----------- | ----------- | ------ |
| 8.1 | English (`en.json`)                | ✅     | ✅        | —           | ✅          | 🟢     |
| 8.2 | Hindi (`hi.json`)                  | ✅     | ✅        | —           | ❌ OFF      | 🟢     |
| 8.3 | Dynamic locale loading             | ✅     | ✅        | —           | ✅          | 🟢     |
| 8.4 | Dot-notation key lookup            | ✅     | —         | —           | ✅          | 🟢     |
| 8.5 | Data-translate attribute rendering | ✅     | —         | —           | ✅          | 🟢     |
| 8.6 | French, Spanish, German, etc.      | 📋     | ❌        | —           | ❌          | 📋     |
| 8.7 | RTL layout support                 | 📋     | ❌        | —           | ❌          | 📋     |
| 8.8 | Lazy locale loading (`import()`)   | 📋     | ❌        | —           | ❌          | 📋     |

### 🛠️ Changes Needed — i18n

| ID   | Priority  | What                                                                | Why                                     |
| ---- | --------- | ------------------------------------------------------------------- | --------------------------------------- |
| 8.6  | 🟡 Medium | Add `invert` and `reduced-motion` keys to `en.json` and `hi.json`   | Missing translations for existing tools |
| 8.6b | 🟢 Future | Create locale files for FR, ES, DE, PT, IT, JA, ZH, AR              | Phase 3 expansion                       |
| 8.7  | 🟢 Future | Add RTL flag to language registry; flip panel layout for Arabic     | Phase 3                                 |
| 8.8  | 🟢 Future | Dynamic `import()` of locale JSON instead of bundling all languages | Bundle size optimization                |

---

## 9. ⚙️ Configuration System

| #    | Feature                                          | Engine | Config Gate | App Override      | Status |
| ---- | ------------------------------------------------ | ------ | ----------- | ----------------- | ------ |
| 9.1  | `mergeConfig()` — deep merge defaults + custom   | ✅     | —           | ✅                | 🟢     |
| 9.2  | `side` — panel slide direction                   | ✅     | ✅          | ✅ `right`        | 🟢     |
| 9.3  | `position` — floating button position            | ✅     | ✅          | ✅ `bottom-right` | 🟢     |
| 9.4  | `offset` — button offset [x, y]                  | ✅     | ✅          | ✅ `[20, 20]`     | 🟢     |
| 9.5  | `blur` — backdrop blur toggle                    | ✅     | ✅          | ❌ `false`        | 🟢     |
| 9.6  | `features.tools` — per-tool visibility           | ✅     | ✅          | ✅ (7 ON, 13 OFF) | 🟢     |
| 9.7  | `features.profiles` — per-profile visibility     | ✅     | ✅          | ✅ (all OFF)      | 🟢     |
| 9.8  | `features.languageChange` — show language picker | ✅     | ✅          | ❌ `false`        | 🟢     |
| 9.9  | `features.shortcuts` — show shortcuts card       | ✅     | ✅          | ✅ `true`         | 🟢     |
| 9.10 | `hooks.onAction` — analytics callback            | ✅     | ✅          | ❌ Not used       | 🟢     |

### 🛠️ Changes Needed — Config

| ID   | Priority  | What                                                       | Why                                                  |
| ---- | --------- | ---------------------------------------------------------- | ---------------------------------------------------- |
| 9.10 | 🟡 Medium | Wire `hooks.onAction` to app analytics (PostHog/GA4 event) | Currently unused — missing telemetry                 |
| 9.6  | 🟡 Medium | Review which 13 disabled tools should be enabled           | Too many hidden tools limits widget usefulness       |
| 9.7  | 🟡 Medium | Enable 2-3 key profiles in app config                      | Profiles are the headline feature but all are hidden |

---

## 10. 🔧 Engine & State

| #     | Feature                                                 | Status |
| ----- | ------------------------------------------------------- | ------ |
| 10.1  | Singleton engine pattern (shared state across routes)   | ✅     |
| 10.2  | StateManager with observable subscribers                | ✅     |
| 10.3  | `localStorage` persistence (key: `asw-user-settings`)   | ✅     |
| 10.4  | Memory adapter for SSR/testing                          | ✅     |
| 10.5  | Contrast exclusivity (only one contrast mode at a time) | ✅     |
| 10.6  | Profile → tool dispatch (batch apply)                   | ✅     |
| 10.7  | Font scale clamped 0.1–2.0                              | ✅     |
| 10.8  | Full reset (clear all states + remove all injected CSS) | ✅     |
| 10.9  | UI re-creation on route change (Next.js App Router)     | ✅     |
| 10.10 | SSR hydration via `initialSettings`                     | ✅     |

---

## 11. 📊 Quick Reference: What Needs Work This Sprint

### 🔴 High Priority (Must Fix)

| #   | Area   | Task                                                             | File(s)                                 |
| --- | ------ | ---------------------------------------------------------------- | --------------------------------------- |
| H1  | Color  | Add `invert` button to `FILTER_TOOLS` in `asw-menu.ts`           | `src/ui/components/asw-menu.ts`         |
| H2  | Motion | Add `reduced-motion` button to `TOOL_BUTTONS` in `asw-menu.ts`   | `src/ui/components/asw-menu.ts`         |
| H3  | i18n   | Add `tools.invert` and `tools.reducedMotion` keys to locale JSON | `src/i18n/locales/en.json`, `hi.json`   |
| H4  | UI     | Build `<asw-toggle>` Web Component                               | `src/ui/components/asw-toggle.ts` (new) |
| H5  | UI     | Build `<asw-slider>` Web Component                               | `src/ui/components/asw-slider.ts` (new) |

### 🟡 Medium Priority (Should Fix)

| #   | Area     | Task                                                                             |
| --- | -------- | -------------------------------------------------------------------------------- |
| M1  | Profiles | Enable 2-3 profiles in app config (vision-impaired, adhd-friendly, seizure-safe) |
| M2  | Profiles | Add descriptive text to profile cards explaining what each preset does           |
| M3  | Config   | Wire `hooks.onAction` to analytics                                               |
| M4  | Config   | Enable `highlight-title` in app config                                           |
| M5  | Config   | Enable `languageChange` in app config                                            |
| M6  | Config   | Review which contrast tools to enable by default                                 |
| M7  | UI       | Migrate `iconSvg()` from sprite to Lucide; remove `sprite.ts`                    |

### 🟢 Future (Phase 2+)

| #   | Area    | Task                                                                               |
| --- | ------- | ---------------------------------------------------------------------------------- |
| F1  | Tools   | Text Magnifier, Reading Mask, Custom Hue, Hide Images, Mute Sounds, Text Alignment |
| F2  | i18n    | 8 new languages + RTL support + lazy loading                                       |
| F3  | Laravel | PHP service, Blade directive, Alpine bridge, API controller                        |
| F4  | Testing | E2E, CSP, accessibility audit, 90%+ coverage                                       |
| F5  | Docs    | API reference, integration guides, demo pages, npm CI/CD                           |

---

## 12. 📁 File Map

| File                                 | Role                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------ |
| `src/engine/AccessibilityEngine.ts`  | Main orchestrator — toggle dispatch, profile apply, contrast exclusivity |
| `src/state/StateManager.ts`          | Observable state machine — settings, subscribers, persistence            |
| `src/css/cssGenerator.ts`            | Generate CSS strings from tool configs                                   |
| `src/css/cssInjector.ts`             | Inject/remove `<style>` elements into DOM                                |
| `src/tools/content/*.ts`             | 7 content adjustment tools                                               |
| `src/tools/color/contrast.ts`        | 6 contrast filters (CSS filter-based)                                    |
| `src/tools/color/invert.ts`          | Invert colors tool                                                       |
| `src/tools/readability/*.ts`         | 3 readability tools                                                      |
| `src/tools/motion/*.ts`              | 2 motion tools                                                           |
| `src/tools/navigation/*.ts`          | 2 navigation tools                                                       |
| `src/profiles/*.ts`                  | 6 profile presets                                                        |
| `src/i18n/locales/en.json`           | English translations                                                     |
| `src/i18n/locales/hi.json`           | Hindi translations                                                       |
| `src/ui/components/asw-widget.ts`    | Floating button Web Component                                            |
| `src/ui/components/asw-menu.ts`      | Sidebar panel Web Component                                              |
| `src/ui/components/asw-toggle.ts`    | Toggle switch (🚧 planned)                                               |
| `src/ui/components/asw-slider.ts`    | Range slider (🚧 planned)                                                |
| `src/ui/icons/lucide.ts`             | Lucide icon mappings (all tools, profiles, chrome)                       |
| `src/ui/icons/sprite.ts`             | Legacy sprite icons (to be removed)                                      |
| `src/ui/wire-up.ts`                  | Engine ↔ UI bridge, keyboard shortcuts, focus trap                       |
| `src/config/accessibility.config.ts` | Config schema, defaults, merge utility                                   |
| `src/react/**/*.tsx`                 | React adapter — Provider, hooks, components                              |
| `src/storage/*.ts`                   | localStorage + memory adapters                                           |

---

_Last updated: 2026-07-15_
_Corresponding roadmap: [ACCESSIBILITY_ROADMAP.md](./ACCESSIBILITY_ROADMAP.md)_
_Diagrams: [ACCESSIBILITY_ROADMAP_DIAGRAM.md](./ACCESSIBILITY_ROADMAP_DIAGRAM.md)_
