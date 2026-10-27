# 📚 `open-a11y` — Documentation

Comprehensive feature-by-feature documentation explaining how the accessibility package works under the hood.

## Structure

| Document                                              | Description                                                                                |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [Engine](engine.md)                                   | `AccessibilityEngine` — main orchestrator, lifecycle, public API                           |
| [State Manager](state-manager.md)                     | Internal preference store with persistence                                                 |
| [Storage Adapters](storage-adapters.md)               | localStorage & in-memory persistence                                                       |
| [Configuration System](config-system.md)              | Schema, defaults, merge logic                                                              |
| **Tools**                                             |                                                                                            |
| → [Content Adjustments](tools/content-adjustments.md) | Font size, weight, line height, letter spacing, dyslexia font, hide images, text alignment |
| → [Color & Contrast](tools/color-contrast.md)         | Contrast modes, invert, saturation, monochrome                                             |
| → [Readability](tools/readability.md)                 | Reading guide, reading ruler, focus mode, reading mask, screen reader                      |
| → [Navigation](tools/navigation.md)                   | Big cursor, visible focus                                                                  |
| → [Motion](tools/motion.md)                           | Stop animations, reduced motion                                                            |
| [Profiles](profiles.md)                               | Pre-configured accessibility presets (7 profiles)                                          |
| [CSS System](css-system.md)                           | Dynamic CSS generation & injection                                                         |
| [Web Components](web-components.md)                   | asw-widget, asw-menu, asw-toggle, asw-slider                                               |
| [React Adapter](react-adapter.md)                     | Provider, hooks, components                                                                |
| [Vue Adapter](vue-adapter.md)                         | Plugin, composable, widget component                                                       |
| [Svelte Adapter](svelte-adapter.md)                   | Readable store and widget action                                                           |
| [Angular Adapter](angular-adapter.md)                 | Providers, signal service, directive                                                       |
| [Internationalization](i18n.md)                       | Translation system architecture                                                            |
| [Keyboard Shortcuts](keyboard-shortcuts.md)           | Keyboard navigation & focus management                                                     |
| [Publishing](publishing.md)                           | npm publish guide                                                                          |

## Architecture Overview

```
User clicks widget button
        │
        ▼
┌──────────────────┐
│  Web Components   │  ← UI layer (asw-widget, asw-menu)
│  (Shadow DOM)     │     Custom Elements with encapsulated styles
└────────┬─────────┘
         │ asw:toggle, asw:profile, asw:continuous events
         ▼
┌──────────────────┐
│  wire-up.ts       │  ← Bridge layer
│  (event wiring)   │     Connects UI events → Engine commands
└────────┬─────────┘
         │ engine.toggleTool(), engine.applyProfile(), etc.
         ▼
┌──────────────────┐
│ AccessibilityEngine│ ← Public state owner
│                    │    Resolve config once, canonical group state,
│                    │    one transaction per change
└────────┬─────────┘
         │
    ┌────┴─────┬──────────┬──────────┐
    ▼          ▼          ▼          ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌──────────┐
│Tools   │ │State  │ │CSS    │ │Profiles  │
│29 tools│ │(internal)│ │System │ │7 presets │
└───────┘ └───┬───┘ └───────┘ └──────────┘
              │ persist / hydrate
              ▼
       ┌──────────────┐
       │Storage Adapter│
       │(localStorage) │
       └──────────────┘
```
