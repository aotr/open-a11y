/**
 * Unit tests for StateManager — the observable preference state machine.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { StateManager } from '../src/state/StateManager'
import { createMemoryAdapter } from '../src/storage/memoryAdapter'
import type { IStorageAdapter } from '../src/storage/types'

describe('StateManager', () => {
  let storage: IStorageAdapter
  let manager: StateManager

  beforeEach(() => {
    storage = createMemoryAdapter()
    manager = new StateManager(storage)
  })

  it('should initialize with default settings', () => {
    const state = manager.getState()
    expect(state.lang).toBe('en')
    expect(state.states).toEqual({})
  })

  it('should accept initial settings', () => {
    const mgr = new StateManager(storage, {
      lang: 'hi',
      states: { fontSize: 1.5 },
    })
    const state = mgr.getState()
    expect(state.lang).toBe('hi')
    expect(state.states?.fontSize).toBe(1.5)
  })

  it('should set a tool and notify subscribers', () => {
    const states: unknown[] = []
    manager.subscribe((s) => states.push(s.states))

    manager.setTool('font-weight', true)

    const current = manager.getState()
    expect(current.states?.['font-weight']).toBe(true)
    expect(current.updatedAt).toBeDefined()
    expect(states.length).toBeGreaterThan(0)
  })

  it('should toggle a tool off', () => {
    manager.setTool('font-weight', true)
    manager.setTool('font-weight', false)

    const current = manager.getState()
    expect(current.states?.['font-weight']).toBe(false)
  })

  it('should check tool enabled state', () => {
    expect(manager.isToolEnabled('big-cursor')).toBe(false)
    manager.setTool('big-cursor', true)
    expect(manager.isToolEnabled('big-cursor')).toBe(true)
  })

  it('should batch set tool states', () => {
    manager.setMany({
      'font-weight': true,
      lineHeight: 1.5,
      'big-cursor': true,
    })

    const state = manager.getState()
    expect(state.states?.['font-weight']).toBe(true)
    expect(state.states?.lineHeight).toBe(1.5)
    expect(state.states?.['big-cursor']).toBe(true)
  })

  it('should set language', () => {
    manager.setLanguage('hi')
    expect(manager.getState().lang).toBe('hi')
  })

  it('should reset all settings but preserve language', () => {
    manager.setTool('font-weight', true)
    manager.setLanguage('hi')
    manager.reset()

    const state = manager.getState()
    expect(state.lang).toBe('hi')
    expect(state.states?.['font-weight']).toBeUndefined()
  })

  it('should persist settings to storage', () => {
    manager.setTool('monochrome', true)

    const stored = storage.get('asw-user-settings')
    expect(stored).toBeDefined()
    const parsed = JSON.parse(stored as string)
    expect(parsed.states.contrast).toBe('monochrome')
  })

  it('should hydrate from storage', () => {
    storage.set('asw-user-settings', JSON.stringify({
      lang: 'hi',
      states: { 'font-weight': true },
    }))

    const mgr = new StateManager(storage)
    mgr.hydrate()

    const state = mgr.getState()
    expect(state.lang).toBe('hi')
    expect(state.states?.['font-weight']).toBe(true)
  })

  it('should handle corrupted storage gracefully', () => {
    storage.set('asw-user-settings', 'not-json{{{')

    const mgr = new StateManager(storage)
    mgr.hydrate()

    // Should still have defaults
    expect(mgr.getState().lang).toBe('en')
  })

  it('should unsubscribe listeners', () => {
    let called = false
    const unsub = manager.subscribe(() => { called = true })
    unsub()
    manager.setTool('font-weight', true)
    expect(called).toBe(false)
  })

  it('should return frozen state', () => {
    const state = manager.getState()
    expect(Object.isFrozen(state)).toBe(true)

    // Modifying the returned snapshot should not affect internal state
    manager.setTool('font-weight', true)
    expect(state.states?.['font-weight']).toBeUndefined() // snapshot is stale
  })
})
