/**
 * <asw-menu> — Full accessibility settings sidebar panel.
 *
 * The panel renders entirely from the tool manifest and profile registry.
 * It owns presentation and DOM events; the engine remains the only writer of
 * accessibility state.
 *
 * Usage:
 *   <asw-menu id="asw-menu" lang="en"></asw-menu>
 *
 * Attributes:
 *   lang     — Language code (default: "en")
 *   open     — Set to "true" to show the sidebar
 *
 * Events:
 *   asw:closed  — Fired when the menu is closed
 *   asw:reset   — Fired when user clicks reset
 *   asw:toggle  — Fired when a tool is toggled
 *   asw:contrast — Fired when a contrast option is selected
 *   asw:profile  — Fired when a profile is applied
 *   asw:textalign — Fired when a text alignment is selected
 *   asw:continuous — Fired when a continuous tool changes
 *   asw:language — Fired when language changes
 */
import { renderIcon } from "../icons/sprite";
import { renderLucideIcon } from "../icons/lucide";
import { widgetCSS } from "../styles/base.css";
import { translate } from "../../i18n/translator";
import { PROFILES } from "../../profiles";
import type {
  IAccessibilityBrand,
  IAccessibilityFeatures,
} from "../../config/accessibility.config";
import {
  CONTINUOUS_TOOLS,
  TOOLS,
  getTool,
  isContinuousTool,
  isExclusiveTool,
  toolsByCategory,
  type ContinuousTool,
  type Tool,
} from "../../tools/manifest";

