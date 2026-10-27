/**
 * UI → Engine wire-up utility.
 *
 * Creates an <asw-widget> and <asw-menu>, attaches them to the DOM,
 * and connects all events to an AccessibilityEngine instance.
 *
 * Also installs keyboard shortcuts:
 *   Alt+A — toggle sidebar open/close
 *   Escape — close sidebar (when open)
 *
 * Focus management:
 *   - On open: focus moves to the close button
 *   - Tab is trapped within the sidebar while open
 *   - On close: focus returns to the floating button
 *
 * @example
 *   import { createAccessibilityUI } from '@/features/accessibility/ui'
 *   import { AccessibilityEngine } from '@/features/accessibility/engine'
 *
 *   const engine = new AccessibilityEngine({ storage: localStorageAdapter })
 *   await engine.init()
 *   createAccessibilityUI(engine, { position: 'bottom-left' })
 */
import { AccessibilityEngine } from "../engine/AccessibilityEngine";
import { initTranslations } from "../i18n/translator";
import { LANGUAGES } from "../i18n/languages";
import { getTool, isContinuousTool } from "../tools/manifest";
import { mergeConfig, IAccessibilityConfig } from "../config/accessibility.config";
import { clearActiveAccessibilityUI, setActiveAccessibilityUI } from "./lifecycle";
import "./components/asw-widget"; // Register component
import "./components/asw-menu"; // Register component
import type { AswWidget } from "./components/asw-widget";
import type { AswMenu } from "./components/asw-menu";

export interface UIOptions {
  /** Widget button position (default: 'bottom-right') */
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  /** Horizontal offset in px (default: 20) */
  offsetX?: number;
  /** Vertical offset in px (default: 20) */
  offsetY?: number;
  /** Panel slide direction: 'right' (default) or 'left' */
  side?: "right" | "left";
  /** Whether to show backdrop blur when panel is open (default: true) */
  blur?: boolean;
  /** Container element to mount into (default: document.body) */
  container?: HTMLElement;
  /** Accessibility configuration options */
  config?: IAccessibilityConfig;
}

/**
 * Create and mount the accessibility widget UI, wiring it to an engine instance.
 * Installs keyboard shortcuts and focus management.
 */
export const ASW_HIDE_BUTTON_KEY = "asw-hide-button";

function hexToRgb(hex: string): string | null {
  const normalized = hex.trim().replace("#", "");
  if (!/^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(normalized)) return null;
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;
  return `${parseInt(full.slice(0, 2), 16)}, ${parseInt(full.slice(2, 4), 16)}, ${parseInt(full.slice(4, 6), 16)}`;
}

