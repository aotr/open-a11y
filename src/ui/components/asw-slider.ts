/**
 * <asw-slider> — A range slider for continuous values (font size, image sizing).
 *
 * Usage:
 *   <asw-slider tool-id="font-size" label="Font Size" min="0.1" max="2" step="0.1" value="1" unit="%"></asw-slider>
 *
 * Attributes:
 *   tool-id  — Matches a tool config ID
 *   label    — Human-readable label
 *   min      — Minimum value (default: 0.1)
 *   max      — Maximum value (default: 2.0)
 *   step     — Step increment (default: 0.1)
 *   value    — Current value
 *   unit     — Display unit (default: "%")
 *
 * Events:
 *   change   — Fired with { toolId, value } when value changes
 */

function getSliderTemplate(): string {
  return `
  <style>
    :host {
      display: block;
      background: var(--asw-card-bg, #fff);
      padding: 20px;
      margin-bottom: 20px;
      border-radius: var(--asw-btn-radius, 12px);
    }
    .asw-label {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 0;
    }
    .asw-label span {
      font-size: 14px !important;
      font-weight: 600 !important;
    }
    .asw-controls {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      align-items: center;
      font-size: 15px;
    }
    .asw-btn {
      background: var(--asw-bg, #eff1f5) !important;
      border-radius: 50%;
      width: 36px; height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 2px solid transparent;
      transition: border-color var(--asw-transition, 0.2s ease);
      user-select: none;
    }
    .asw-btn:hover { border-color: var(--asw-primary, #0848ca) !important; }
    .asw-btn svg { width: 24px; height: 24px; fill: #333; }
    .asw-amount {
      font-size: 18px !important;
      font-weight: 600 !important;
      min-width: 50px;
      text-align: center;
    }
  </style>
  <div class="asw-adjust-font">
    <div class="asw-label">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path d="M2 4v3h5v12h3V7h5V4H2m19 5h-9v3h3v7h3v-7h3V9Z"/>
      </svg>
      <span class="asw-label-text"></span>
    </div>
    <div class="asw-controls">
      <div class="asw-btn asw-minus" role="button" tabindex="0" title="Decrease">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2Z"/></svg>
      </div>
      <div class="asw-amount">100%</div>
      <div class="asw-btn asw-plus" role="button" tabindex="0" title="Increase">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z"/></svg>
      </div>
    </div>
  </div>
`
}

const _HTMLElement = (typeof HTMLElement !== 'undefined' ? HTMLElement : class {}) as typeof HTMLElement

export class AswSlider extends _HTMLElement {
  private _minus: HTMLElement | null = null
  private _plus: HTMLElement | null = null
  private _amount: HTMLElement | null = null
  private _label: HTMLElement | null = null
  private _onMinusClick: (() => void) | null = null
  private _onPlusClick: (() => void) | null = null

  static get observedAttributes(): string[] {
    return ['label', 'value', 'unit', 'min', 'max', 'step']
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const tpl = document.createElement('template')
    tpl.innerHTML = getSliderTemplate()
    this.shadowRoot!.appendChild(tpl.content.cloneNode(true))
  }

  connectedCallback(): void {
    this._minus = this.shadowRoot!.querySelector('.asw-minus')
    this._plus = this.shadowRoot!.querySelector('.asw-plus')
    this._amount = this.shadowRoot!.querySelector('.asw-amount')
    this._label = this.shadowRoot!.querySelector('.asw-label-text')

    this._onMinusClick = () => this._adjust(-1)
    this._onPlusClick = () => this._adjust(1)
    this._minus?.addEventListener('click', this._onMinusClick)
    this._plus?.addEventListener('click', this._onPlusClick)

    this._render()
  }

  disconnectedCallback(): void {
    if (this._onMinusClick) this._minus?.removeEventListener('click', this._onMinusClick)
    if (this._onPlusClick) this._plus?.removeEventListener('click', this._onPlusClick)
    this._onMinusClick = null
    this._onPlusClick = null
  }

  attributeChangedCallback(): void {
    this._render()
  }

  get toolId(): string {
    return this.getAttribute('tool-id') ?? ''
  }

  get value(): number {
    return parseFloat(this.getAttribute('value') ?? '1')
  }

  private get _min(): number {
    return parseFloat(this.getAttribute('min') ?? '0.1')
  }

  private get _max(): number {
    return parseFloat(this.getAttribute('max') ?? '2.0')
  }

  private get _step(): number {
    return parseFloat(this.getAttribute('step') ?? '0.1')
  }

  private get _unit(): string {
    return this.getAttribute('unit') ?? '%'
  }

  private _adjust(direction: 1 | -1): void {
    let newValue = this.value + direction * this._step
    newValue = Math.max(this._min, Math.min(this._max, newValue))
    newValue = Number(newValue.toFixed(2))
    this.setAttribute('value', String(newValue))

    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: { toolId: this.toolId, value: newValue },
    }))
  }

  private _render(): void {
    const label = this.getAttribute('label') ?? ''
    if (this._label) this._label.textContent = label

    const val = this.value
    if (this._amount) {
      if (this._unit === '%') {
        this._amount.textContent = `${Math.round(val * 100)}%`
      } else {
        this._amount.textContent = `${val}${this._unit}`
      }
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('asw-slider')) {
  customElements.define('asw-slider', AswSlider)
}
