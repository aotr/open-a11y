/**
 * open-a11y/vue — Vue 3 adapter.
 *
 * Provides a plugin, an injectable context, and a declarative widget component.
 * The adapter owns only Vue reactivity and lifecycle; the engine remains the
 * single state owner.
 */
import {
  computed,
  defineComponent,
  inject,
  onBeforeUnmount,
  onMounted,
  readonly as vueReadonly,
  shallowRef,
  watch,
  type App,
  type ComputedRef,
  type InjectionKey,
  type Plugin,
  type PropType,
  type Ref,
} from 'vue'
import { AccessibilityEngine } from '../engine/AccessibilityEngine'
import type { ISettings, ISettingsStates } from '../types/ISettings'
import type { IAccessibilityConfig } from '../config/accessibility.config'
import { createAccessibilityUI, type UIOptions } from '../ui/wire-up'
import {
  destroyActiveAccessibilityUI,
  getActiveAccessibilityUI,
  type AccessibilityUIController,
} from '../ui/lifecycle'

export interface AccessibilityVueContext {
  /** Reactive settings snapshot. */
  settings: Readonly<Ref<Readonly<ISettings>>>
  /** Reactive tool-state map. */
  states: ComputedRef<ISettingsStates>
  engine: AccessibilityEngine
  toggleTool: (toolId: string, enabled?: boolean | number) => void
  setFontScale: (scale: number) => void
  setLineHeight: (height: number) => void
  setLetterSpacing: (spacing: number) => void
  applyProfile: (profileId: string) => void
  deactivateProfile: (profileId: string) => void
  setLanguage: (lang: string) => void
  reset: () => void
  isToolEnabled: (toolId: string) => boolean
  getToolValue: (toolId: string) => unknown
  showWidget: (options?: UIOptions) => AccessibilityUIController
  hideWidget: () => void
  dispose: () => void
}

export interface AccessibilityPluginOptions {
  /** Mount the floating widget when the Vue app is installed (default: false). */
  showWidgetOnMount?: boolean
  /** Options for the automatically mounted widget. */
  widgetOptions?: UIOptions
}

const ACCESSIBILITY_KEY: InjectionKey<AccessibilityVueContext> = Symbol('open-a11y')

/** Create a Vue context backed by an existing engine. */
export function createAccessibilityContext(engine: AccessibilityEngine): AccessibilityVueContext {
  const settings = shallowRef<Readonly<ISettings>>(engine.settings)
  const unsubscribe = engine.subscribe((next) => {
    settings.value = next
  })

  const context: AccessibilityVueContext = {
    settings: vueReadonly(settings),
    states: computed(() => settings.value.states ?? {}),
    engine,
    toggleTool: (toolId, enabled) => engine.toggleTool(toolId, enabled),
    setFontScale: (scale) => engine.setFontScale(scale),
    setLineHeight: (height) => engine.setLineHeight(height),
    setLetterSpacing: (spacing) => engine.setLetterSpacing(spacing),
    applyProfile: (profileId) => engine.applyProfile(profileId),
    deactivateProfile: (profileId) => engine.deactivateProfile(profileId),
    setLanguage: (lang) => {
      void engine.setLanguage(lang)
    },
    reset: () => engine.reset(),
    isToolEnabled: (toolId) => engine.isToolEnabled(toolId),
    getToolValue: (toolId) => engine.getToolValue(toolId),
    showWidget: (options) => createAccessibilityUI(engine, options),
    hideWidget: () => destroyActiveAccessibilityUI(),
    dispose: unsubscribe,
  }

  return context
}

/** Vue plugin: `app.use(createAccessibilityPlugin(engine))`. */
export function createAccessibilityPlugin(
  engine: AccessibilityEngine,
  options: AccessibilityPluginOptions = {}
): Plugin {
  return {
    install(app: App) {
      const context = createAccessibilityContext(engine)
      app.provide(ACCESSIBILITY_KEY, context)

      let controller: AccessibilityUIController | null = null
      app.onUnmount(context.dispose)

      if (options.showWidgetOnMount && typeof document !== 'undefined' && engine.config.enabled) {
        controller = context.showWidget(options.widgetOptions)
        app.onUnmount(() => controller?.destroy())
      }
    },
  }
}

/** Access the nearest open-a11y Vue context. Must be used under the plugin. */
export function useAccessibility(): AccessibilityVueContext {
  const context = inject(ACCESSIBILITY_KEY, null)
  if (!context) {
    throw new Error('useAccessibility() must be used after app.use(createAccessibilityPlugin(engine))')
  }
  return context
}

/** Declarative widget component. It renders no markup; the web component does. */
export const A11yWidget = defineComponent({
  name: 'A11yWidget',
  props: {
    options: {
      type: Object as PropType<UIOptions>,
      default: undefined,
    },
    autoMount: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const context = useAccessibility()
    let controller: AccessibilityUIController | null = null
    let mounted = false

    const mount = () => {
      if (!props.autoMount || typeof document === 'undefined') return
      if (!context.engine.config.enabled) return
      controller?.destroy()
      controller = context.showWidget(props.options)
    }

    onMounted(() => {
      mounted = true
      if (!getActiveAccessibilityUI()) mount()
    })

    watch(
      () => props.options,
      () => {
        if (mounted) mount()
      },
      { deep: true }
    )

    onBeforeUnmount(() => {
      controller?.destroy()
      controller = null
    })

    return () => null
  },
})

/** Re-export the core API for single-import convenience. */
export { AccessibilityEngine } from '../engine/AccessibilityEngine'
export type { AccessibilityEngineOptions } from '../engine/AccessibilityEngine'
export { localStorageAdapter, createMemoryAdapter } from '../storage'
export type { IAccessibilityConfig }
