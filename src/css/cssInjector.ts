/**
 * cssInjector — Manages dynamic <style> element injection into the DOM.
 *
 * Each tool gets a stylesheet identified by `asw-{tool-id}`.
 * Toggling a tool on injects the stylesheet; toggling off removes it.
 * This is non-destructive — no permanent DOM mutations occur.
 */
import type { IToolConfig } from '../types'
import { generateCSSFromConfig } from './cssGenerator'

/** Stylesheet ID prefix for all injected <style> elements */
const STYLE_ID_PREFIX = 'asw-'
let styleNonce = ''

function applyNonce(style: HTMLStyleElement): void {
  if (!styleNonce) return
  style.nonce = styleNonce
  style.setAttribute('nonce', styleNonce)
}

/** Set the CSP nonce used for every accessibility stylesheet. */
export function setStyleNonce(nonce: string | null): void {
  styleNonce = nonce ?? ''
  if (typeof document === 'undefined') return
  document.querySelectorAll<HTMLStyleElement>('style[data-asw]').forEach(applyNonce)
}

/**
 * Add or update a <style> element in the document head.
 * If a stylesheet with the same ID exists, it is updated in place.
 * Empty CSS removes the stylesheet instead of leaving a dead element.
 */
export function upsertStylesheet(id: string, css: string): void {
  if (typeof document === 'undefined') return

  const existing = document.getElementById(id)

  if (!css.trim()) {
    existing?.remove()
    return
  }

  if (existing && existing.tagName === 'STYLE') {
    const style = existing as HTMLStyleElement
    style.textContent = css
    style.setAttribute('data-asw', 'true')
    applyNonce(style)
    return
  }

  existing?.remove()

  const style = document.createElement('style')
  style.id = id
  style.setAttribute('data-asw', 'true')
  style.textContent = css
  applyNonce(style)
  document.head.appendChild(style)
}

/**
 * Remove a previously injected stylesheet by ID.
 */
export function removeStylesheet(id: string): void {
  if (typeof document === 'undefined') return
  document.getElementById(id)?.remove()
}

/**
 * Remove ALL injected accessibility stylesheets and their document classes.
 * Used for the "Reset" action.
 */
export function removeAllStylesheets(): void {
  if (typeof document === 'undefined') return

  document
    .querySelectorAll('style[data-asw], style[id^="asw-"]')
    .forEach((el) => el.remove())

  // Tool classes are applied to <html>; UI classes live inside shadow roots.
  Array.from(document.documentElement.classList)
    .filter((className) => className.startsWith('asw-'))
    .forEach((className) => document.documentElement.classList.remove(className))

  document.documentElement.style.removeProperty('--asw-font-scale')
}

/**
 * Main injection function — called by every tool toggle.
 *
 * When enabled:
 *   1. Generates CSS from the tool config
 *   2. Injects a <style id="asw-{toolId}"> element
 *   3. Adds class `asw-{toolId}` to <html> for cascade scoping
 *
 * When disabled:
 *   1. Removes the stylesheet
 *   2. Removes the class from <html>
 */
export function injectToolCSS(config: IToolConfig): void {
  if (typeof document === 'undefined') return

  const { id = '', enable = false } = config
  if (!id) return

  const toolId = `${STYLE_ID_PREFIX}${id}`

  if (enable) {
    const css = generateCSSFromConfig(config)
    upsertStylesheet(toolId, css)
    document.documentElement.classList.add(toolId)
  } else {
    removeStylesheet(toolId)
    document.documentElement.classList.remove(toolId)
  }
}
