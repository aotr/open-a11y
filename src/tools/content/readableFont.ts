/**
 * Readable Font (Dyslexia Font) — Loads OpenDyslexic and applies it.
 *
 * Uses @font-face to load the dyslexia-friendly typeface from CDN,
 * then applies it to all text elements.
 */
import { injectToolCSS } from '../../css/cssInjector'
import type { IToolConfig } from '../../types'
import { ALL_ELEMENT_SELECTORS, TEXT_SELECTORS } from '../../css/selectors'

const readableFontConfig: IToolConfig = {
  id: 'readable-font',
  selector: 'html',
  childrenSelector: [...ALL_ELEMENT_SELECTORS, ...TEXT_SELECTORS],
  styles: {
    'font-family': 'OpenDyslexic3, Comic Sans MS, Arial, Helvetica, sans-serif',
  },
  css: `@font-face{font-family:OpenDyslexic3;src:url("https://website-widgets.pages.dev/fonts/OpenDyslexic3-Regular.woff") format("woff"),url("https://website-widgets.pages.dev/fonts/OpenDyslexic3-Regular.ttf") format("truetype");font-display:swap}`,
}

export default function readableFont(enable = false): void {
  injectToolCSS({ ...readableFontConfig, enable })
}
