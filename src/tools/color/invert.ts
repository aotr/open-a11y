import { upsertStylesheet, removeStylesheet } from '../../css/cssInjector'
import { generateCSS } from '../../css/cssGenerator'

const INVERT_ID = 'asw-invert'

/**
 * Media elements that should be re-inverted so they don't appear as negatives.
 * The double-invert (inverted parent + self-invert) restores their original look.
 */
const MEDIA_SELECTORS = [
  'img',
  'video',
  'canvas',
  'iframe',
  'svg',
  '[role="img"]',
  'picture',
].join(',')

export function enableInvert(enable = false): void {
  if (typeof document === 'undefined') return

  if (enable) {
    const invertCSS = generateCSS({ filter: 'invert(100%) hue-rotate(180deg)' })
    // Apply invert to html, then re-invert media so they stay normal.
    // Also neutralizes Dark Reader to prevent conflicting color modifications.
    const css = `html{${invertCSS};--darkreader-mode:0!important}
html ${MEDIA_SELECTORS}{${invertCSS}}`
    upsertStylesheet(INVERT_ID, css)
    document.documentElement.classList.add(INVERT_ID)
  } else {
    removeStylesheet(INVERT_ID)
    document.documentElement.classList.remove(INVERT_ID)
  }
}

export { enableInvert as default, enableInvert as invert }
