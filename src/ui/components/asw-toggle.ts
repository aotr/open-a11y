/**
 * <asw-toggle> — A toggle pill button for boolean accessibility tools.
 *
 * Usage:
 *   <asw-toggle tool-id="font-weight" label="Font Weight" icon="font-weight"></asw-toggle>
 *
 * Attributes:
 *   tool-id   — Matches a tool config ID
 *   label     — Human-readable label
 *   icon      — Icon ID from the sprite
 *   active    — Set to "true" to show as selected
 *
 * Events:
 *   toggle    — Fired with { toolId, enabled } on click
 */
import { renderIcon } from '../icons/sprite'

function getToggleTemplate(): string {
  return `
  <style>
    :host {
      display: contents;
    }
    .asw-btn {
      aspect-ratio: 6 / 5;
      border-radius: var(--asw-btn-radius, 12px);
      padding: 0 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      text-align: center;
      color: #333;
      font-size: 16px !important;
      background: var(--asw-card-bg, #fff) !important;
      border: var(--asw-btn-border, 2px) solid transparent !important;
      transition: border-color var(--asw-transition, 0.2s ease);
      cursor: pointer;
      word-break: break-word;
      gap: 10px;
      position: relative;
      width: auto !important;
      height: auto !important;
      font-family: inherit;
      user-select: none;
    }
    .asw-btn:hover, .asw-btn.asw-selected {
      border-color: var(--asw-primary, #0848ca) !important;
    }
    .asw-btn.asw-selected svg,
    .asw-btn.asw-selected span {
      fill: var(--asw-primary, #0848ca) !important;
      color: var(--asw-primary, #0848ca) !important;
    }
    :host(.asw-filter) .asw-btn.asw-selected:after {
      content: '';
      display: inline-block;
      position: absolute;
      top: 5px; right: 5px;
      background-color: var(--asw-primary, #0848ca) !important;
      color: #fff;
      width: 18px; height: 18px;
      border-radius: 50%;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='%23fff'%3E%3Cpath d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/%3E%3C/svg%3E");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      font-size: 10px;
    }
    .asw-btn svg {
      width: 34px; height: 34px;
      color: #64748b;
    }
    .asw-btn.asw-selected svg {
      color: var(--asw-accent, hsl(47.9, 95.8%, 53.1%));
    }
    .asw-btn.asw-selected span {
      color: var(--asw-accent, hsl(47.9, 95.8%, 53.1%));
    }
    .asw-btn span {
      font-size: 12px;
      line-height: 1.2;
      max-width: 100%;
      overflow-wrap: break-word;
    }
    @media (max-width: 420px) {
      .asw-btn { aspect-ratio: 4 / 3; }
    }
  </style>
  <button class="asw-btn" part="button">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34" fill="#333"></svg>
    <span class="asw-label"></span>
  </button>
`
}

const _HTMLElement = (typeof HTMLElement !== 'undefined' ? HTMLElement : class {}) as typeof HTMLElement

export class AswToggle extends _HTMLElement {
  private _button: HTMLButtonElement | null = null
  private _svg: SVGElement | null = null
  private _label: HTMLSpanElement | null = null

  static get observedAttributes(): string[] {
    return ['tool-id', 'label', 'icon', 'active']
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const tpl = document.createElement('template')
    tpl.innerHTML = getToggleTemplate()
    this.shadowRoot!.appendChild(tpl.content.cloneNode(true))
  }

  connectedCallback(): void {
    this._button = this.shadowRoot!.querySelector('.asw-btn')
    this._svg = this.shadowRoot!.querySelector('svg')
    this._label = this.shadowRoot!.querySelector('.asw-label')

    this._button?.addEventListener('click', this._onClick)

    this._render()
  }

  disconnectedCallback(): void {
    this._button?.removeEventListener('click', this._onClick)
  }

  attributeChangedCallback(): void {
    this._render()
  }

  get toolId(): string {
    return this.getAttribute('tool-id') ?? ''
  }

  set toolId(val: string) {
    this.setAttribute('tool-id', val)
  }

  get active(): boolean {
    return this.getAttribute('active') === 'true'
  }

  set active(val: boolean) {
    this.setAttribute('active', String(val))
  }

  private _onClick = (): void => {
    this.active = !this.active
    this.dispatchEvent(new CustomEvent('toggle', {
      bubbles: true,
      detail: { toolId: this.toolId, enabled: this.active },
    }))
  }

  private _render(): void {
    // Icon — use Lucide renderIcon which returns full SVG string
    const iconId = this.getAttribute('icon') ?? ''
    if (this._svg && iconId) {
      const svgString = renderIcon(iconId)
      if (svgString) {
        // Replace the outer SVG element by setting outerHTML on parent
        const temp = document.createElement('template')
        temp.innerHTML = svgString
        const newSvg = temp.content.firstChild
        if (newSvg) {
          this._svg.replaceWith(newSvg)
          this._svg = newSvg as SVGElement
        }
      }
    }

    // Label
    const label = this.getAttribute('label') ?? ''
    if (this._label) {
      this._label.textContent = label
    }

    // Active state
    const isActive = this.getAttribute('active') === 'true'
    if (this._button) {
      this._button.classList.toggle('asw-selected', isActive)
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('asw-toggle')) {
  customElements.define('asw-toggle', AswToggle)
}