function t(key: string, lang = "en"): string {
  return translate(key, lang);
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function iconSvg(id: string): string {
  return renderIcon(id);
}

function infoButton(label: string, desc: string, icon: string): string {
  if (!desc) return "";
  return `<button type="button" class="asw-btn-info" data-desc="${escapeAttr(desc)}" data-label="${escapeAttr(label)}" data-icon="${escapeAttr(icon)}" aria-label="About ${escapeAttr(label)}">${renderLucideIcon("info", 10)}</button>`;
}

function btnHtml(tool: Tool, extraClass = ""): string {
  const label = t(tool.labelKey);
  const desc = tool.descKey ? t(tool.descKey) : "";
  const group = isExclusiveTool(tool) ? ` data-group="${tool.group.id}"` : "";
  return `<div class="asw-btn-wrap" data-tool="${tool.id}">
    <button class="asw-btn ${extraClass}" type="button" data-key="${tool.id}" data-translate="${tool.labelKey}" title="${escapeAttr(label)}" aria-pressed="false"${group}>
      <span class="asw-btn-icon">${iconSvg(tool.icon)}</span>
      <span class="asw-btn-label"><span class="asw-translate" data-translate="${tool.labelKey}">${escapeAttr(label)}</span></span>
    </button>
    ${infoButton(label, desc, tool.icon)}
  </div>`;
}

function profileBtnHtml(profile: (typeof PROFILES)[string]): string {
  const label = t(profile.label);
  const desc = t(profile.description);
  return `<div class="asw-btn-wrap" data-profile="${profile.id}">
    <button class="asw-btn asw-profile" type="button" data-key="${profile.id}" data-translate="${profile.label}" title="${escapeAttr(label)}" aria-pressed="false">
      <span class="asw-btn-icon">${iconSvg(profile.icon)}</span>
      <span class="asw-btn-label"><span class="asw-translate" data-translate="${profile.label}">${escapeAttr(label)}</span></span>
    </button>
    ${infoButton(label, desc, profile.icon)}
  </div>`;
}

function adjusterHtml(tool: ContinuousTool): string {
  const label = t(tool.labelKey);
  return `<div class="asw-adjust-font" data-key="${tool.id}" data-tool="${tool.id}">
    <div class="asw-label">
      ${iconSvg(tool.icon)}
      <div class="asw-translate" data-translate="${tool.labelKey}">${escapeAttr(label)}</div>
    </div>
    <div>
      <button type="button" class="asw-step asw-minus" data-key="${tool.id}" title="Decrease ${escapeAttr(label)}" aria-label="Decrease ${escapeAttr(label)}">
        ${iconSvg("minus")}
      </button>
      <div class="asw-amount" id="asw-${tool.id}-amount" aria-live="polite">${tool.format(tool.defaultValue)}</div>
      <button type="button" class="asw-step asw-plus" data-key="${tool.id}" title="Increase ${escapeAttr(label)}" aria-label="Increase ${escapeAttr(label)}">
        ${iconSvg("plus")}
      </button>
    </div>
  </div>`;
}

function card(titleKey: string, section: string, items: Tool[], extraClass = ""): string {
  if (items.length === 0) return "";
  return `<div class="asw-card" data-section="${section}">
    <h3 class="asw-card-title asw-translate" data-translate="${titleKey}">${t(titleKey)}</h3>
    <div class="asw-items ${extraClass}">
      ${items.map((tool) => btnHtml(tool, extraClass)).join("")}
    </div>
  </div>`;
}

function getMenuTemplate(): string {
  const globeIcon = renderLucideIcon("language", 14);
  const contentTools = toolsByCategory("content");
  const continuous = contentTools.filter(isContinuousTool);
  const contentButtons = contentTools.filter((tool) => !isContinuousTool(tool));
  const colorTools = toolsByCategory("color");
  const alignTools = toolsByCategory("text-align");
  const tools = toolsByCategory("tools");

  return `
  <style>${widgetCSS}</style>
  <div class="asw-overlay" role="presentation"></div>
  <div class="asw-menu" role="dialog" aria-modal="true" aria-label="Accessibility Settings">
    <div class="asw-menu-header">
      <div style="display:flex; align-items:center; min-width:0;">
        <div class="asw-menu-title asw-translate" data-translate="widget.menuTitle">Accessibility Settings</div>
        <span class="asw-kbd-badge" aria-hidden="true">Alt+A</span>
      </div>
      <div>
        <button type="button" class="asw-menu-lang-toggle" title="Switch Language" aria-label="Switch language">
          ${globeIcon}
          <span class="asw-lang-text">EN</span>
        </button>
        <button type="button" class="asw-menu-reset" title="Reset settings" data-translate="widget.resetTitle" aria-label="Reset all accessibility settings">
          ${iconSvg("reset")}
        </button>
        <button type="button" class="asw-menu-close" title="Close (Esc)" data-translate="widget.closeMenu" aria-label="Close accessibility settings">
          ${iconSvg("close")}
        </button>
      </div>
    </div>

    <div class="asw-menu-content">
      <!-- Profiles -->
      <div class="asw-card" data-section="profiles">
        <h3 class="asw-card-title asw-translate" data-translate="categories.profiles">Accessibility Profiles</h3>
        <div class="asw-items profiles">
          ${Object.values(PROFILES).map(profileBtnHtml).join("")}
        </div>
      </div>

      <!-- Language -->
      <div class="asw-card" data-section="language">
        <select id="asw-language" class="asw-select" title="Language" aria-label="Select language"></select>
      </div>

      <!-- Content Adjustments -->
      <div class="asw-card" data-section="content">
        <h3 class="asw-card-title asw-translate" data-translate="categories.content">Content Adjustments</h3>
        ${continuous.map(adjusterHtml).join("")}
        <div class="asw-items content">
          ${contentButtons.map((tool) => btnHtml(tool)).join("")}
        </div>
      </div>

      <!-- Color Adjustments -->
      ${card("categories.color", "color", colorTools, "asw-filter")}

      <!-- Text Alignment -->
      ${card("categories.textAlign", "textalign", alignTools, "asw-textalign")}

      <!-- Tools -->
      ${card("categories.tools", "tools", tools, "asw-tools")}

      <!-- Keyboard Shortcuts Reference -->
      <div class="asw-card" data-section="shortcuts">
        <h3 class="asw-card-title asw-translate" data-translate="shortcuts.title">Keyboard Shortcuts</h3>
        <div class="asw-shortcuts-card">
          <div class="asw-shortcut-row">
            <span class="asw-shortcut-label asw-translate" data-translate="shortcuts.toggle">Toggle Panel</span>
            <span><kbd>Alt</kbd> + <kbd>A</kbd></span>
          </div>
          <div class="asw-shortcut-row">
            <span class="asw-shortcut-label asw-translate" data-translate="shortcuts.reset">Reset Settings</span>
            <span><kbd>Alt</kbd> + <kbd>R</kbd></span>
          </div>
          <div class="asw-shortcut-row">
            <span class="asw-shortcut-label asw-translate" data-translate="shortcuts.close">Close Panel</span>
            <span><kbd>Esc</kbd></span>
          </div>
          <div class="asw-shortcut-row">
            <span class="asw-shortcut-label asw-translate" data-translate="shortcuts.navigate">Navigate Options</span>
            <span><kbd>Tab</kbd></span>
          </div>
        </div>
      </div>

      <!-- Reset -->
      <div class="asw-card">
        <button type="button" class="asw-menu-reset-footer-btn asw-translate" data-translate="widget.reset">
          Reset All Settings
        </button>
      </div>

      <!-- Hide floating button toggle -->
      <div class="asw-card asw-hide-btn-card">
        <label class="asw-hide-btn-label">
          <input type="checkbox" class="asw-hide-btn-checkbox" />
          <span class="asw-hide-btn-text asw-translate" data-translate="widget.hideButton">Hide floating button</span>
        </label>
      </div>
    </div>

    <!-- Optional footer (brand.footerText / brand.name) -->
    <div class="asw-footer" hidden></div>

    <!-- Info Modal -->
    <div class="asw-info-modal" role="dialog" aria-label="Tool description">
      <div class="asw-info-modal-content">
        <button type="button" class="asw-info-modal-x" aria-label="Close">&times;</button>
        <div class="asw-info-modal-icon"></div>
        <div class="asw-info-modal-title"></div>
        <p class="asw-info-modal-body"></p>
        <button type="button" class="asw-info-modal-close asw-translate" data-translate="widget.gotIt">Got it</button>
      </div>
    </div>
  </div>
  `;
}

const _HTMLElement = (
  typeof HTMLElement !== "undefined" ? HTMLElement : class {}
) as typeof HTMLElement;

export class AswMenu extends _HTMLElement {
  private _menu: HTMLElement | null = null;
  private _overlay: HTMLElement | null = null;
  private _closeBtn: HTMLElement | null = null;
  private _isOpen = false;
  private _values: Record<string, number> = {};
  private _features: IAccessibilityFeatures | null = null;
  private _labels: Record<string, string> = {};
  private _brand: IAccessibilityBrand | null = null;
  private _infoTrigger: HTMLElement | null = null;

  static get observedAttributes(): string[] {
    return ["lang", "open", "side", "no-blur"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const tpl = document.createElement("template");
    tpl.innerHTML = getMenuTemplate();
    this.shadowRoot!.appendChild(tpl.content.cloneNode(true));
  }

  connectedCallback(): void {
    this._menu = this.shadowRoot!.querySelector(".asw-menu");
    this._overlay = this.shadowRoot!.querySelector(".asw-overlay");
    this._closeBtn = this.shadowRoot!.querySelector(".asw-menu-close");

    this.shadowRoot!.querySelectorAll(".asw-menu-close, .asw-overlay").forEach((el) =>
      el.addEventListener("click", () => this._close()),
    );

    this.shadowRoot!.querySelectorAll(".asw-menu-reset, .asw-menu-reset-footer-btn").forEach((el) =>
      el.addEventListener("click", () => {
        this._close();
        this.dispatchEvent(new CustomEvent("asw:reset", { bubbles: true }));
      }),
    );

    this._applyShortcutLabels();

    this.shadowRoot!.querySelectorAll(".asw-plus, .asw-minus").forEach((el) =>
      el.addEventListener("click", (e) => this._onAdjusterClick(e)),
    );

    this.shadowRoot!.querySelectorAll(".asw-btn").forEach((el) => {
      el.addEventListener("click", (e) => this._onToolClick(e));
    });

    this.shadowRoot!.querySelectorAll(".asw-btn-info").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const target = e.currentTarget as HTMLElement;
        this._infoTrigger = target;
        this._showInfoModal(
          target.getAttribute("data-icon") || "",
          target.getAttribute("data-label") || "",
          target.getAttribute("data-desc") || "",
        );
      });
    });

    const modal = this.shadowRoot!.querySelector(".asw-info-modal");
    const modalClose = this.shadowRoot!.querySelector(".asw-info-modal-close");
    const modalX = this.shadowRoot!.querySelector(".asw-info-modal-x");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this._hideInfoModal();
      });
      modalClose?.addEventListener("click", () => this._hideInfoModal());
      modalX?.addEventListener("click", () => this._hideInfoModal());
    }

    this.addEventListener("keydown", (e: Event) => {
      if ((e as KeyboardEvent).key === "Escape" && this.isInfoModalOpen()) {
        e.stopPropagation();
        this._hideInfoModal();
      }
    });

    const langSelect = this.shadowRoot!.getElementById("asw-language");
    langSelect?.addEventListener("change", (e) => {
      this.dispatchEvent(
        new CustomEvent("asw:language", {
          bubbles: true,
          detail: { lang: (e.target as HTMLSelectElement).value },
        }),
      );
    });

    const langToggle = this.shadowRoot!.querySelector(".asw-menu-lang-toggle");
    langToggle?.addEventListener("click", () => {
      const currentLang = this.getAttribute("lang") ?? "en";
      const nextLang = currentLang === "en" ? "hi" : "en";
      this.dispatchEvent(
        new CustomEvent("asw:language", {
          bubbles: true,
          detail: { lang: nextLang },
        }),
      );
    });

    const hideBtnCheckbox = this.shadowRoot!.querySelector(
      ".asw-hide-btn-checkbox",
    ) as HTMLInputElement | null;
    if (hideBtnCheckbox) {
      hideBtnCheckbox.addEventListener("change", () => {
        if (hideBtnCheckbox.checked) {
          this.dispatchEvent(new CustomEvent("asw:hide-button", { bubbles: true }));
        } else {
          this.dispatchEvent(new CustomEvent("asw:show-button", { bubbles: true }));
        }
      });
    }

    this.translateUI();
    this._applyFeaturesVisibility();

    if (this.hasAttribute("open")) {
      this._open();
    }
  }

  /** Re-render every translated label and attribute for the current language. */
  translateUI(): void {
    const lang = this.getAttribute("lang") ?? "en";

    const langText = this.shadowRoot!.querySelector(".asw-lang-text");
    if (langText) {
      langText.textContent = lang === "en" ? "EN" : "हि";
    }

    this.shadowRoot!.querySelectorAll("[data-translate]").forEach((el) => {
      const key = el.getAttribute("data-translate");
      if (!key) return;
      const translated = this._labels[key] ?? t(key, lang);
      if (el.hasAttribute("title")) el.setAttribute("title", translated);
      if (el.hasAttribute("aria-label")) el.setAttribute("aria-label", translated);

      // Only replace text for leaf nodes. Elements with icon children use
      // data-translate for title/aria-label only; their label lives in a
      // separate child (e.g. .asw-btn-label), which is a leaf.
      if (el.children.length === 0) {
        el.textContent = translated;
      }
    });

    this._applyShortcutLabels();
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    if (name === "open") {
      if (value === "true") this._open();
      else this._close();
    } else if (name === "lang") {
      this.translateUI();
    }
  }

  /** Set features configuration dynamically to hide/show specific features */
  setFeatures(features: IAccessibilityFeatures): void {
    this._features = features;
    this._applyFeaturesVisibility();
  }

  /** Override UI strings by i18n key. */
  setLabels(labels: Record<string, string> = {}): void {
    this._labels = labels;
    this.translateUI();
  }

  /** Configure the optional footer branding. */
  setBrand(brand: IAccessibilityBrand = {}): void {
    this._brand = brand;
    this._renderFooter();
  }

  private _renderFooter(): void {
    const footer = this.shadowRoot?.querySelector(".asw-footer") as HTMLElement | null;
    if (!footer) return;

    const brand = this._brand ?? {};
    const text = brand.footerText ?? (brand.name ? `Accessibility by ${brand.name}` : "");

    footer.replaceChildren();
    footer.hidden = !text;
    if (!text) return;

    if (brand.url) {
      const link = document.createElement("a");
      link.href = brand.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = text;
      footer.appendChild(link);
    } else {
      const label = document.createElement("span");
      label.textContent = text;
      footer.appendChild(label);
    }
  }

  private _applyFeaturesVisibility(): void {
    if (!this._features) return;

    const tools = this._features.tools ?? {};
    const profiles = this._features.profiles ?? {};
    const languageChange = this._features.languageChange ?? true;
    const shortcutsEnabled = this._features.shortcuts !== false;

    // Individual tools (buttons and adjusters)
    for (const tool of TOOLS) {
      const visible = tools[tool.id] !== false;
      this.shadowRoot!.querySelectorAll(`[data-tool="${tool.id}"]`).forEach((el) => {
        (el as HTMLElement).style.display = visible ? "" : "none";
      });
    }

    // Profile buttons
    for (const profile of Object.values(PROFILES)) {
      const visible = profiles[profile.id] !== false;
      this.shadowRoot!.querySelectorAll(`[data-profile="${profile.id}"]`).forEach((el) => {
        (el as HTMLElement).style.display = visible ? "" : "none";
      });
    }

    // Cards derive their visibility from the manifest.
    const sectionToolIds: Record<string, string[]> = {
      content: toolsByCategory("content").map((tool) => tool.id),
      color: toolsByCategory("color").map((tool) => tool.id),
      textalign: toolsByCategory("text-align").map((tool) => tool.id),
      tools: toolsByCategory("tools").map((tool) => tool.id),
    };
    for (const [section, ids] of Object.entries(sectionToolIds)) {
      const cardEl = this.shadowRoot!.querySelector(
        `[data-section="${section}"]`,
      ) as HTMLElement | null;
      if (cardEl) {
        cardEl.style.display = ids.some((id) => tools[id] !== false) ? "" : "none";
      }
    }

    const profilesCard = this.shadowRoot!.querySelector(
      '[data-section="profiles"]',
    ) as HTMLElement | null;
    if (profilesCard) {
      profilesCard.style.display = Object.keys(PROFILES).some((id) => profiles[id] !== false)
        ? ""
        : "none";
    }

    const shortcutsCard = this.shadowRoot!.querySelector(
      '[data-section="shortcuts"]',
    ) as HTMLElement | null;
    if (shortcutsCard) {
      shortcutsCard.style.display = shortcutsEnabled ? "" : "none";
    }

    const langSelectCard = this.shadowRoot!.getElementById("asw-language")?.closest(".asw-card");
    if (langSelectCard) {
      (langSelectCard as HTMLElement).style.display = languageChange ? "" : "none";
    }
    const langToggle = this.shadowRoot!.querySelector(".asw-menu-lang-toggle");
    if (langToggle) {
      (langToggle as HTMLElement).style.display = languageChange ? "" : "none";
    }

    const hideBtnCard = this.shadowRoot!.querySelector(".asw-hide-btn-card") as HTMLElement | null;
    if (hideBtnCard) {
      hideBtnCard.style.display = this._features.hideButtonToggle !== false ? "" : "none";
    }
  }

  /** Set the language of the widget */
  setLang(lang: string): void {
    const select = this.shadowRoot!.getElementById("asw-language") as HTMLSelectElement;
    if (select && select.value !== lang) {
      select.value = lang;
    }
  }

  /** Populate language options */
  setLanguageOptions(options: { code: string; label: string }[]): void {
    const select = this.shadowRoot!.getElementById("asw-language") as HTMLSelectElement;
    if (!select) return;
    select.innerHTML = options
      .map((opt) => `<option value="${opt.code}">${opt.label}</option>`)
      .join("");
    const lang = this.getAttribute("lang") ?? "en";
    select.value = lang;
  }

  /** Sync the hide-button checkbox state (checked = button is hidden) */
  setHideButtonChecked(checked: boolean): void {
    const checkbox = this.shadowRoot?.querySelector(
      ".asw-hide-btn-checkbox",
    ) as HTMLInputElement | null;
    if (checkbox) {
      checkbox.checked = checked;
    }
  }

  /** Update control states from engine settings. */
  syncTools(states: Record<string, unknown>): void {
    if (!this._menu) return;

    for (const tool of CONTINUOUS_TOOLS) {
      const value = Number(states?.[tool.stateKey]);
      const resolved = Number.isFinite(value) ? value : tool.defaultValue;
      this._values[tool.id] = resolved;
      const amount = this.shadowRoot!.getElementById(`asw-${tool.id}-amount`);
      if (amount) amount.textContent = tool.format(resolved);
    }

    this.shadowRoot!.querySelectorAll(".asw-btn").forEach((btn) => {
      const key = (btn as HTMLElement).dataset.key;
      if (!key) return;

      const tool = getTool(key);
      const isProfile = btn.classList.contains("asw-profile");

      let selected: boolean;
      if (isProfile) {
        selected = states?.activeProfile === key;
      } else if (isExclusiveTool(tool)) {
        selected = states?.[tool.group.stateKey] === key;
      } else {
        selected = !!states?.[key];
      }

      btn.classList.toggle("asw-selected", selected);
      btn.setAttribute("aria-pressed", String(selected));
    });
  }

  /** Check if sidebar is currently open */
  get isOpen(): boolean {
    return this._isOpen;
  }

  /** Check if the nested tool-description modal is open */
  isInfoModalOpen(): boolean {
    const modal = this.shadowRoot!.querySelector(".asw-info-modal");
    return !!modal?.classList.contains("asw-info-modal--open");
  }

  /** Get the close button reference for focus management */
  getCloseButton(): HTMLElement | null {
    return this._closeBtn;
  }

  /** Get all visible focusable elements within the sidebar */
  getFocusableElements(): HTMLElement[] {
    const selectors = 'button, [href], select, [tabindex]:not([tabindex="-1"]), [role="button"]';
    const elements = this.shadowRoot!.querySelectorAll(selectors);
    return (Array.from(elements) as HTMLElement[]).filter((el) => {
      if (el.hasAttribute("disabled") || el.getAttribute("aria-hidden") === "true") return false;
      if (el.closest(".asw-info-modal") && !this.isInfoModalOpen()) return false;
      return el.getClientRects().length > 0;
    });
  }

  private _open(): void {
    if (this._isOpen) return;
    this._isOpen = true;

    if (this._overlay) {
      this._overlay.style.display = "block";
      void this._overlay.offsetHeight;
      this._overlay.classList.add("asw-visible");
    }

    this._menu?.classList.add("asw-open");
    this.dispatchEvent(new CustomEvent("asw:opened", { bubbles: true }));
  }

  private _close(): void {
    if (!this._isOpen) return;
    this._isOpen = false;
    this._hideInfoModal();

    if (this._overlay) {
      this._overlay.classList.remove("asw-visible");
      setTimeout(() => {
        if (!this._isOpen && this._overlay) {
          this._overlay.style.display = "none";
        }
      }, 350);
    }

    this._menu?.classList.remove("asw-open");
    this.dispatchEvent(new CustomEvent("asw:closed", { bubbles: true }));
  }

  private _onAdjusterClick(e: Event): void {
    const el = e.currentTarget as HTMLElement;
    const key = el.getAttribute("data-key");
    const tool = getTool(key ?? "");
    if (!isContinuousTool(tool)) return;

    const isMinus = el.classList.contains("asw-minus");
    const current = this._values[tool.id] ?? tool.defaultValue;
    let next = current + (isMinus ? -tool.step : tool.step);
    next = Math.max(tool.min, Math.min(tool.max, next));
    const decimals = String(tool.step).split(".")[1]?.length ?? 0;
    next = Number(next.toFixed(decimals));

    this._values[tool.id] = next;
    const amount = this.shadowRoot!.getElementById(`asw-${tool.id}-amount`);
    if (amount) amount.textContent = tool.format(next);

    this.dispatchEvent(
      new CustomEvent("asw:continuous", {
        bubbles: true,
        detail: { toolId: tool.id, value: next },
      }),
    );
  }

  private _onToolClick(e: Event): void {
    const el = e.currentTarget as HTMLElement;
    const key = el.dataset.key;
    if (!key) return;

    const tool = getTool(key);
    const isProfile = el.classList.contains("asw-profile");

    if (isProfile) {
      const wasSelected = el.classList.contains("asw-selected");
      this.shadowRoot!.querySelectorAll(".asw-profile").forEach((btn) => {
        btn.classList.remove("asw-selected");
        btn.setAttribute("aria-pressed", "false");
      });

      if (wasSelected) {
        this.dispatchEvent(
          new CustomEvent("asw:profile-deactivate", {
            bubbles: true,
            detail: { profileId: key },
          }),
        );
      } else {
        el.classList.add("asw-selected");
        el.setAttribute("aria-pressed", "true");
        this.dispatchEvent(
          new CustomEvent("asw:profile", {
            bubbles: true,
            detail: { profileId: key },
          }),
        );
      }
      return;
    }

    if (isExclusiveTool(tool)) {
      const wasSelected = el.classList.contains("asw-selected");
      this.shadowRoot!.querySelectorAll(`.asw-btn[data-group="${tool.group.id}"]`).forEach(
        (btn) => {
          btn.classList.remove("asw-selected");
          btn.setAttribute("aria-pressed", "false");
        },
      );

      if (!wasSelected) {
        el.classList.add("asw-selected");
        el.setAttribute("aria-pressed", "true");
      }

      const eventName = tool.group.id === "contrast" ? "asw:contrast" : "asw:textalign";
      this.dispatchEvent(
        new CustomEvent(eventName, {
          bubbles: true,
          detail: { key, enabled: !wasSelected },
        }),
      );
      return;
    }

    el.classList.toggle("asw-selected");
    const isSelected = el.classList.contains("asw-selected");
    el.setAttribute("aria-pressed", String(isSelected));
    this.dispatchEvent(
      new CustomEvent("asw:toggle", {
        bubbles: true,
        detail: { toolId: key, enabled: isSelected },
      }),
    );
  }

  /** Show the info description modal */
  private _showInfoModal(iconId: string, label: string, desc: string): void {
    const modal = this.shadowRoot!.querySelector(".asw-info-modal") as HTMLElement;
    const iconEl = this.shadowRoot!.querySelector(".asw-info-modal-icon") as HTMLElement;
    const titleEl = this.shadowRoot!.querySelector(".asw-info-modal-title") as HTMLElement;
    const bodyEl = this.shadowRoot!.querySelector(".asw-info-modal-body") as HTMLElement;
    if (modal && titleEl && bodyEl && iconEl) {
      iconEl.innerHTML = iconId ? iconSvg(iconId) : "";
      titleEl.textContent = label;
      bodyEl.textContent = desc;
      modal.setAttribute("aria-label", label);
      modal.classList.add("asw-info-modal--open");
      const closeBtn = this.shadowRoot!.querySelector(
        ".asw-info-modal-close",
      ) as HTMLElement | null;
      closeBtn?.focus();
    }
  }

  /** Hide the info description modal */
  private _hideInfoModal(): void {
    const modal = this.shadowRoot!.querySelector(".asw-info-modal") as HTMLElement;
    if (modal) {
      modal.classList.remove("asw-info-modal--open");
    }
    this._infoTrigger?.focus();
    this._infoTrigger = null;
  }

  /** Swap shortcut labels to the platform modifier. */
  private _applyShortcutLabels(): void {
    const isMac =
      typeof navigator !== "undefined" &&
      /Mac|iPod|iPad|iPhone/.test(navigator.platform || navigator.userAgent);
    if (!isMac) return;
    const badge = this.shadowRoot!.querySelector(".asw-kbd-badge");
    if (badge) badge.textContent = "Opt+A";

    this.shadowRoot!.querySelectorAll(".asw-shortcuts-card kbd").forEach((kbd) => {
      if (kbd.textContent === "Alt") kbd.textContent = "Option";
    });
  }
}

if (typeof customElements !== "undefined" && !customElements.get("asw-menu")) {
  customElements.define("asw-menu", AswMenu);
}
