import { injectToolCSS } from '../../css/cssInjector'
import type { IToolConfig } from '../../types'
import { ALL_SELECTORS } from '../../css/selectors'

const stopAnimationsConfig: IToolConfig = {
  id: 'stop-animations',
  selector: 'html',
  childrenSelector: ALL_SELECTORS,
  styles: {
    transition: 'none',
    'animation-fill-mode': 'forwards',
    'animation-iteration-count': '1',
    'animation-duration': '0.01s',
  },
}

export default function stopAnimations(enable = false): void {
  injectToolCSS({ ...stopAnimationsConfig, enable })
}
