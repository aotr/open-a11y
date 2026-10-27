/**
 * Unit tests for accessibility profiles.
 */
import { describe, it, expect } from 'vitest'
import { PROFILES } from '../src/profiles'

describe('Profiles', () => {
  it('should have all 7 profiles registered', () => {
    const ids = Object.keys(PROFILES)
    expect(ids).toHaveLength(7)
    expect(ids).toContain('seizure-safe')
    expect(ids).toContain('vision-impaired')
    expect(ids).toContain('adhd-friendly')
    expect(ids).toContain('cognitive-disability')
    expect(ids).toContain('keyboard-navigation')
    expect(ids).toContain('blind-users')
    expect(ids).toContain('motor-impaired')
  })

  it.each(Object.entries(PROFILES))('%s should have required fields', (_id, profile) => {
    expect(profile.id).toBeDefined()
    expect(profile.label).toBeDefined()
    expect(profile.description).toBeDefined()
    expect(profile.icon).toBeDefined()
    expect(profile.states).toBeDefined()
    expect(typeof profile.states).toBe('object')
    expect(Object.keys(profile.states).length).toBeGreaterThan(0)
  })

  it('vision-impaired should include fontSize at 1.5', () => {
    const profile = PROFILES['vision-impaired']
    expect(profile.states.fontSize).toBe(1.5)
  })

  it('seizure-safe should disable animations', () => {
    const profile = PROFILES['seizure-safe']
    expect(profile.states['stop-animations']).toBe(true)
    expect(profile.states['reduced-motion']).toBe(true)
  })
})
