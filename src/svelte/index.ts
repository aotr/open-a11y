/**
 * open-a11y/svelte — Svelte 5 adapter.
 *
 * Exports a readable store plus actions. The store is intentionally not a
 * compiled Svelte component: the widget UI itself is already a web component.
 */
import { readable, type Readable } from "svelte/store";
import { AccessibilityEngine } from "../engine/AccessibilityEngine";
import type { ISettings } from "../types/ISettings";
import type { UIOptions } from "../ui/wire-up";
import { createAccessibilityUI } from "../ui/wire-up";
import { destroyActiveAccessibilityUI, type AccessibilityUIController } from "../ui/lifecycle";

export interface AccessibilityStore extends Readable<Readonly<ISettings>> {
  readonly engine: AccessibilityEngine;
  toggleTool: (toolId: string, enabled?: boolean | number) => void;
  setFontScale: (scale: number) => void;
  setLineHeight: (height: number) => void;
  setLetterSpacing: (spacing: number) => void;
  applyProfile: (profileId: string) => void;
  deactivateProfile: (profileId: string) => void;
  setLanguage: (lang: string) => void;
  reset: () => void;
  isToolEnabled: (toolId: string) => boolean;
  getToolValue: (toolId: string) => unknown;
  showWidget: (options?: UIOptions) => AccessibilityUIController;
  hideWidget: () => void;
}

/** Create a readable Svelte store backed by an existing engine. */
export function createAccessibilityStore(engine: AccessibilityEngine): AccessibilityStore {
  const store = readable<Readonly<ISettings>>(engine.settings, (set) => {
    set(engine.settings);
    return engine.subscribe((next) => set(next));
  });

  return {
    ...store,
    engine,
    toggleTool: (toolId, enabled) => engine.toggleTool(toolId, enabled),
    setFontScale: (scale) => engine.setFontScale(scale),
    setLineHeight: (height) => engine.setLineHeight(height),
    setLetterSpacing: (spacing) => engine.setLetterSpacing(spacing),
    applyProfile: (profileId) => engine.applyProfile(profileId),
    deactivateProfile: (profileId) => engine.deactivateProfile(profileId),
    setLanguage: (lang) => {
      void engine.setLanguage(lang);
    },
    reset: () => engine.reset(),
    isToolEnabled: (toolId) => engine.isToolEnabled(toolId),
    getToolValue: (toolId) => engine.getToolValue(toolId),
    showWidget: (options) => createAccessibilityUI(engine, options),
    hideWidget: () => destroyActiveAccessibilityUI(),
  };
}

export interface AccessibilityWidgetActionOptions extends UIOptions {
  engine: AccessibilityEngine;
}

/**
 * Svelte action:
 *
 *   <div use:accessibilityWidget={{ engine }} />
 */
export function accessibilityWidget(node: HTMLElement, options: AccessibilityWidgetActionOptions) {
  let controller: AccessibilityUIController | null = null;

  const mount = (next: AccessibilityWidgetActionOptions) => {
    controller?.destroy();
    const { engine, ...uiOptions } = next;
    controller = createAccessibilityUI(engine, { ...uiOptions, container: node });
  };

  mount(options);

  return {
    update(next: AccessibilityWidgetActionOptions) {
      mount(next);
    },
    destroy() {
      controller?.destroy();
      controller = null;
    },
  };
}

/** Re-export the core API for single-import convenience. */
export { AccessibilityEngine } from "../engine/AccessibilityEngine";
export type { AccessibilityEngineOptions } from "../engine/AccessibilityEngine";
export { localStorageAdapter, createMemoryAdapter } from "../storage";
