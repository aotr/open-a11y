/**
 * Reading Guide — Opaque bars above and below the cursor line.
 *
 * Creates two fixed-position divs that follow the mouse,
 * masking everything except the line being read.
 * Inspired by Sienna's readingGuide implementation.
 */
const GUIDE_CONTAINER_CLASS = 'asw-rg-container'
const GUIDE_CLASS = 'asw-rg'

/** Store handler reference for cleanup */
let onMouseMove: ((e: MouseEvent) => void) | null = null

export default function readingGuide(enable = false): void {
  if (typeof document === 'undefined') return

  let container = document.querySelector(`.${GUIDE_CONTAINER_CLASS}`)

  if (enable) {
    if (!container) {
      // Create mask elements
      container = document.createElement('div')
      container.classList.add(GUIDE_CONTAINER_CLASS)

      const topBar = document.createElement('div')
      topBar.classList.add(GUIDE_CLASS, 'asw-rg-top')
      Object.assign(topBar.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        width: '100%',
        height: '0',
        pointerEvents: 'none',
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: '1000000',
      })

      const bottomBar = document.createElement('div')
      bottomBar.classList.add(GUIDE_CLASS, 'asw-rg-bottom')
      Object.assign(bottomBar.style, {
        position: 'fixed',
        left: '0',
        right: '0',
        bottom: '0',
        width: '100%',
        height: '0',
        pointerEvents: 'none',
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: '1000000',
      })

      container.appendChild(topBar)
      container.appendChild(bottomBar)
      document.body.appendChild(container)

      const margin = 20
      const gap = 8 // Visible reading line height

      onMouseMove = (e: MouseEvent) => {
        topBar.style.height = `${Math.max(0, e.clientY - margin - gap / 2)}px`
        bottomBar.style.top = `${e.clientY + margin + gap / 2}px`
      }

      document.addEventListener('mousemove', onMouseMove, { passive: true })
    }
  } else {
    container?.remove()

    if (onMouseMove) {
      document.removeEventListener('mousemove', onMouseMove)
      onMouseMove = null
    }
  }
}
