/**
 * CSS injector tests — CSP nonce support, in-place updates, and cleanup.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  injectToolCSS,
  removeAllStylesheets,
  removeStylesheet,
  setStyleNonce,
  upsertStylesheet,
} from '../src/css/cssInjector'

beforeEach(() => {
  removeAllStylesheets()
  setStyleNonce(null)
})

afterEach(() => {
  removeAllStylesheets()
  setStyleNonce(null)
})

describe('CSS injector', () => {
  it('injects one marked stylesheet and updates it in place', () => {
    upsertStylesheet('asw-test', '* { color: red; }')
    const first = document.getElementById('asw-test')

    expect(first?.tagName).toBe('STYLE')
    expect(first?.getAttribute('data-asw')).toBe('true')

    upsertStylesheet('asw-test', '* { color: blue; }')
    const second = document.getElementById('asw-test')

    expect(second).toBe(first)
    expect(second?.textContent).toBe('* { color: blue; }')
    expect(document.querySelectorAll('#asw-test')).toHaveLength(1)
  })

  it('removes a stylesheet when CSS is empty or explicitly removed', () => {
    upsertStylesheet('asw-empty', '* { color: red; }')
    upsertStylesheet('asw-empty', '   ')
    expect(document.getElementById('asw-empty')).toBeNull()

    upsertStylesheet('asw-remove', '* { color: blue; }')
    removeStylesheet('asw-remove')
    expect(document.getElementById('asw-remove')).toBeNull()
  })

  it('applies a nonce to existing and future stylesheets', () => {
    upsertStylesheet('asw-nonce', '* { margin: 0; }')
    setStyleNonce('r@nd0m')

    const existing = document.getElementById('asw-nonce') as HTMLStyleElement
    expect(existing.nonce).toBe('r@nd0m')
    expect(existing.getAttribute('nonce')).toBe('r@nd0m')

    upsertStylesheet('asw-nonce-next', '* { padding: 0; }')
    const next = document.getElementById('asw-nonce-next') as HTMLStyleElement
    expect(next.nonce).toBe('r@nd0m')
  })

  it('injects generated tool CSS and removes its class on disable', () => {
    injectToolCSS({
      id: 'sample',
      selector: 'html',
      styles: { color: 'red' },
      enable: true,
    })

    const style = document.getElementById('asw-sample')
    expect(style?.getAttribute('data-asw')).toBe('true')
    expect(style?.textContent).toContain('color:red')
    expect(document.documentElement.classList.contains('asw-sample')).toBe(true)

    injectToolCSS({ id: 'sample', selector: 'html', styles: { color: 'red' }, enable: false })
    expect(document.getElementById('asw-sample')).toBeNull()
    expect(document.documentElement.classList.contains('asw-sample')).toBe(false)
  })

  it('removes all accessibility styles, classes, and font scale on reset', () => {
    upsertStylesheet('asw-one', '* { color: red; }')
    upsertStylesheet('asw-two', '* { color: blue; }')
    document.documentElement.classList.add('asw-one', 'asw-two')
    document.documentElement.style.setProperty('--asw-font-scale', '1.5')

    removeAllStylesheets()

    expect(document.querySelectorAll('style[data-asw]')).toHaveLength(0)
    expect(document.documentElement.classList.contains('asw-one')).toBe(false)
    expect(document.documentElement.classList.contains('asw-two')).toBe(false)
    expect(document.documentElement.style.getPropertyValue('--asw-font-scale')).toBe('')
  })
})
