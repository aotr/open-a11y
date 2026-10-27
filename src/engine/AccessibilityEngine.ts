/**
 * AccessibilityEngine — Main orchestrator for the accessibility widget.
 *
 * All tool semantics come from the tool manifest. The engine owns:
 * 1. State hydration and persistence
 * 2. Applying tool states to the page
 * 3. Exclusive groups (contrast, text alignment)
 * 4. Continuous values (font size, line height, letter spacing)
 * 5. Profiles as complete presets
 */
import { StateManager } from "../state/StateManager";
import type { IStorageAdapter } from "../storage/types";
import type { ISettings } from "../types/ISettings";
import type { IProfile } from "../types/IProfile";
import {
  BOOLEAN_TOOLS,
  CONTINUOUS_TOOLS,
  EXCLUSIVE_GROUPS,
  getTool,
  isContinuousTool,
  isExclusiveTool,
  normalizeStates,
  type ContinuousTool,
  type ExclusiveGroup,
} from "../tools/manifest";
import { removeAllStylesheets } from "../css/cssInjector";
import { initTranslations } from "../i18n/translator";
import { mergeConfig, type IAccessibilityConfig } from "../config/accessibility.config";
import { PROFILES } from "../profiles";

/** Configuration passed to the engine on initialization */
export interface AccessibilityEngineOptions {
  /** Storage adapter for preference persistence */
  storage: IStorageAdapter;
  /** Initial language code (default: 'en') */
  lang?: string;
  /** Widget button position */
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  /** Widget button offset from edge [x, y] in px */
  offset?: [number, number];
  /** Pre-loaded settings for SSR hydration */
  initialSettings?: Partial<ISettings>;
  /** Detailed accessibility widget configuration options */
  config?: IAccessibilityConfig;
  /** Called when the storage adapter rejects an asynchronous write */
  onPersistenceError?: (error: unknown) => void;
}

export class AccessibilityEngine {
  private stateManager: StateManager;
  private options: AccessibilityEngineOptions;
  private resolvedConfig: Required<IAccessibilityConfig>;
  private initialized = false;

  constructor(options: AccessibilityEngineOptions) {
    const config = mergeConfig(options.config);
    if (options.lang) {
      config.lang = options.lang;
      config.defaultLanguage = options.lang;
    }
    if (options.position) config.position = options.position;
    if (options.offset) config.offset = options.offset;

    this.resolvedConfig = config;
    this.options = {
      ...options,
      lang: config.lang,
      position: config.position,
      offset: config.offset,
      config,
    };

    this.stateManager = new StateManager(
      options.storage,
      {
        lang: config.lang,
        ...options.initialSettings,
      },
      { onPersistenceError: options.onPersistenceError },
    );
  }

  /**
   * Initialize the engine: load translations, hydrate saved settings,
   * and apply all active tools.
   */
  async init(): Promise<void> {
    if (this.initialized) return;

    const initialLang = this.stateManager.getState().lang ?? this.options.lang ?? "en";
    await initTranslations(initialLang);

    await this.stateManager.hydrate();

    const hydratedLang = this.stateManager.getState().lang ?? initialLang;
    if (hydratedLang !== initialLang) {
      await initTranslations(hydratedLang);
    }

    this.runAllTools();
    this.initialized = true;
  }

  // ─── Public API ──────────────────────────────────────────

  /** Get current settings snapshot */
  get settings(): Readonly<ISettings> {
    return this.stateManager.getState();
  }

  /** The resolved widget configuration owned by the engine. */
  get config(): Readonly<Required<IAccessibilityConfig>> {
    return this.resolvedConfig;
  }

  /** Subscribe to state changes */
  subscribe(listener: (settings: ISettings) => void): () => void {
    return this.stateManager.subscribe(listener);
  }

  /**
   * Toggle or set a tool.
   *
   * Boolean tools flip. Exclusive tools select themselves within their group.
   * Continuous tools accept a numeric value or reset to their default.
   */
  toggleTool(toolId: string, value?: boolean | number): void {
    const tool = getTool(toolId);
    const states = this.stateManager.getState().states ?? {};

    if (!tool) {
      const current = states[toolId];
      this.stateManager.setMany({ [toolId]: value ?? !current, activeProfile: null });
      return;
    }

    if (isContinuousTool(tool)) {
      this.setContinuous(tool, typeof value === "number" ? value : tool.defaultValue);
      return;
    }

    if (isExclusiveTool(tool)) {
      const current = states[tool.group.stateKey] === tool.id;
      const enable = typeof value === "boolean" ? value : !current;
      this.setExclusive(tool.group, enable ? tool.id : false);
      return;
    }

    const current = !!states[tool.id];
    const enable = typeof value === "boolean" ? value : !current;
    this.stateManager.setMany({ [tool.id]: enable, activeProfile: null });
    tool.executor(enable);
  }

