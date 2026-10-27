/**
 * useAccessibility — Primary hook for accessing the accessibility engine.
 *
 * Provides shorthand access to all engine methods + current settings.
 *
 * @example
 *   const { settings, toggleTool, setFontScale, applyProfile } = useAccessibility()
 *   return <button onClick={() => toggleTool('font-weight')}>Toggle Bold</button>
 */
'use client'

import { useAccessibilityContext } from '../provider/AccessibilityProvider'

export function useAccessibility() {
  const ctx = useAccessibilityContext()

  return {
    /** Current settings snapshot */
    settings: ctx.settings,
    /** All tool states keyed by tool ID */
    states: ctx.settings.states ?? {},
    /** Current language */
    lang: ctx.settings.lang ?? 'en',
    /** Toggle a boolean tool */
    toggleTool: ctx.toggleTool,
    /** Set font scale (0.1–2.0) */
    setFontScale: ctx.setFontScale,
    /** Set line height spacing */
    setLineHeight: ctx.setLineHeight,
    /** Set letter spacing */
    setLetterSpacing: ctx.setLetterSpacing,
    /** Apply a named profile */
    applyProfile: ctx.applyProfile,
    /** Deactivate the active profile */
    deactivateProfile: ctx.deactivateProfile,
    /** Change language */
    setLanguage: ctx.setLanguage,
    /** Reset all settings */
    reset: ctx.reset,
    /** Check if a specific tool is enabled */
    isToolEnabled: ctx.isToolEnabled,
    /** Get a specific tool value */
    getToolValue: ctx.getToolValue,
    /** Engine instance (for config-driven labels and custom integrations) */
    engine: ctx.engine,
  }
}