function applyBrandTokens(
  el: HTMLElement,
  brand: { primary?: string; primaryDark?: string; accent?: string },
): void {
  if (brand.primary) {
    el.style.setProperty("--asw-brand-primary", brand.primary);
    const rgb = hexToRgb(brand.primary);
    if (rgb) el.style.setProperty("--asw-brand-primary-rgb", rgb);
  }
  if (brand.primaryDark) el.style.setProperty("--asw-brand-primary-dark", brand.primaryDark);
  if (brand.accent) {
    el.style.setProperty("--asw-brand-accent", brand.accent);
    const rgb = hexToRgb(brand.accent);
    if (rgb) el.style.setProperty("--asw-brand-accent-rgb", rgb);
  }
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

export function createAccessibilityUI(
  engine: AccessibilityEngine,
  options: UIOptions = {},
): { widget: HTMLElement; menu: HTMLElement; destroy: () => void } {
  const merged = mergeConfig(options.config, engine.config);
  const container = options.container ?? document.body;

  // ── Master switch: if disabled, return no-op ──
  if (!merged.enabled) {
    return {
      widget: document.createElement("div") as unknown as HTMLElement,
      menu: document.createElement("div") as unknown as HTMLElement,
      destroy: () => {},
    };
  }

  // Direct options take precedence over config values
  const side = options.side ?? merged.side;
  const blur = options.blur ?? merged.blur;
  const position =
    options.position ?? merged.position ?? (side === "left" ? "bottom-left" : "bottom-right");
  const offsetX = options.offsetX ?? merged.offset?.[0] ?? 20;
  const offsetY = options.offsetY ?? merged.offset?.[1] ?? 20;

  // ── Create widget button ──
  const widget = document.createElement("asw-widget") as AswWidget;
  widget.setAttribute("position", position);
  widget.setAttribute("offset-x", String(offsetX));
  widget.setAttribute("offset-y", String(offsetY));

  // Apply desktop and mobile button sizes in CSS pixels.
  widget.setAttribute("button-size", String(merged.buttonSize));
  widget.setAttribute("button-size-mobile", String(merged.buttonSizeMobile));

  // Apply show/hide preference — user's persisted choice overrides config
  const userHidePref =
    typeof localStorage !== "undefined" ? localStorage.getItem(ASW_HIDE_BUTTON_KEY) : null;
  const showInitial = userHidePref === null ? merged.showButton : userHidePref !== "true";
  widget.setAttribute("show-button", showInitial ? "true" : "false");

  // ── Create menu ──
  const menu = document.createElement("asw-menu") as AswMenu;
  menu.setAttribute("lang", engine.settings.lang ?? merged.lang ?? "en");
  menu.setAttribute("side", side);
  // Set no-blur attribute when blur is disabled
  if (!blur) {
    menu.setAttribute("no-blur", "");
  }
  menu.style.display = ""; // Hidden by default via internal CSS

  applyBrandTokens(widget, merged.brand);
  applyBrandTokens(menu, merged.brand);

  // Pass configuration features to customize widget panel layout
  menu.setFeatures(merged.features);
  menu.setLabels(merged.labels);
  menu.setBrand(merged.brand);

  // Populate language options
  menu.setLanguageOptions(LANGUAGES.map((l) => ({ code: l.code, label: l.label })));

  // Bundled translations resolve synchronously; refresh the template once ready.
  void initTranslations(menu.getAttribute("lang") ?? "en").then(() => menu.translateUI());

  // ── Scroll lock state ──
  let savedOverflow = "";
  let isLocked = false;

  function lockScroll(): void {
    if (isLocked) return;
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    isLocked = true;
  }

  function unlockScroll(): void {
    if (!isLocked) return;
    document.body.style.overflow = savedOverflow;
    isLocked = false;
  }

  // ── Focus trap utility ──
  function trapFocus(e: KeyboardEvent): void {
    if (e.key !== "Tab" || !menu.isOpen) return;

    const focusable = menu.getFocusableElements();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // Get the active element inside shadow root
    const activeEl = menu.shadowRoot?.activeElement as HTMLElement | null;

    if (e.shiftKey) {
      // Shift+Tab: if at first element, wrap to last
      if (activeEl === first || !activeEl) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab: if at last element, wrap to first
      if (activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // ── Open/close helpers ──
  let opening = false;
  let closing = false;

  function openSidebar(): void {
    if (opening) return;
    opening = true;

    if (!menu.isOpen) menu.setAttribute("open", "true");
    widget.setExpanded(true);
    // The panel owns the bottom-right corner while open; leaving the floating
    // button visible overlaps the last tool row.
    widget.style.visibility = "hidden";
    lockScroll();

    // Sync tools when opening
    menu.syncTools(engine.settings.states ?? {});

    // Focus the close button after animation starts
    requestAnimationFrame(() => {
      const closeBtn = menu.getCloseButton();
      closeBtn?.focus();
    });
    opening = false;
  }

  function closeSidebar(): void {
    if (closing) return;
    closing = true;

    if (menu.isOpen) menu.removeAttribute("open");
    widget.setExpanded(false);
    widget.style.visibility = "";
    unlockScroll();

    // Return focus to the widget button (if visible) or blur active element
    requestAnimationFrame(() => {
      if (widget.buttonVisible) {
        const btn = widget.shadowRoot?.querySelector("button") as HTMLElement | null;
        btn?.focus();
      } else {
        // Button is hidden — don't try to focus it.
        // Blur the active element to avoid focus-jarring behavior.
        (document.activeElement as HTMLElement)?.blur();
      }
    });
    closing = false;
  }

  function toggleSidebar(): void {
    if (menu.isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  // ── Wire up events ──

  // Helper to trigger actions hook
  function triggerActionHook(
    action: Parameters<
      NonNullable<NonNullable<IAccessibilityConfig["hooks"]>["onAction"]>
    >[0]["action"],
    id?: string,
    value?: unknown,
  ): void {
    if (merged.hooks?.onAction) {
      merged.hooks.onAction({
        action,
        id,
        value,
        states: engine.settings.states ?? {},
      });
    }
  }

  // Open menu when widget button is clicked
  widget.addEventListener("asw:open", () => {
    toggleSidebar();
  });

  // The menu owns open state; these events drive the surrounding page effects.
  menu.addEventListener("asw:opened", () => {
    openSidebar();
  });
  menu.addEventListener("asw:closed", () => {
    closeSidebar();
  });

  // Toggle tool
  menu.addEventListener("asw:toggle", (e: Event) => {
    const detail = (e as CustomEvent).detail;
    engine.toggleTool(detail.toolId, detail.enabled);
    triggerActionHook("toggle-tool", detail.toolId, detail.enabled);
  });

  // Contrast (exclusive)
  menu.addEventListener("asw:contrast", (e: Event) => {
    const detail = (e as CustomEvent).detail;
    engine.toggleTool(detail.key, detail.enabled);
    triggerActionHook("apply-contrast", detail.key, detail.enabled);
  });

  // Text Alignment (exclusive)
  menu.addEventListener("asw:textalign", (e: Event) => {
    const detail = (e as CustomEvent).detail;
    engine.toggleTool(detail.key, detail.enabled);
    triggerActionHook("apply-text-align", detail.key, detail.enabled);
  });

  // Profile
  menu.addEventListener("asw:profile", (e: Event) => {
    const detail = (e as CustomEvent).detail;
    engine.applyProfile(detail.profileId);
    // Sync all tool states after profile application
    menu.syncTools(engine.settings.states ?? {});
    triggerActionHook("apply-profile", detail.profileId, true);
  });

  // Profile Deactivate
  menu.addEventListener("asw:profile-deactivate", (e: Event) => {
    const detail = (e as CustomEvent).detail;
    engine.deactivateProfile(detail.profileId);
    // Sync all tool states after profile deactivation
    menu.syncTools(engine.settings.states ?? {});
    triggerActionHook("deactivate-profile", detail.profileId, false);
  });

  // Continuous tools share one manifest-driven event.
  menu.addEventListener("asw:continuous", (e: Event) => {
    const detail = (e as CustomEvent).detail;
    const tool = getTool(detail.toolId);
    engine.setContinuousTool(detail.toolId, detail.value);
    if (isContinuousTool(tool)) {
      const action =
        tool.stateKey === "fontSize"
          ? "adjust-font-size"
          : tool.stateKey === "lineHeight"
            ? "adjust-line-height"
            : "adjust-letter-spacing";
      triggerActionHook(action, tool.stateKey, detail.value);
    }
  });

  // Language change
  menu.addEventListener("asw:language", (e: Event) => {
    const detail = (e as CustomEvent).detail;
    void engine.setLanguage(detail.lang);
    triggerActionHook("change-language", "lang", detail.lang);
  });

  // Reset
  menu.addEventListener("asw:reset", () => {
    engine.reset();
    triggerActionHook("reset");
  });

  // Subscribe to engine state changes → update UI
  let lastLang = engine.settings.lang ?? "en";
  const unsub = engine.subscribe((settings) => {
    menu.syncTools(settings.states ?? {});
    const newLang = settings.lang ?? "en";
    if (newLang !== lastLang) {
      lastLang = newLang;
      menu.setAttribute("lang", newLang);
      menu.setLang(newLang);
      void initTranslations(newLang).then(() => menu.translateUI());
    }
  });

  // ── Keyboard shortcuts ──

  function onKeyDown(e: KeyboardEvent): void {
    // Never steal shortcuts while the user is typing or editing.
    if (isEditableTarget(e.target)) return;

    // Option+A (Mac) or Alt+A (Windows/Linux)
    if (e.altKey && e.code === "KeyA") {
      e.preventDefault();
      e.stopPropagation();
      toggleSidebar();
      return;
    }

    // Option+R (Mac) or Alt+R (Windows/Linux) — Reset Settings
    if (e.altKey && e.code === "KeyR") {
      e.preventDefault();
      e.stopPropagation();
      engine.reset();
      triggerActionHook("reset");
      closeSidebar();
      return;
    }

    // Escape — close sidebar (only when open). Let the menu close its
    // nested info modal first.
    if (e.key === "Escape" && menu.isOpen) {
      if (menu.isInfoModalOpen()) return;
      e.preventDefault();
      closeSidebar();
      return;
    }

    // Tab — trap focus within sidebar when open
    if (e.key === "Tab" && menu.isOpen) {
      trapFocus(e);
    }
  }

  document.addEventListener("keydown", onKeyDown, true);

  // ── External triggers ──
  // Elements with data-asw-toggle attribute toggle the sidebar on click
  function onExternalTriggerClick(e: Event): void {
    e.preventDefault();
    toggleSidebar();
  }

  const wiredTriggers = new WeakSet<Element>();
  const externalTriggerCleanups: (() => void)[] = [];

  function wireTrigger(el: Element): void {
    if (wiredTriggers.has(el)) return;
    wiredTriggers.add(el);
    el.addEventListener("click", onExternalTriggerClick);
    externalTriggerCleanups.push(() => el.removeEventListener("click", onExternalTriggerClick));
  }

  function scanTriggers(): void {
    document.querySelectorAll("[data-asw-toggle]").forEach(wireTrigger);
    if (merged.triggerSelector) {
      document.querySelectorAll(merged.triggerSelector).forEach(wireTrigger);
    }
  }

  scanTriggers();

  // 3. Custom DOM event — any code can dispatch asw:toggle-accessibility on document
  const onCustomToggle = () => toggleSidebar();
  document.addEventListener("asw:toggle-accessibility", onCustomToggle);
  externalTriggerCleanups.push(() =>
    document.removeEventListener("asw:toggle-accessibility", onCustomToggle),
  );

  // One observer for both trigger sources. ponytail: rescans the document on any
  // mutation; scope to added nodes if this ever shows up in profiles.
  const triggerObserver = new MutationObserver(scanTriggers);
  triggerObserver.observe(document.body, { childList: true, subtree: true });

  // ── Hide-button toggle from menu ──
  menu.addEventListener("asw:hide-button", () => {
    widget.hideButton();
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(ASW_HIDE_BUTTON_KEY, "true");
    }
  });
  menu.addEventListener("asw:show-button", () => {
    widget.showButton();
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(ASW_HIDE_BUTTON_KEY);
    }
  });

  // ── Expose toggleSidebar globally for programmatic access ──
  const win = window as unknown as Record<string, unknown>;
  win.__aswToggle = toggleSidebar;
  win.__aswOpen = openSidebar;
  win.__aswClose = closeSidebar;

  // ── Mount ──
  container.appendChild(widget);
  container.appendChild(menu);

  // ── Initial UI sync ──
  menu.syncTools(engine.settings.states ?? {});
  menu.setHideButtonChecked(!widget.buttonVisible);

  const controller = {
    widget,
    menu,
    destroy: () => {
      unsub();
      document.removeEventListener("keydown", onKeyDown, true);
      externalTriggerCleanups.forEach((fn) => fn());
      triggerObserver.disconnect();
      unlockScroll();
      widget.remove();
      menu.remove();
      if (win.__aswToggle === toggleSidebar) delete win.__aswToggle;
      if (win.__aswOpen === openSidebar) delete win.__aswOpen;
      if (win.__aswClose === closeSidebar) delete win.__aswClose;
      clearActiveAccessibilityUI(controller);
    },
  };

  setActiveAccessibilityUI(controller);

  return { widget, menu, destroy: controller.destroy };
}
