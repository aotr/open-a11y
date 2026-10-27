/**
 * open-a11y/angular — Angular 17+ adapter.
 *
 * Uses signals for reactive state and a standalone directive for the widget.
 * The core engine remains the single state owner.
 */
import {
  computed,
  Injectable,
  InjectionToken,
  makeEnvironmentProviders,
  signal,
  type EnvironmentProviders,
  type OnDestroy,
  type Signal,
} from "@angular/core";
import { AccessibilityEngine } from "../engine/AccessibilityEngine";
import type { ISettings, ISettingsStates } from "../types/ISettings";
import type { UIOptions } from "../ui/wire-up";
import { createAccessibilityUI } from "../ui/wire-up";
import { destroyActiveAccessibilityUI, type AccessibilityUIController } from "../ui/lifecycle";

export const ACCESSIBILITY_ENGINE = new InjectionToken<AccessibilityEngine>("open-a11y.engine");

/** Register an engine with Angular's injector. */
export function provideAccessibility(engine: AccessibilityEngine): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: ACCESSIBILITY_ENGINE, useValue: engine },
    {
      provide: AccessibilityService,
      useFactory: (activeEngine: AccessibilityEngine) => new AccessibilityService(activeEngine),
      deps: [ACCESSIBILITY_ENGINE],
    },
  ]);
}

@Injectable()
export class AccessibilityService implements OnDestroy {
  private readonly engine: AccessibilityEngine;
  private readonly snapshot: ReturnType<typeof signal<Readonly<ISettings>>>;
  private readonly unsubscribe: () => void;

  readonly settings: Signal<Readonly<ISettings>>;
  readonly states: Signal<ISettingsStates>;

  constructor(engine: AccessibilityEngine) {
    this.engine = engine;
    this.snapshot = signal<Readonly<ISettings>>(engine.settings);
    this.settings = this.snapshot.asReadonly();
    this.states = computed(() => this.snapshot().states ?? {});
    this.unsubscribe = engine.subscribe((next) => this.snapshot.set(next));
  }

  toggleTool(toolId: string, enabled?: boolean | number): void {
    this.engine.toggleTool(toolId, enabled);
  }

  setFontScale(scale: number): void {
    this.engine.setFontScale(scale);
  }

  setLineHeight(height: number): void {
    this.engine.setLineHeight(height);
  }

  setLetterSpacing(spacing: number): void {
    this.engine.setLetterSpacing(spacing);
  }

  applyProfile(profileId: string): void {
    this.engine.applyProfile(profileId);
  }

  deactivateProfile(profileId: string): void {
    this.engine.deactivateProfile(profileId);
  }

  setLanguage(lang: string): void {
    void this.engine.setLanguage(lang);
  }

  reset(): void {
    this.engine.reset();
  }

  isToolEnabled(toolId: string): boolean {
    return this.engine.isToolEnabled(toolId);
  }

  getToolValue(toolId: string): unknown {
    return this.engine.getToolValue(toolId);
  }

  showWidget(options?: UIOptions): AccessibilityUIController {
    return createAccessibilityUI(this.engine, options);
  }

  hideWidget(): void {
    destroyActiveAccessibilityUI();
  }

  getEngine(): AccessibilityEngine {
    return this.engine;
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}

/**
 * Mount the widget from an Angular component. Call this after the view exists,
 * for example inside `afterNextRender`:
 *
 *   afterNextRender(() => mountAccessibilityWidget(service))
 */
export function mountAccessibilityWidget(
  service: AccessibilityService,
  options?: UIOptions,
): AccessibilityUIController {
  return service.showWidget(options);
}

/** Re-export the core API for single-import convenience. */
export { AccessibilityEngine } from "../engine/AccessibilityEngine";
export type { AccessibilityEngineOptions } from "../engine/AccessibilityEngine";
export { localStorageAdapter, createMemoryAdapter } from "../storage";
