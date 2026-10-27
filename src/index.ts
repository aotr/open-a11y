/**
 * open-a11y — Framework-agnostic accessibility widget core.
 *
 * Public API:
 * - AccessibilityEngine: Main orchestrator
 * - StateManager: Observable preference state
 * - Storage adapters: localStorage, in-memory
 * - All tool configs & executors
 * - Profile presets
 * - i18n translations
 * - UI: Web Components (asw-widget, asw-menu, asw-toggle, asw-slider)
 * - UI: createAccessibilityUI (one-shot engine wiring)
 *
 * React adapters are available at "open-a11y/react".
 */

// UI (Web Components + wire-up)
export { createAccessibilityUI, getActiveAccessibilityUI, destroyActiveAccessibilityUI } from './ui'
export type { AccessibilityUIController } from './ui'
export type { UIOptions } from './ui/wire-up'
export { AswWidget, AswMenu, AswToggle, AswSlider, ICONS, renderIcon, renderLucideIcon, LUCIDE_ICONS, widgetCSS } from './ui'

// Engine (main entry point)
export { AccessibilityEngine } from './engine'
export type { AccessibilityEngineOptions } from './engine'

// State (StateManager is internal; the engine is the public state owner)
export { STORAGE_KEY } from './state'

// Storage
export type { IStorageAdapter } from './storage/types'
export { localStorageAdapter, createMemoryAdapter } from './storage'

// Config
export { mergeConfig, DEFAULT_ACCESSIBILITY_CONFIG } from './config/accessibility.config'
export type { IAccessibilityConfig, IAccessibilityFeatures, IAccessibilityHooks } from './config/accessibility.config'

// CSS
export { generateCSS, generateCSSFromConfig, wrapCSSToSelector } from './css/cssGenerator'
export { injectToolCSS, upsertStylesheet, removeStylesheet, removeAllStylesheets, setStyleNonce } from './css/cssInjector'
export * from './css/selectors'

// Types
export type { IToolConfig, ISettings, ISettingsStates, IProfile } from './types'

// Tools
export * from './tools'

// Profiles
export { PROFILES, seizureSafeProfile, visionImpairedProfile, adhdFriendlyProfile, cognitiveDisabilityProfile, keyboardNavigationProfile, blindUsersProfile } from './profiles'

// i18n
export { translate, translateWith, initTranslations, getDefaultLanguage, LANGUAGES, LANGUAGE_CODES, loadTranslations } from './i18n'
export type { ILanguage } from './i18n'