  /** Set a continuous tool by ID using its manifest range and formatter. */
  setContinuousTool(toolId: string, value: number): void {
    const tool = getTool(toolId);
    if (!isContinuousTool(tool)) return;
    this.setContinuous(tool, value);
  }

  /** Whether a tool is currently active, using canonical group keys. */
  isToolEnabled(toolId: string): boolean {
    const tool = getTool(toolId);
    const states = this.stateManager.getState().states ?? {};
    if (!tool) return !!states[toolId];
    if (isExclusiveTool(tool)) return states[tool.group.stateKey] === tool.id;
    if (isContinuousTool(tool)) return Number(states[tool.stateKey]) !== tool.defaultValue;
    return !!states[tool.id];
  }

  /** Read a tool's canonical state value. */
  getToolValue(toolId: string): unknown {
    const tool = getTool(toolId);
    const states = this.stateManager.getState().states ?? {};
    if (!tool) return states[toolId];
    if (isExclusiveTool(tool)) return states[tool.group.stateKey];
    if (isContinuousTool(tool)) return states[tool.stateKey];
    return states[tool.id];
  }

  /** Set font scale (0.1–2.0) */
  setFontScale(scale: number): void {
    this.setContinuousTool("font-size", scale);
  }

  /** Change line height spacing */
  setLineHeight(height: number): void {
    this.setContinuousTool("line-height", height);
  }

  /** Change letter spacing */
  setLetterSpacing(spacing: number): void {
    this.setContinuousTool("letter-spacing", spacing);
  }

  /** Apply a named profile as a complete preset */
  applyProfile(profileId: string): void {
    const profile: IProfile | undefined = PROFILES[profileId];
    if (!profile) return;

    this.stateManager.setMany({
      ...this.defaultStates(),
      ...normalizeStates(profile.states),
      activeProfile: profileId,
    });
    this.runAllTools();
  }

  /** Deactivate the active profile and return every tool to its default */
  deactivateProfile(profileId: string): void {
    if (!PROFILES[profileId]) return;
    if (this.stateManager.getState().states?.activeProfile !== profileId) return;
    this.clearTools();
  }

  /** Change display language */
  async setLanguage(lang: string): Promise<void> {
    await initTranslations(lang);
    this.stateManager.setLanguage(lang);
  }

  /** Reset everything to defaults with one state notification and persistence write. */
  reset(): void {
    this.stateManager.reset();
    this.runAllTools();
    removeAllStylesheets();
  }

  /** Get engine options (position, offset) */
  getOptions(): Readonly<AccessibilityEngineOptions> {
    return { ...this.options };
  }

  // ─── Internal ───────────────────────────────────────────

  /** Apply every state in the current snapshot. */
  private runAllTools(): void {
    const states = this.stateManager.getState().states ?? {};

    for (const tool of CONTINUOUS_TOOLS) {
      const value = Number(states[tool.stateKey]);
      tool.apply(Number.isFinite(value) ? value : tool.defaultValue);
    }

    for (const group of Object.values(EXCLUSIVE_GROUPS)) {
      const active = states[group.stateKey];
      const isValid = typeof active === "string" && isExclusiveTool(getTool(active));
      group.apply(isValid ? (active as string) : false);
    }

    for (const tool of BOOLEAN_TOOLS) {
      tool.executor(!!states[tool.id]);
    }
  }

  /** The canonical default state for every tool and group. */
  private defaultStates(): Record<string, unknown> {
    const updates: Record<string, unknown> = { activeProfile: null };
    for (const tool of BOOLEAN_TOOLS) updates[tool.id] = false;
    for (const group of Object.values(EXCLUSIVE_GROUPS)) updates[group.stateKey] = false;
    for (const tool of CONTINUOUS_TOOLS) updates[tool.stateKey] = tool.defaultValue;
    return updates;
  }

  /** Reset every tool to its default and apply it. */
  private clearTools(): void {
    this.stateManager.setMany(this.defaultStates());
    this.runAllTools();
  }

  private setContinuous(tool: ContinuousTool, value: number): void {
    const clamped = Math.max(tool.min, Math.min(tool.max, value));
    this.stateManager.setMany({ [tool.stateKey]: clamped, activeProfile: null });
    tool.apply(clamped);
  }

  private setExclusive(group: ExclusiveGroup, activeId: string | false): void {
    this.stateManager.setMany({ [group.stateKey]: activeId || false, activeProfile: null });
    group.apply(activeId || false);
  }
}
