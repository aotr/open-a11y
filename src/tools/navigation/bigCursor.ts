import { injectToolCSS } from '../../css/cssInjector'
import type { IToolConfig } from '../../types'
import { ALL_SELECTORS } from '../../css/selectors'

const bigCursorConfig: IToolConfig = {
  id: 'big-cursor',
  selector: 'html',
  childrenSelector: ALL_SELECTORS,
  styles: {
    cursor: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'%3E%3Cpath d=\'M4 4l6 18 4-4 6 6 4-4-6-6 4-4L4 4z\' fill=\'%23000\' stroke=\'%23fff\' stroke-width=\'1.5\'/%3E%3C/svg%3E") 0 0, auto',
  },
}

export default function bigCursor(enable = false): void {
  injectToolCSS({ ...bigCursorConfig, enable })
}
