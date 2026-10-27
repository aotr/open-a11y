# Changelog

All notable changes to `open-a11y` will be documented in this file.

## [2.1.0] — 2026-10-27

### Added

- `buttonSizeMobile` config for a separate mobile floating-button size in CSS pixels
- Mobile button-size control in the example customizer

### Changed

- Default widget palette is now cobalt and rust instead of green and gold
- Brand colors remain fully overridable through `brand.primary`, `brand.primaryDark`, and `brand.accent`

## [2.0.3] — 2026-10-27

### Changed

- Migrated development, checks, tests, and demo builds to Vite+ (`vp check`, `vp test`, `vp dev`, `vp build`)
- Oxfmt formatting and Oxlint type-aware checks now run through Vite+
- Examples use Vite+ configs and Vite+ dev/build commands

## [2.0.2] — 2026-10-27

### Fixed

- Angular adapter now mounts through `mountAccessibilityWidget()` instead of a directive, so AOT production builds do not depend on linked template metadata

## [2.0.1] — 2026-10-26

### Fixed

- Published README and package metadata for the scoped npm package

## [2.0.0] — 2026-10-26

### Added

- **Vue 3 adapter** (`@aotr/open-a11y/vue`): plugin, `useAccessibility()`, and `A11yWidget`
- **Svelte 5 adapter** (`@aotr/open-a11y/svelte`): readable store and `accessibilityWidget` action
- **Angular adapter** (`@aotr/open-a11y/angular`): `provideAccessibility()`, signal service, and AOT-ready widget directive
- **Laravel companion package** (`aotr/open-a11y-laravel`) with Blade and Livewire components
- Standalone browser bundle (`@aotr/open-a11y/browser`) for script tags, Blade, and Livewire
- Five runnable example apps with live UI customization
- CI workflow for lint, unit tests, build, dist smoke tests, and demo builds

### Changed

- **Package is published as `@aotr/open-a11y`** with repositories at `aotr/open-a11y` and `aotr/open-a11y-laravel`
- **Single tool manifest** (`src/tools/manifest.ts`) now drives config defaults, the engine, the web menu, the React panel, and tests
- **Default visibility is opt-out**: every tool and profile is visible unless explicitly disabled
- Profiles are now complete presets: applying one resets continuous values and exclusive groups before applying its states
- Hindi is bundled with the package and ships in `dist` (previously the dynamic import was never emitted)
- Split package identity from the widget palette: `brand.primary`, `brand.primaryDark`, and `brand.accent` map to CSS custom properties; `brand.footerText`/`brand.name` render an optional configurable footer
- Added `labels` config map to override any UI string by i18n key (`widget.menuTitle`, `widget.reset`, etc.) in both the web menu and React panel
- Runtime bundles are now built with Rollup and minified; declarations are emitted by TypeScript, and Angular declarations are built with ng-packagr
- React provider now subscribes even with `autoInit={false}`; added `setLineHeight`, `setLetterSpacing`, and `deactivateProfile`
- React panel and web menu render from the manifest; React icons now render real Lucide SVGs

### Fixed

- Duplicate external-trigger listeners and observers in `createAccessibilityUI`, plus a destroy path that now removes all listeners
- Global shortcuts no longer fire while typing in inputs, textareas, selects, or contenteditable elements
- Escape closes the nested tool-description modal before the sidebar
- Info buttons are siblings of tool buttons instead of nested interactive elements; adjusters are real `<button>`s
- `@import` rules are hoisted before generated CSS so fonts load reliably
- Empty stylesheets are removed instead of left in the document; reset only removes library-owned styles/classes
- Added the missing `dist/styles.css` build output
- Removed dead Tailwind config

## [1.2.0] — 2026-07-16

### Added

- **Readable Font (Lexend)** — second dyslexia-friendly font option alongside OpenDyslexic
- `readable-font-alt` tool with Lexend font loaded from Google Fonts

### Fixed

- **Highlight Links** — images inside links (e.g. footer App Store icons) now get a visible outline
- Added `a[href] img`, `a[href] svg`, `a[href] picture` to link selectors with `!important` override

## [1.1.0] — 2026-07-16

### Added

- **Hide Images** tool — hides all images, videos, and media elements
- **Reading Mask** tool — translucent overlay with a transparent reading slit that follows the mouse
- **Screen Reader** tool — adds skip-to-content link and enhances page structure
- **Text Alignment** — 4 exclusive alignment options (Left, Center, Right, Justify)
- **Motor Impaired** profile — big cursor, visible focus, reduced motion, reading guide
- Info (i) buttons on all tool buttons showing tool descriptions via tooltip
- Lucide icons: `ImageOff`, `AlignLeft`, `AlignCenter`, `AlignRight`, `AlignJustify`, `Ear`, `ScanLine`, `Info`, `Hand`
- Hindi (hi) translations for all new tools and descriptions

### Changed

- Updated to 7 accessibility profiles (was 6)
- Updated to 20+ accessibility tools (was 16)
- `asw-menu.ts`: profiles, content tools, filter tools, and tool buttons now include description keys
- `btnHtml()`: accepts optional `descKey` parameter and renders info icon with tooltip
- `AccessibilityPanel.tsx`: added Motor Impaired profile label, new tools to all arrays
- `AccessibilityEngine.ts`: added `TEXT_ALIGN_KEYS`, `handleTextAlignToggle()`, support for all new boolean tools
- `wire-up.ts`: added `asw:textalign` event handler
- `lucide.ts` + `sprite.ts`: registered all new icons
- i18n `en.json`, `hi.json`, `translator.ts`: added all new tool labels, descriptions, and profile entries

## [1.0.0] — 2026-07-13

### Added

- Initial public release
- 16 accessibility tools (font scaling, contrast modes, readability tools, etc.)
- 6 accessibility profiles (seizure-safe, vision-impaired, ADHD-friendly, etc.)
- Framework-agnostic Web Components (`<asw-widget>`, `<asw-menu>`, `<asw-toggle>`, `<asw-slider>`)
- React adapter (`AccessibilityProvider`, hooks, components)
- Dual CJS/ESM build via tsup
- i18n support (English + Hindi, extensible to 40+ languages)
- `localStorage` and in-memory storage adapters
- Configurable panel side (left/right), position, offset, blur, and feature flags
- Keyboard shortcuts (Alt+A to toggle, Alt+R to reset, Escape to close)
- Focus trap within sidebar panel
- Scroll lock when panel is open
- Full TypeScript support with generated declaration files
- 99 unit tests
