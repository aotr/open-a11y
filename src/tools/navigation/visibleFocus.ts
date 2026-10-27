import { injectToolCSS } from '../../css/cssInjector'
import type { IToolConfig } from '../../types'

const visibleFocusConfig: IToolConfig = {
  id: 'visible-focus',
  selector: 'html',
  childrenSelector: ['a', 'button', 'input', 'select', 'textarea', '[tabindex]'],
  styles: {
    outline: '3px solid #0048ff',
    'outline-offset': '3px',
  },
}

export default function visibleFocus(enable = false): void {
  injectToolCSS({ ...visibleFocusConfig, enable })
}
