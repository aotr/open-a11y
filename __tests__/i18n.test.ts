/**
 * Unit tests for i18n system.
 */
import { describe, it, expect } from 'vitest'
import { LANGUAGES } from '../src/i18n/languages'
import { translate } from '../src/i18n/translator'

// Pre-load English for synchronous tests
import en from '../src/i18n/locales/en.json'
import { TRANSLATION_DICTIONARY } from '../src/i18n/languages'
TRANSLATION_DICTIONARY['en'] = en

describe('Languages', () => {
  it('should register English and Hindi', () => {
    const codes = LANGUAGES.map((l) => l.code)
    expect(codes).toContain('en')
    expect(codes).toContain('hi')
  })

  it('each language should have code and label', () => {
    LANGUAGES.forEach((lang) => {
      expect(lang.code).toBeDefined()
      expect(lang.label).toBeDefined()
      expect(lang.nativeLabel).toBeDefined()
    })
  })
})

describe('Translator', () => {
  it('should translate dot-notation keys', () => {
    const result = translate('widget.menuTitle', 'en')
    expect(result).toBe('Accessibility Menu')
  })

  it('should fall back to key when translation missing', () => {
    const result = translate('nonexistent.key', 'en')
    expect(result).toBe('nonexistent.key')
  })

  it('should fall back to custom fallback value', () => {
    const result = translate('nonexistent.key', 'en', 'Default Text')
    expect(result).toBe('Default Text')
  })

  it('should translate tool names', () => {
    expect(translate('tools.fontSize', 'en')).toBe('Font Size')
    expect(translate('tools.bigCursor', 'en')).toBe('Big Cursor')
    expect(translate('tools.monochrome', 'en')).toBe('Monochrome')
  })

  it('should translate profile names', () => {
    expect(translate('profiles.seizureSafe', 'en')).toBe('Seizure Safe')
    expect(translate('profiles.visionImpaired', 'en')).toBe('Vision Impaired')
  })
})
