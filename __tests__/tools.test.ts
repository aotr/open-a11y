/**
 * Tool registry and continuous-tool tests.
 *
 * The manifest is the metadata source of truth; tool modules only export
 * executors. No parallel `*Config` objects are part of the public surface.
 */
import { afterEach, describe, expect, it } from 'vitest'
import * as toolRegistry from '../src/tools'
import {
  BOOLEAN_TOOLS,
  CONTINUOUS_TOOLS,
  EXCLUSIVE_GROUPS,
  TOOLS,
} from '../src/tools/manifest'
import { FILTERS } from '../src/tools/color/contrast'
import { TEXT_ALIGNMENTS } from '../src/tools/content/textAlignment'
import { adjustFontSize } from '../src/tools/content/fontSize'
import { adjustLineHeight } from '../src/tools/content/lineHeight'
import { adjustLetterSpacing } from '../src/tools/content/letterSpacing'
import { removeAllStylesheets } from '../src/css/cssInjector'

afterEach(() => {
  removeAllStylesheets()
})

describe('Tool registry', () => {
  it('does not expose parallel tool config objects', () => {
    expect(Object.keys(toolRegistry).filter((key) => key.endsWith('Config'))).toEqual([])
  })

  it('gives every manifest entry an executable behavior', () => {
    expect(TOOLS.length).toBeGreaterThan(20)
    for (const tool of BOOLEAN_TOOLS) {
      expect(typeof tool.executor, tool.id).toBe('function')
    }
    for (const tool of CONTINUOUS_TOOLS) {
      expect(typeof tool.apply, tool.id).toBe('function')
    }
    for (const group of Object.values(EXCLUSIVE_GROUPS)) {
      expect(typeof group.apply, group.id).toBe('function')
    }
  })

  it('keeps the filter and text-alignment registries complete', () => {
    expect(Object.keys(FILTERS)).toEqual([
      'dark-contrast',
      'light-contrast',
      'high-contrast',
      'high-saturation',
      'low-saturation',
      'monochrome',
    ])
    expect(Object.keys(TEXT_ALIGNMENTS)).toEqual([
      'text-align-left',
      'text-align-center',
      'text-align-right',
      'text-justify',
    ])
  })
})

describe('Continuous tools use the shared CSS injector', () => {
  it('injects, updates, and removes the font-size stylesheet', () => {
    adjustFontSize(1.5)

    const style = document.getElementById('asw-font-size')
    expect(style?.tagName).toBe('STYLE')
    expect(style?.getAttribute('data-asw')).toBe('true')
    expect(style?.textContent).toContain('font-size:150%!important')
    expect(document.documentElement.classList.contains('asw-font-size')).toBe(true)
    expect(document.documentElement.style.getPropertyValue('--asw-font-scale')).toBe('1.5')

    adjustFontSize(1)
    expect(document.getElementById('asw-font-size')).toBeNull()
    expect(document.documentElement.classList.contains('asw-font-size')).toBe(false)
  })

  it('reuses the same line-height stylesheet instead of duplicating it', () => {
    adjustLineHeight(1.5)
    const first = document.getElementById('asw-line-height')

    adjustLineHeight(1.8)

    expect(document.getElementById('asw-line-height')).toBe(first)
    expect(first?.getAttribute('data-asw')).toBe('true')
    expect(first?.textContent).toContain('line-height:1.8!important')
    expect(document.querySelectorAll('#asw-line-height')).toHaveLength(1)
  })

  it('injects and removes letter spacing through the same path', () => {
    adjustLetterSpacing(2)

    const style = document.getElementById('asw-letter-spacing')
    expect(style?.getAttribute('data-asw')).toBe('true')
    expect(style?.textContent).toContain('letter-spacing:2px!important')

    adjustLetterSpacing(0)
    expect(document.getElementById('asw-letter-spacing')).toBeNull()
  })
})
