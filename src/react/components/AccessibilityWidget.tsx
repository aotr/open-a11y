/**
 * AccessibilityWidget — React component that mounts the framework-agnostic
 * Web Components via the wire-up utility on mount, and destroys them on unmount.
 *
 * This is the primary entry point for adding the widget to a Next.js page.
 *
 * @example
 *   // app/layout.tsx
 *   import { AccessibilityProvider } from '@/features/accessibility/react'
 *   import { AccessibilityWidget } from '@/features/accessibility/react'
 *   import { AccessibilityEngine } from '@/features/accessibility'
 *   import { localStorageAdapter } from '@/features/accessibility/storage'
 *
 *   const engine = new AccessibilityEngine({ storage: localStorageAdapter })
 *
 *   export default function RootLayout({ children }) {
 *     return (
 *       <AccessibilityProvider engine={engine} autoInit showWidgetOnMount>
 *         {children}
 *       </AccessibilityProvider>
 *     )
 *   }
 *
 * Or standalone:
 *   <AccessibilityWidget position="bottom-right" />
 */
'use client'

import { useEffect } from 'react'
import { useAccessibilityContext } from '../provider/AccessibilityProvider'
import type { UIOptions } from '../../ui/wire-up'

interface AccessibilityWidgetProps extends UIOptions {
  /** Position of the floating button (default: 'bottom-right') */
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  /** Panel slide direction: 'right' (default) or 'left' */
  side?: 'right' | 'left'
  /** Whether to show backdrop blur when panel is open (default: true) */
  blur?: boolean
  /** Custom container element selector for mounting */
  mountSelector?: string
}

export function AccessibilityWidget({
  position,
  offsetX,
  offsetY,
  side,
  blur,
  container,
  mountSelector,
  config,
}: AccessibilityWidgetProps) {
  const { engine, showWidget, hideWidget } = useAccessibilityContext()

  useEffect(() => {
    if (!engine) return

    const target = mountSelector
      ? (document.querySelector(mountSelector) as HTMLElement)
      : container

    // Undefined props defer to the engine's resolved config; explicit props win.
    showWidget({
      position,
      offsetX,
      offsetY,
      side,
      blur,
      container: target ?? undefined,
      config,
    })

    return () => hideWidget()
  }, [engine, position, offsetX, offsetY, side, blur, container, mountSelector, config, showWidget, hideWidget])

  // This component doesn't render anything itself — it mounts Web Components
  // into the DOM via createAccessibilityUI.
  return null
}
