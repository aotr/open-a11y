/**
 * Integration tests for the React adapter.
 *
 * Tests the AccessibilityProvider, hooks, and components in isolation
 * by rendering them with a test engine using the memory adapter.
 */
import { describe, it, expect, afterEach } from 'vitest'
import React from 'react'
import { render, renderHook, act } from '@testing-library/react'
import { AccessibilityEngine } from '../src/engine/AccessibilityEngine'
import { createMemoryAdapter } from '../src/storage/memoryAdapter'
import { AccessibilityProvider, useAccessibilityContext } from '../src/react/provider/AccessibilityProvider'
import { useAccessibility } from '../src/react/hooks/useAccessibility'
import { useAccessibilityTool } from '../src/react/hooks/useAccessibilityTool'
import { AccessibilityPanel } from '../src/react/components/AccessibilityPanel'
import { AccessibilityWidget } from '../src/react/components/AccessibilityWidget'
import { destroyActiveAccessibilityUI } from '../src/ui/lifecycle'
import type { IStorageAdapter } from '../src/storage/types'

afterEach(() => {
  destroyActiveAccessibilityUI()
  document.querySelectorAll('asw-widget, asw-menu').forEach((el) => el.remove())
  document.body.style.overflow = ''
})

// Helper to create a test engine
function createTestEngine(storage?: IStorageAdapter) {
  return new AccessibilityEngine({ storage: storage ?? createMemoryAdapter() })
}

describe('AccessibilityProvider', () => {
  it('should provide context to children', async () => {
    const engine = createTestEngine()

    const { result } = renderHook(
      () => useAccessibilityContext(),
      {
        wrapper: ({ children }) => (
          <AccessibilityProvider engine={engine} autoInit={false}>
            {children}
          </AccessibilityProvider>
        ),
      }
    )

    expect(result.current).toBeDefined()
    expect(result.current.settings).toBeDefined()
    expect(result.current.settings.lang).toBe('en')
  })

  it('should throw when used outside provider', () => {
    expect(() => {
      renderHook(() => useAccessibilityContext())
    }).toThrow('useAccessibilityContext must be used within an AccessibilityProvider')
  })
})

describe('useAccessibility', () => {
  it('should return engine methods', async () => {
    const engine = createTestEngine()

    const { result } = renderHook(
      () => useAccessibility(),
      {
        wrapper: ({ children }) => (
          <AccessibilityProvider engine={engine} autoInit={false}>
            {children}
          </AccessibilityProvider>
        ),
      }
    )

    expect(result.current.settings).toBeDefined()
    expect(result.current.states).toBeDefined()
    expect(typeof result.current.toggleTool).toBe('function')
    expect(typeof result.current.setFontScale).toBe('function')
    expect(typeof result.current.applyProfile).toBe('function')
    expect(typeof result.current.reset).toBe('function')
  })
})

describe('useAccessibilityTool', () => {
  it('should return tool state and controls', async () => {
    const engine = createTestEngine()

    const { result } = renderHook(
      () => useAccessibilityTool('font-weight'),
      {
        wrapper: ({ children }) => (
          <AccessibilityProvider engine={engine} autoInit={false}>
            {children}
          </AccessibilityProvider>
        ),
      }
    )

    expect(result.current.enabled).toBe(false)
    expect(typeof result.current.toggle).toBe('function')
    expect(typeof result.current.setEnabled).toBe('function')
  })

  it('should toggle tool when toggle is called', async () => {
    const engine = createTestEngine()

    const { result } = renderHook(
      () => useAccessibilityTool('font-weight'),
      {
        wrapper: ({ children }) => (
          <AccessibilityProvider engine={engine} autoInit={false}>
            {children}
          </AccessibilityProvider>
        ),
      }
    )

    expect(result.current.enabled).toBe(false)

    act(() => {
      result.current.toggle()
    })

    expect(engine.settings.states?.['font-weight']).toBe(true)
  })
})

describe('Widget lifecycle through React', () => {
  it('shows and hides the active widget through the provider', () => {
    const engine = createTestEngine()

    const { result } = renderHook(
      () => useAccessibilityContext(),
      {
        wrapper: ({ children }) => (
          <AccessibilityProvider engine={engine} autoInit={false}>
            {children}
          </AccessibilityProvider>
        ),
      }
    )

    act(() => result.current.showWidget())
    expect(document.querySelector('asw-widget')).not.toBeNull()

    act(() => result.current.hideWidget())
    expect(document.querySelector('asw-widget')).toBeNull()
  })

  it('does not double-mount when a declarative widget is present', () => {
    const engine = createTestEngine()

    render(
      <AccessibilityProvider engine={engine} autoInit={false} showWidgetOnMount>
        <AccessibilityWidget />
      </AccessibilityProvider>
    )

    expect(document.querySelectorAll('asw-widget')).toHaveLength(1)
    expect(document.querySelectorAll('asw-menu')).toHaveLength(1)
  })
})

describe('AccessibilityPanel', () => {
  it('should render without crashing', () => {
    const engine = createTestEngine()

    const { container } = render(
      <AccessibilityProvider engine={engine} autoInit={false}>
        <AccessibilityPanel />
      </AccessibilityProvider>
    )

    expect(container.querySelector('section')).toBeTruthy()
    // Should have profile buttons
    expect(container.querySelectorAll('button').length).toBeGreaterThan(10)
  })
})
