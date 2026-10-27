/**
 * Focus Mode — Dims everything except the element under the cursor.
 *
 * Uses a semi-transparent overlay that follows the hovered element,
 * making it easier for users with attention disorders to focus.
 */
const FOCUS_OVERLAY_CLASS = 'asw-focus-overlay'

let overlay: HTMLElement | null = null
let onMouseOver: ((e: MouseEvent) => void) | null = null
let onMouseOut: ((e: MouseEvent) => void) | null = null

export default function focusMode(enable = false): void {
  if (typeof document === 'undefined') return

  if (enable) {
    if (!overlay) {
      overlay = document.createElement('div')
      overlay.classList.add(FOCUS_OVERLAY_CLASS)
      Object.assign(overlay.style, {
        position: 'fixed',
        inset: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: '999998',
        pointerEvents: 'none',
        transition: 'opacity 0.2s',
        opacity: '1',
      })
      document.body.appendChild(overlay)

      // Create a "window" element that shows the hovered area clearly
      const window_ = document.createElement('div')
      window_.classList.add('asw-focus-window')
      Object.assign(window_.style, {
        position: 'fixed',
        zIndex: '999999',
        pointerEvents: 'none',
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
        borderRadius: '8px',
        transition: 'all 0.1s ease-out',
      })
      document.body.appendChild(window_)

      onMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        if (target === overlay || target === window_) return

        const rect = target.getBoundingClientRect()
        Object.assign(window_.style, {
          top: `${rect.top - 8}px`,
          left: `${rect.left - 8}px`,
          width: `${rect.width + 16}px`,
          height: `${rect.height + 16}px`,
          opacity: '1',
        })
      }

      onMouseOut = () => {
        window_.style.opacity = '0'
      }

      document.addEventListener('mouseover', onMouseOver, { passive: true })
      document.addEventListener('mouseout', onMouseOut, { passive: true })
    }
  } else {
    overlay?.remove()
    overlay = null
    document.querySelector('.asw-focus-window')?.remove()

    if (onMouseOver) {
      document.removeEventListener('mouseover', onMouseOver)
      onMouseOver = null
    }
    if (onMouseOut) {
      document.removeEventListener('mouseout', onMouseOut)
      onMouseOut = null
    }
  }
}
