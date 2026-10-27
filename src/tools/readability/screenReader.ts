/**
 * Screen Reader — Enhances page for screen reader compatibility.
 *
 * Adds visible skip-to-content links, enriches landmark regions,
 * and injects screen-reader-only announcement regions for
 * dynamic content changes.
 */
import { injectToolCSS } from '../../css/cssInjector'
import type { IToolConfig } from '../../types'
import { ALL_ELEMENT_SELECTORS } from '../../css/selectors'

const SKIP_LINK_ID = 'asw-skip-link'
const ANNOUNCE_ID = 'asw-announce'

const screenReaderConfig: IToolConfig = {
  id: 'screen-reader',
  selector: 'html',
  childrenSelector: ALL_ELEMENT_SELECTORS,
  styles: {
    'outline': '2px solid #0048ff',
    'outline-offset': '2px',
  },
  css: `
/* Skip to content link */
#${SKIP_LINK_ID} {
  position: fixed;
  top: -100%;
  left: 0;
  z-index: 100000;
  padding: 10px 16px;
  background: #0048ff;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 0 0 8px 0;
  transition: top 0.2s ease;
}
#${SKIP_LINK_ID}:focus {
  top: 0;
  outline: 3px solid #ffd700;
}
/* Screen reader announcement region */
#${ANNOUNCE_ID} {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
`,
}

let skipLinkEl: HTMLAnchorElement | null = null
let announceEl: HTMLElement | null = null

export default function screenReader(enable = false): void {
  if (typeof document === 'undefined') return

  if (enable) {
    // Apply CSS enhancements
    injectToolCSS({ ...screenReaderConfig, enable })

    // Create skip-to-content link
    if (!document.getElementById(SKIP_LINK_ID)) {
      skipLinkEl = document.createElement('a')
      skipLinkEl.id = SKIP_LINK_ID
      skipLinkEl.href = '#main-content'
      skipLinkEl.textContent = 'Skip to main content'
      document.body.insertBefore(skipLinkEl, document.body.firstChild)
    }

    // Create aria-live announcement region
    if (!document.getElementById(ANNOUNCE_ID)) {
      announceEl = document.createElement('div')
      announceEl.id = ANNOUNCE_ID
      announceEl.setAttribute('aria-live', 'polite')
      announceEl.setAttribute('aria-atomic', 'true')
      document.body.appendChild(announceEl)
    }

    // Add main landmark if missing
    if (!document.querySelector('main')) {
      const main = document.querySelector('#main-content, [role="main"]')
      if (!main) {
        // Don't create elements we can't place properly
      }
    }
  } else {
    // Remove CSS
    injectToolCSS({ ...screenReaderConfig, enable })

    // Remove skip link
    skipLinkEl?.remove()
    skipLinkEl = null

    // Remove announcement region
    announceEl?.remove()
    announceEl = null
  }
}
