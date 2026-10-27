/**
 * AccessibilityProvider — React Context provider for the accessibility widget.
 *
 * Wraps the framework-agnostic AccessibilityEngine in a React Context
 * so any component in the tree can access and modify accessibility settings.
 *
 * Usage:
 *   <AccessibilityProvider engine={engine}>
 *     <App />
 *   </AccessibilityProvider>
 *
 * The engine should be created and initialized BEFORE passing it to the provider,
 * or use autoInit to have the provider call init() on mount.
 */
'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { AccessibilityEngine } from '../../engine/AccessibilityEngine'
import type { ISettings } from '../../types/ISettings'
import { createAccessibilityUI } from '../../ui/wire-up'
import { destroyActiveAccessibilityUI, getActiveAccessibilityUI } from '../../ui/lifecycle'

/** Shape of the context value */
export interface AccessibilityContextValue {
  /** Current settings snapshot */
  settings: Readonly<ISettings>
  /** Toggle a boolean tool */
  toggleTool: (toolId: string, enabled?: boolean | number) => void
  /** Set font scale (0.1–2.0) */
  setFontScale: (scale: number) => void
  /** Set line height spacing */
  setLineHeight: (height: number) => void
  /** Set letter spacing */
  setLetterSpacing: (spacing: number) => void
  /** Apply a named profile */
  applyProfile: (profileId: string) => void
  /** Deactivate the active profile */
  deactivateProfile: (profileId: string) => void
  /** Change language */
  setLanguage: (lang: string) => void
  /** Reset all settings */
  reset: () => void
  /** Check if a specific tool is enabled */
  isToolEnabled: (toolId: string) => boolean
  /** Get a specific tool value */
  getToolValue: (toolId: string) => unknown
  /** Reference to the engine instance */
  engine: AccessibilityEngine | null
  /** Mount/unmount the UI widget */
  showWidget: (options?: Parameters<typeof createAccessibilityUI>[1]) => void
  hideWidget: () => void
}

const AccessibilityReactContext = createContext<AccessibilityContextValue | null>(null)

export interface AccessibilityProviderProps {
  children: ReactNode
  /** Pre-initialized engine instance */
  engine: AccessibilityEngine
  /** Auto-initialize the engine on mount (default: true) */
  autoInit?: boolean
  /** Whether to auto-mount the UI widget (default: false) */
  showWidgetOnMount?: boolean
  /** Options for the UI widget if auto-mounted */
  widgetOptions?: Parameters<typeof createAccessibilityUI>[1]
}

export function AccessibilityProvider({
  children,
  engine,
  autoInit = true,
  showWidgetOnMount = false,
  widgetOptions,
}: AccessibilityProviderProps) {
  const [settings, setSettings] = useState<Readonly<ISettings>>(engine.settings)
  // With autoInit off the caller owns initialization, so treat the engine as ready.
  const [initialized, setInitialized] = useState(!autoInit)

  // Initialize engine on mount
  useEffect(() => {
    if (!autoInit) return
    let cancelled = false
    engine.init().then(() => {
      if (!cancelled) setInitialized(true)
    })
    return () => {
      cancelled = true
    }
  }, [engine, autoInit])

  // Subscription is independent of initialization so autoInit={false} still updates.
  useEffect(() => engine.subscribe(setSettings), [engine])

  const hideWidget = useCallback(() => {
    destroyActiveAccessibilityUI()
  }, [])

  const showWidget = useCallback(
    (opts?: Parameters<typeof createAccessibilityUI>[1]) => {
      if (typeof document === 'undefined') return
      createAccessibilityUI(engine, opts)
    },
    [engine]
  )

  // Auto-mount UI widget only when the resolved engine config allows it, and
  // never replace a widget that a declarative <AccessibilityWidget> already mounted.
  useEffect(() => {
    if (!showWidgetOnMount || !initialized || !engine.config.enabled) return
    if (getActiveAccessibilityUI()) return
    showWidget(widgetOptions)
    return () => hideWidget()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, showWidgetOnMount])

  const toggleTool = useCallback(
    (toolId: string, enabled?: boolean | number) => engine.toggleTool(toolId, enabled),
    [engine]
  )

  const setFontScale = useCallback(
    (scale: number) => engine.setFontScale(scale),
    [engine]
  )

  const setLineHeight = useCallback(
    (height: number) => engine.setLineHeight(height),
    [engine]
  )

  const setLetterSpacing = useCallback(
    (spacing: number) => engine.setLetterSpacing(spacing),
    [engine]
  )

  const applyProfile = useCallback(
    (profileId: string) => engine.applyProfile(profileId),
    [engine]
  )

  const deactivateProfile = useCallback(
    (profileId: string) => engine.deactivateProfile(profileId),
    [engine]
  )

  const setLanguage = useCallback(
    (lang: string) => {
      void engine.setLanguage(lang)
    },
    [engine]
  )

  const reset = useCallback(
    () => engine.reset(),
    [engine]
  )

  const isToolEnabled = useCallback(
    (toolId: string): boolean => engine.isToolEnabled(toolId),
    [engine]
  )

  const getToolValue = useCallback(
    (toolId: string) => engine.getToolValue(toolId),
    [engine]
  )

  const value: AccessibilityContextValue = {
    settings,
    toggleTool,
    setFontScale,
    setLineHeight,
    setLetterSpacing,
    applyProfile,
    deactivateProfile,
    setLanguage,
    reset,
    isToolEnabled,
    getToolValue,
    engine,
    showWidget,
    hideWidget,
  }

  return (
    <AccessibilityReactContext.Provider value={value}>
      {children}
    </AccessibilityReactContext.Provider>
  )
}

/**
 * Hook to consume the accessibility context.
 * Must be used within an AccessibilityProvider.
 */
export function useAccessibilityContext(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityReactContext)
  if (!ctx) {
    throw new Error(
      'useAccessibilityContext must be used within an AccessibilityProvider'
    )
  }
  return ctx
}
