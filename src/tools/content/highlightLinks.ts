import { injectToolCSS } from '../../css/cssInjector'
import type { IToolConfig } from '../../types'
import { LINKS_SELECTORS } from '../../css/selectors'

const highlightLinksConfig: IToolConfig = {
  id: 'highlight-links',
  selector: 'html',
  childrenSelector: LINKS_SELECTORS,
  styles: {
    outline: '3px solid #0048ff',
    'outline-offset': '2px',
    'background-color': 'rgba(0, 72, 255, 0.1)',
  },
  css: `
/* Extra visibility for image-only links */
html.asw-highlight-links a[href] img,
html.asw-highlight-links a[href] svg,
html.asw-highlight-links a[href] picture {
  outline: 2px solid #0048ff !important;
  outline-offset: 2px !important;
  border-radius: 4px !important;
}
`,
}

export default function highlightLinks(enable = false): void {
  injectToolCSS({ ...highlightLinksConfig, enable })
}
