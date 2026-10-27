/**
 * <asw-widget> — Floating accessibility widget button.
 *
 * A fixed-position circular button that opens the accessibility sidebar panel.
 * Styled with a trust-themed green gradient matching a finance-product
 * design language. Uses Lucide icons.
 *
 * Usage:
 *   <asw-widget position="bottom-left" offset-x="20" offset-y="20"></asw-widget>
 *
 * Attributes:
 *   position  — "bottom-left" | "bottom-right" | "top-left" | "top-right"
 *   offset-x  — Horizontal offset in px (default: 20)
 *   offset-y  — Vertical offset in px (default: 20)
 *   aria-expanded — Synced with sidebar open/close state
 *
 * Events:
 *   asw:open — Fired when the button is clicked (sidebar should open)
 */

import { renderLucideIcon } from '../icons/lucide'

function getTemplate(): string {
  const iconSvg = renderLucideIcon('accessibility', 32)
  return `
  <style>
    :host {
      position: fixed;
      z-index: 500000;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    :host(:hover) { transform: scale(1.08); }
    :host([hidden]) { display: none !important; }

    button {
      border-radius: 50%;
      align-items: center;
      justify-content: center;
      width: var(--asw-btn-size, 56px);
      height: var(--asw-btn-size, 56px);
      display: flex;
      cursor: pointer;
      border: 3px solid white;
      outline: 3px solid var(--asw-brand-primary, hsl(158, 64%, 35%));
      text-decoration: none;
      background: linear-gradient(135deg, var(--asw-brand-primary, hsl(158, 64%, 35%)) 0%, var(--asw-brand-primary-dark, hsl(158, 64%, 28%)) 100%);
      padding: 0;
      box-shadow: 0 4px 14px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.1);
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                  box-shadow 0.3s ease,
                  outline-color 0.3s ease;
    }
    button:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 20px rgba(0,0,0,0.2), 0 3px 8px rgba(0,0,0,0.12);
    }
    button:focus-visible {
      outline: 3px solid var(--asw-brand-accent, hsl(47.9, 95.8%, 53.1%));
      outline-offset: 4px;
    }
    button svg {
      width: calc(var(--asw-btn-size, 56px) * 0.57);
      height: calc(var(--asw-btn-size, 56px) * 0.57);
      color: white;
    }

    /* Pulse animation — plays 3 times on first mount */
    @keyframes asw-btn-pulse {
      0% { box-shadow: 0 4px 14px rgba(0,0,0,0.15), 0 0 0 0 rgba(var(--asw-brand-primary-rgb, 32, 146, 115), 0.5); }
      70% { box-shadow: 0 4px 14px rgba(0,0,0,0.15), 0 0 0 14px rgba(var(--asw-brand-primary-rgb, 32, 146, 115), 0); }
      100% { box-shadow: 0 4px 14px rgba(0,0,0,0.15), 0 0 0 0 rgba(var(--asw-brand-primary-rgb, 32, 146, 115), 0); }
    }
    .asw-pulse {
      animation: asw-btn-pulse 1.8s ease-out 3;
    }

    @media (max-width: 768px) {
      button { width: var(--asw-btn-size-mobile, 44px); height: var(--asw-btn-size-mobile, 44px); }
      button svg { width: calc(var(--asw-btn-size-mobile, 44px) * 0.55); height: calc(var(--asw-btn-size-mobile, 44px) * 0.55); }
    }
  </style>
  <button
    part="button"
    class="asw-pulse"
    aria-label="Open Accessibility Settings (Alt+A)"
    aria-expanded="false"
    title="Accessibility (Alt+A)"
  >
    ${iconSvg}
  </button>
`
}

// Guard against SSR — HTMLElement is not defined in Node.js
const _HTMLElement = (typeof HTMLElement !== 'undefined' ? HTMLElement : class {}) as typeof HTMLElement

export class AswWidget extends _HTMLElement {
  private _button: HTMLButtonElement | null = null

  static get observedAttributes(): string[] {
    return ['position', 'offset-x', 'offset-y', 'button-size', 'show-button', 'aria-expanded']
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const tpl = document.createElement('template')
    tpl.innerHTML = getTemplate()
    this.shadowRoot!.appendChild(tpl.content.cloneNode(true))
  }

  connectedCallback(): void {
    this._button = this.shadowRoot!.querySelector('button')
    this._button?.addEventListener('click', this._onClick)
    this._applyPosition()
    this._applyButtonSize()
    this._applyShowButton()

    // Remove pulse class after animation completes (3 cycles × 1.8s)
    setTimeout(() => {
      this._button?.classList.remove('asw-pulse')
    }, 5500)
  }

  disconnectedCallback(): void {
    this._button?.removeEventListener('click', this._onClick)
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    if (name === 'aria-expanded') {
      this._button?.setAttribute('aria-expanded', value ?? 'false')
    } else if (name === 'button-size') {
      this._applyButtonSize()
    } else if (name === 'show-button') {
      this._applyShowButton()
    } else {
      this._applyPosition()
    }
  }

  /** Sync expanded state for ARIA */
  setExpanded(expanded: boolean): void {
    this.setAttribute('aria-expanded', String(expanded))
  }

  /** Show the floating button */
  showButton(): void {
    this.removeAttribute('hidden')
    this.setAttribute('show-button', 'true')
  }

  /** Hide the floating button */
  hideButton(): void {
    this.setAttribute('hidden', '')
    this.setAttribute('show-button', 'false')
  }

  /** Check if the button is currently visible */
  get buttonVisible(): boolean {
    return !this.hasAttribute('hidden')
  }

  private _applyButtonSize(): void {
    const size = this.getAttribute('button-size')
    if (size) {
      const px = `${size}px`
      this.style.setProperty('--asw-btn-size', px)
      const mobile = Math.max(44, Math.round(parseInt(size, 10) * 0.785))
      this.style.setProperty('--asw-btn-size-mobile', `${mobile}px`)
    }
  }

  private _applyShowButton(): void {
    const val = this.getAttribute('show-button')
    if (val === 'false' || val === '0') {
      this.setAttribute('hidden', '')
    } else {
      this.removeAttribute('hidden')
    }
  }

  private _onClick = (e: Event): void => {
    e.preventDefault()
    e.stopPropagation()
    this.dispatchEvent(new CustomEvent('asw:open', { bubbles: true }))
  }

  private _applyPosition(): void {
    const position = this.getAttribute('position') ?? 'bottom-right'
    const offsetX = parseInt(this.getAttribute('offset-x') ?? '20', 10)
    const offsetY = parseInt(this.getAttribute('offset-y') ?? '20', 10)

    const style: Record<string, string> = {}

    switch (position) {
      case 'bottom-right':
        style.bottom = `${offsetY}px`
        style.right = `${offsetX}px`
        style.left = 'auto'
        style.top = 'auto'
        break
      case 'top-left':
        style.top = `${offsetY}px`
        style.left = `${offsetX}px`
        style.bottom = 'auto'
        break
      case 'top-right':
        style.top = `${offsetY}px`
        style.right = `${offsetX}px`
        style.left = 'auto'
        style.bottom = 'auto'
        break
      default: // bottom-left
        style.bottom = `${offsetY}px`
        style.left = `${offsetX}px`
        break
    }

    Object.assign(this.style, style)
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('asw-widget')) {
  customElements.define('asw-widget', AswWidget)
}
