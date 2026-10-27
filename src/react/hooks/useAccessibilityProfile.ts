/**
 * useAccessibilityProfile — Hook for applying accessibility profiles.
 *
 * @example
 *   const { apply, currentProfile } = useAccessibilityProfile()
 *   return (
 *     <button onClick={() => apply('seizure-safe')}>Seizure Safe</button>
 *   )
 */
'use client'

import { useCallback, useMemo } from 'react'
import { useAccessibilityContext } from '../provider/AccessibilityProvider'
import { PROFILES } from '../../profiles'

export function useAccessibilityProfile() {
  const ctx = useAccessibilityContext()

  const apply = useCallback(
    (profileId: string) => {
      ctx.applyProfile(profileId)
    },
    [ctx]
  )

  const availableProfiles = useMemo(() => Object.values(PROFILES), [])

  const isProfileActive = useCallback(
    (profileId: string): boolean => {
      const profile = PROFILES[profileId]
      if (!profile) return false
      const states = ctx.settings.states ?? {}
      return Object.entries(profile.states).every(([key, val]) => states[key] === val)
    },
    [ctx.settings.states]
  )

  return {
    /** Apply a profile by ID */
    apply,
    /** List of all available profiles */
    availableProfiles,
    /** Check if a profile's states match current settings */
    isProfileActive,
  }
}
