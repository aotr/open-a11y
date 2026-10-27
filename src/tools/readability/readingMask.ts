/**
 * Reading Mask — A translucent overlay with a transparent reading slit.
 *
 * Creates a full-page semi-transparent overlay with a narrow transparent
 * band that follows the mouse, helping users focus on one line at a time.
 * Similar to reading guide but uses a single slit instead of two bars.
 */
const MASK_CONTAINER_CLASS = 'asw-rm-container'
const MASK_OVERLAY_CLASS = 'asw-rm-overlay'
const MASK_SLIT_CLASS = 'asw-rm-slit'
const MASK_HANDLE_CLASS = 'asw-rm-handle'

/** Store handler reference for cleanup */
let onMouseMove: ((e: MouseEvent) => void) | null = null
let resizeObserver: ResizeObserver | null = null

export default function readingMask(enable = false): void {
  if (typeof document === 'undefined') return

  let container = document.querySelector(`.${MASK_CONTAINER_CLASS}`) as HTMLElement | null

  if (enable) {
    if (!container) {
      // Create container
      container = document.createElement('div')
      container.classList.add(MASK_CONTAINER_CLASS)

      // Top overlay (above the slit)
      const topOverlay = document.createElement('div')
      topOverlay.classList.add(MASK_OVERLAY_CLASS, 'asw-rm-top')
      Object.assign(topOverlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '0',
        backgroundColor: 'rgba(0,0,0,0.65)',
        zIndex: '1000000',
        pointerEvents: 'none',
        transition: 'height 0.05s linear',
      })

      // Bottom overlay (below the slit)
      const bottomOverlay = document.createElement('div')
      bottomOverlay.classList.add(MASK_OVERLAY_CLASS, 'asw-rm-bottom')
      Object.assign(bottomOverlay.style, {
        position: 'fixed',
        left: '0',
        bottom: '0',
        width: '100%',
        height: '0',
        backgroundColor: 'rgba(0,0,0,0.65)',
        zIndex: '1000000',
        pointerEvents: 'none',
        transition: 'height 0.05s linear',
      })

      // Slit handle (draggable visual indicator)
      const slit = document.createElement('div')
      slit.classList.add(MASK_SLIT_CLASS)
      Object.assign(slit.style, {
        position: 'fixed',
        left: '0',
        width: '100%',
        height: '28px',
        zIndex: '1000001',
        pointerEvents: 'none',
        borderTop: '2px solid rgba(255,255,255,0.3)',
        borderBottom: '2px solid rgba(255,255,255,0.3)',
        boxSizing: 'border-box',
      })

      const handle = document.createElement('div')
      handle.classList.add(MASK_HANDLE_CLASS)
      Object.assign(handle.style, {
        position: 'absolute',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '40px',
        height: '4px',
        borderRadius: '2px',
        backgroundColor: 'rgba(255,255,255,0.5)',
      })
      slit.appendChild(handle)

      container.appendChild(topOverlay)
      container.appendChild(bottomOverlay)
      container.appendChild(slit)
      document.body.appendChild(container)

      const slitHeight = 28
      const margin = 12

      onMouseMove = (e: MouseEvent) => {
        const slitTop = e.clientY - margin
        topOverlay.style.height = `${Math.max(0, slitTop)}px`
        const slitBottom = e.clientY + slitHeight + margin
        bottomOverlay.style.top = `${slitBottom}px`
        bottomOverlay.style.height = ''
        slit.style.top = `${slitTop}px`
      }

      document.addEventListener('mousemove', onMouseMove, { passive: true })

      // Handle resize
      resizeObserver = new ResizeObserver(() => {
        // Re-trigger to recalculate on viewport change
        // Position stays relative to cursor, nothing to do
      })
      resizeObserver.observe(document.body)
    }
  } else {
    container?.remove()
    container = null

    if (onMouseMove) {
      document.removeEventListener('mousemove', onMouseMove)
      onMouseMove = null
    }

    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
  }
}
