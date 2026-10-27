/**
 * open-a11y/react — Next.js/React adapter for the accessibility widget.
 *
 * Public API:
 * - AccessibilityProvider: React Context provider
 * - useAccessibility: Primary hook
 * - useAccessibilityTool: Individual tool hook
 * - useAccessibilityProfile: Profile management hook
 * - AccessibilityWidget: Floating button component
 * - AccessibilityPanel: Inline settings panel component
 *
 * Re-exports from core for single-import convenience (avoids dual-package type conflicts):
 * - AccessibilityEngine
 * - createMemoryAdapter / localStorageAdapter
 */
export { AccessibilityProvider, useAccessibilityContext } from './provider/AccessibilityProvider'
export type { AccessibilityContextValue } from './provider/AccessibilityProvider'
export { useAccessibility, useAccessibilityTool, useAccessibilityProfile } from './hooks'
export { AccessibilityWidget, AccessibilityPanel } from './components'

// Re-export core engine & storage so consumers don't hit dual-package type conflicts
export { AccessibilityEngine } from '../engine/AccessibilityEngine'
export type { AccessibilityEngineOptions } from '../engine/AccessibilityEngine'
export { localStorageAdapter, createMemoryAdapter } from '../storage'
