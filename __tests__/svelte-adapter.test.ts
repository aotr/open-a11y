/**
 * Svelte adapter tests.
 */
import { afterEach, describe, expect, it } from 'vitest'
import { get } from 'svelte/store'
import { AccessibilityEngine } from '../src/engine/AccessibilityEngine'
import { createMemoryAdapter } from '../src/storage/memoryAdapter'
import {
  accessibilityWidget,
  createAccessibilityStore,
} from '../src/svelte'
import { destroyActiveAccessibilityUI } from '../src/ui/lifecycle'

afterEach(() => {
  destroyActiveAccessibilityUI()
  document.querySelectorAll('asw-widget, asw-menu').forEach((el) => el.remove())
  document.body.style.overflow = ''
})

function createTestEngine() {
  return new AccessibilityEngine({ storage: createMemoryAdapter() })
}

describe('Svelte adapter', () => {
  it('creates a readable store backed by the engine', () => {
    const engine = createTestEngine()
    const store = createAccessibilityStore(engine)

    expect(get(store).lang).toBe('en')

    store.toggleTool('font-weight', true)
    expect(get(store).states['font-weight']).toBe(true)

    store.applyProfile('vision-impaired')
    expect(get(store).states.contrast).toBe('high-contrast')
    expect(get(store).states.activeProfile).toBe('vision-impaired')

    store.reset()
    expect(get(store).states).toEqual({})
  })

  it('notifies subscribers when engine state changes', () => {
    const engine = createTestEngine()
    const store = createAccessibilityStore(engine)
    const snapshots: Array<Record<string, unknown>> = []
    const unsubscribe = store.subscribe((settings) => {
      snapshots.push(settings.states ?? {})
    })

    engine.toggleTool('font-weight', true)
    engine.reset()
    unsubscribe()

    expect(snapshots[0]).toEqual({})
    expect(snapshots.some((states) => states['font-weight'] === true)).toBe(true)
  })

  it('mounts and destroys the widget through the action', () => {
    const engine = createTestEngine()
    const host = document.createElement('div')
    document.body.appendChild(host)

    const action = accessibilityWidget(host, {
      engine,
      position: 'top-left',
      config: { buttonSize: 48 },
    })

    const widget = document.querySelector('asw-widget')
    expect(widget?.getAttribute('position')).toBe('top-left')
    expect(widget?.getAttribute('button-size')).toBe('48')

    action.destroy()
    expect(document.querySelectorAll('asw-widget')).toHaveLength(0)
    host.remove()
  })

  it('remounts when action options change', () => {
    const engine = createTestEngine()
    const host = document.createElement('div')
    document.body.appendChild(host)

    const action = accessibilityWidget(host, { engine, position: 'bottom-right' })
    action.update({ engine, position: 'top-right' })

    expect(document.querySelectorAll('asw-widget')).toHaveLength(1)
    expect(document.querySelector('asw-widget')?.getAttribute('position')).toBe('top-right')

    action.destroy()
    host.remove()
  })

  it('exposes widget mount and hide actions', () => {
    const engine = createTestEngine()
    const store = createAccessibilityStore(engine)

    const controller = store.showWidget({ position: 'top-left' })
    expect(controller.widget.getAttribute('position')).toBe('top-left')

    store.hideWidget()
    expect(document.querySelectorAll('asw-widget')).toHaveLength(0)
  })
})
