/**
 * Angular adapter tests.
 *
 * Runs the signal service and widget directive inside a plain Angular injector,
 * so the adapter does not require TestBed or template compilation.
 */
import { afterEach, describe, expect, it } from 'vitest'
import { ElementRef, Injector, runInInjectionContext } from '@angular/core'
import { AccessibilityEngine } from '../src/engine/AccessibilityEngine'
import { createMemoryAdapter } from '../src/storage/memoryAdapter'
import {
  ACCESSIBILITY_ENGINE,
  AccessibilityService,
  AccessibilityWidgetDirective,
  provideAccessibility,
} from '../src/angular'
import { destroyActiveAccessibilityUI } from '../src/ui/lifecycle'

afterEach(() => {
  destroyActiveAccessibilityUI()
  document.querySelectorAll('asw-widget, asw-menu').forEach((el) => el.remove())
  document.body.style.overflow = ''
})

function createTestEngine() {
  return new AccessibilityEngine({ storage: createMemoryAdapter() })
}

function createService(engine: AccessibilityEngine) {
  const injector = Injector.create({
    providers: [{ provide: ACCESSIBILITY_ENGINE, useValue: engine }],
  })
  return runInInjectionContext(injector, () => new AccessibilityService())
}

describe('Angular adapter', () => {
  it('creates a signal-backed service', () => {
    const engine = createTestEngine()
    const service = createService(engine)

    expect(service.settings().lang).toBe('en')

    service.toggleTool('font-weight', true)
    expect(service.settings().states['font-weight']).toBe(true)
    expect(service.states()['font-weight']).toBe(true)

    service.applyProfile('vision-impaired')
    expect(service.states().contrast).toBe('high-contrast')

    service.reset()
    expect(service.states()).toEqual({})
  })

  it('exposes widget lifecycle and engine access', () => {
    const engine = createTestEngine()
    const service = createService(engine)

    expect(service.getEngine()).toBe(engine)

    const controller = service.showWidget({ position: 'top-left' })
    expect(controller.widget.getAttribute('position')).toBe('top-left')

    service.hideWidget()
    expect(document.querySelectorAll('asw-widget')).toHaveLength(0)
  })

  it('provides an environment provider bundle', () => {
    const providers = provideAccessibility(createTestEngine())
    expect(providers).toBeTruthy()
  })

  it('mounts and destroys the widget through the directive', () => {
    const engine = createTestEngine()
    const service = createService(engine)
    const host = document.createElement('div')
    document.body.appendChild(host)

    const injector = Injector.create({
      providers: [
        { provide: AccessibilityService, useValue: service },
        { provide: ElementRef, useValue: new ElementRef(host) },
      ],
    })

    const directive = runInInjectionContext(
      injector,
      () => new AccessibilityWidgetDirective()
    )
    directive.openA11yWidget = { position: 'top-right', config: { buttonSize: 48 } }
    directive.ngOnInit()

    const widget = host.querySelector('asw-widget')
    expect(widget?.getAttribute('position')).toBe('top-right')
    expect(widget?.getAttribute('button-size')).toBe('48')

    directive.ngOnDestroy()
    expect(host.querySelectorAll('asw-widget')).toHaveLength(0)
    host.remove()
  })
})
