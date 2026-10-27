# Angular adapter

> `@aotr/open-a11y/angular`

Angular 17+ adapter built with ng-packagr so AOT consumers receive directive and
provider metadata.

## Install

```bash
npm install @aotr/open-a11y @angular/core
```

## Bootstrap

```ts
import { bootstrapApplication } from '@angular/platform-browser'
import { AccessibilityEngine, localStorageAdapter } from '@aotr/open-a11y'
import { provideAccessibility } from '@aotr/open-a11y/angular'
import { App } from './app'

const engine = new AccessibilityEngine({ storage: localStorageAdapter })

await engine.init()
bootstrapApplication(App, {
  providers: [provideAccessibility(engine)],
})
```

## Service

```ts
import { Component, inject } from '@angular/core'
import { AccessibilityService } from '@aotr/open-a11y/angular'

@Component({
  selector: 'app-toolbar',
  template: `
    <button type="button" (click)="service.toggleTool('font-weight')">
      Bold text
    </button>
    <pre>{{ service.settings() | json }}</pre>
  `,
})
export class Toolbar {
  readonly service = inject(AccessibilityService)
}
```

`settings` and `states` are Angular signals. The service also exposes profile,
language, reset, widget, and tool actions.

## Directive

```ts
import { Component } from '@angular/core'
import { AccessibilityWidgetDirective } from '@aotr/open-a11y/angular'

@Component({
  selector: 'app-root',
  imports: [AccessibilityWidgetDirective],
  template: `<div [openA11yWidget]="options"></div>`,
})
export class App {
  readonly options = {
    position: 'bottom-right' as const,
    config: { buttonSize: 56 },
  }
}
```

The directive destroys its own controller on destroy. New options remount the
widget without resetting engine state.

## Tests

`__tests__/angular-adapter.test.ts` covers signals, actions, provider creation,
directive mount, and teardown.
