/**
 * open-a11y/angular — Angular 17+ adapter.
 *
 * Uses signals for reactive state and a standalone directive for the widget.
 * The core engine remains the single state owner.
 */
import {
  computed,
  Directive,
  ElementRef,
  inject,
  Injectable,
  InjectionToken,
  Input,
  makeEnvironmentProviders,
  signal,
  type EnvironmentProviders,
  type OnDestroy,
  type Signal,
} from '@angular/core'
import { AccessibilityEngine } from '../engine/AccessibilityEngine'
import type { ISettings, ISettingsStates } from '../types/ISettings'
import type { UIOptions } from '../ui/wire-up'
import { createAccessibilityUI } from '../ui/wire-up'
import {
  destroyActiveAccessibilityUI,
  type AccessibilityUIController,
} from '../ui/lifecycle'

export const ACCESSIBILITY_ENGINE = new InjectionToken<AccessibilityEngine>('open-a11y.engine')

/** Register an engine with Angular's injector. */
export function provideAccessibility(engine: AccessibilityEngine): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: ACCESSIBILITY_ENGINE, useValue: engine },
    AccessibilityService,
  ])
}

@Injectable({ providedIn: 'root' })
export class AccessibilityService implements OnDestroy {
  private readonly engine = inject(ACCESSIBILITY_ENGINE)
  private readonly snapshot = signal<Readonly<ISettings>>(this.engine.settings)
  private readonly unsubscribe = this.engine.subscribe((next) => this.snapshot.set(next))

  readonly settings: Signal<Readonly<ISettings>> = this.snapshot.asReadonly()
  readonly states: Signal<ISettingsStates> = computed(() => this.snapshot().states ?? {})

  toggleTool(toolId: string, enabled?: boolean | number): void {
    this.engine.toggleTool(toolId, enabled)
  }

  setFontScale(scale: number): void {
    this.engine.setFontScale(scale)
  }

  setLineHeight(height: number): void {
    this.engine.setLineHeight(height)
  }

  setLetterSpacing(spacing: number): void {
    this.engine.setLetterSpacing(spacing)
  }

  applyProfile(profileId: string): void {
    this.engine.applyProfile(profileId)
  }

  deactivateProfile(profileId: string): void {
    this.engine.deactivateProfile(profileId)
  }

  setLanguage(lang: string): void {
    void this.engine.setLanguage(lang)
  }

  reset(): void {
    this.engine.reset()
  }

  isToolEnabled(toolId: string): boolean {
    return this.engine.isToolEnabled(toolId)
  }

  getToolValue(toolId: string): unknown {
    return this.engine.getToolValue(toolId)
  }

  showWidget(options?: UIOptions): AccessibilityUIController {
    return createAccessibilityUI(this.engine, options)
  }

  hideWidget(): void {
    destroyActiveAccessibilityUI()
  }

  getEngine(): AccessibilityEngine {
    return this.engine
  }

  ngOnDestroy(): void {
    this.unsubscribe()
  }
}

/**
 * Standalone directive:
 *
 *   <div [openA11yWidget]="widgetOptions"></div>
 */
@Directive({
  selector: '[openA11yWidget]',
  standalone: true,
})
export class AccessibilityWidgetDirective implements OnDestroy {
  private readonly service = inject(AccessibilityService)
  private readonly host = inject(ElementRef) as ElementRef<HTMLElement>
  private controller: AccessibilityUIController | null = null
  private mounted = false
  private options: UIOptions = {}

  @Input()
  set openA11yWidget(value: UIOptions | '' | null | undefined) {
    this.options = value && typeof value === 'object' ? value : {}
    if (this.mounted) this.mount()
  }

  ngOnInit(): void {
    this.mounted = true
    this.mount()
  }

  private mount(): void {
    if (typeof document === 'undefined') return
    if (!this.service.getEngine().config.enabled) return
    this.controller?.destroy()
    this.controller = this.service.showWidget({
      ...this.options,
      container: this.host.nativeElement,
    })
  }

  ngOnDestroy(): void {
    this.mounted = false
    this.controller?.destroy()
    this.controller = null
  }
}

/** Re-export the core API for single-import convenience. */
export { AccessibilityEngine } from '../engine/AccessibilityEngine'
export type { AccessibilityEngineOptions } from '../engine/AccessibilityEngine'
export { localStorageAdapter, createMemoryAdapter } from '../storage'
