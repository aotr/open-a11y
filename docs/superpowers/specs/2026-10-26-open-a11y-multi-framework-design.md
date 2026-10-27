# open-a11y 2.1 — Multi-Framework and Laravel Design

**Date:** 2026-10-26
**Status:** Approved

## Goal

Ship `open-a11y` as an MIT-licensed, multi-framework accessibility widget under
the author's identity, with tested adapters, standalone demos, and a separate
Laravel package for Blade and Livewire.

## Repositories and packages

| Repo | Package | Ecosystem |
|---|---|---|
| `aotr/open-a11y` | `@aotr/open-a11y` | npm |
| `aotr/open-a11y-laravel` | `aotr/open-a11y-laravel` | Composer/Packagist |

Both repos are new public repositories. The old private repository is left
untouched. The GitHub handle `aotr` is used as the professional scope; the
display name remains **open-a11y**.

## JavaScript package

Add optional framework entries:

| Entry | Public API | Peer |
|---|---|---|
| `@aotr/open-a11y/react` | Existing provider/hooks/components | `react >=17` |
| `@aotr/open-a11y/vue` | `createAccessibilityPlugin`, `useAccessibility`, `A11yWidget` | `vue >=3` |
| `@aotr/open-a11y/svelte` | `createAccessibilityStore`, `accessibilityWidget` | `svelte >=5` |
| `@aotr/open-a11y/angular` | `provideAccessibility`, `AccessibilityService`, `AccessibilityWidgetDirective` | `@angular/core >=17` |

All adapter entries import the core entry at runtime. They do not bundle a
second engine, locale table, stylesheet registry, or widget session.

Adapters are thin wrappers over `AccessibilityEngine`:

- reactive settings snapshots
- typed actions for tools, profiles, language, reset, and widget mount/hide
- lifecycle cleanup through the existing process-wide registry
- SSR-safe mount methods

## Demos

### JavaScript repo

Five separate apps:

- `examples/vanilla`
- `examples/react`
- `examples/vue`
- `examples/svelte`
- `examples/angular`

Each app has its own dev/build command, a live widget, and a customization
panel for position, side, offset, blur, button size, brand colors, footer copy,
menu title, language, and visibility. Configuration changes remount the UI while
preserving engine state and storage.

### Laravel repo

One Laravel demo application with two routes:

- `/blade` — Blade component and plain JS customization controls
- `/livewire` — Livewire component with reactive customization controls

The Composer package provides:

- `x-open-a11y::widget` Blade component
- `OpenA11y\Livewire\AccessibilityWidget` Livewire component
- config publishing, view publishing, and script/style asset publishing
- customization props for position, side, offset, blur, button size, colors,
  footer, labels, language, and visibility

## Documentation

Root READMEs follow modern library conventions modeled on Zag, Floating UI, and
a11y-dialog:

- badges, short pitch, and screenshot
- why/features
- adapter table
- install and quick start per framework
- configuration and canonical state
- demos and local commands
- testing, build, browser support, contributing, and MIT license

Deep reference material stays in `docs/`.

## Metadata and identity

- package author: Animesh Chakraborty / `aotr`
- MIT license, copyright 2024–2026
- repository, homepage, bugs, keywords, exports, peer dependencies
- changelog and contributing guide in both repos
- CI for lint, unit tests, build, dist smoke tests, and demo builds
- Laravel CI for Composer tests and Blade/Livewire rendering

## Verification

- `npm run lint`
- full Vitest suite, including Vue, Svelte, Angular, React, and adapter dist tests
- `npm run build` and smoke tests proving all entries share one core runtime
- each JS demo production build
- browser checks on all five JS demos, including live customization
- Composer tests plus Laravel Blade/Livewire browser checks
- zero tracked legacy-brand references

## Publishing

- create and push both public GitHub repos
- publish npm package when npm authentication is valid
- prepare Packagist submission when credentials are available
