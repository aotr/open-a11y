/**
 * Hide Images — Completely hides all images on the page.
 *
 * Targets img, picture, svg, canvas, video, and role="img" elements
 * by injecting a stylesheet that sets display: none on all of them.
 */
import { injectToolCSS } from '../../css/cssInjector'
import type { IToolConfig } from '../../types'

const hideImagesConfig: IToolConfig = {
  id: 'hide-images',
  selector: 'html',
  childrenSelector: ['img', 'picture', 'svg', 'canvas', 'video', '[role="img"]'],
  styles: {
    'display': 'none !important',
  },
}

export default function hideImages(enable = false): void {
  injectToolCSS({ ...hideImagesConfig, enable })
}
