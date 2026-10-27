# Angular adapter

> `@aotr/open-a11y/angular`

Angular 17+ adapter built with ng-packagr so AOT consumers receive provider
metadata. The widget is mounted with a helper, avoiding template coupling.

## Install

```bash
npm install @aotr/open-a11y @angular/core
```

## Bootstrap

```ts
import { bootstrapApplication } from "@angular/platform-browser";
import { AccessibilityEngine, localStorageAdapter } from "@aotr/open-a11y";
import { provideAccessibility } from "@aotr/open-a11y/angular";
import { App } from "./app";

const engine = new AccessibilityEngine({ storage: localStorageAdapter });

await engine.init();
bootstrapApplication(App, {
  providers: [provideAccessibility(engine)],
});
```

## Service

```ts
import { Component, inject } from "@angular/core";
import { AccessibilityService } from "@aotr/open-a11y/angular";

@Component({
  selector: "app-toolbar",
  template: `
    <button type="button" (click)="service.toggleTool('font-weight')">Bold text</button>
    <pre>{{ service.settings() | json }}</pre>
  `,
})
export class Toolbar {
  readonly service = inject(AccessibilityService);
}
```

`settings` and `states` are Angular signals. The service also exposes profile,
language, reset, widget, and tool actions.

## Mount helper

```ts
import { Component, afterNextRender, inject } from "@angular/core";
import { AccessibilityService, mountAccessibilityWidget } from "@aotr/open-a11y/angular";

@Component({ selector: "app-root", template: "" })
export class App {
  readonly service = inject(AccessibilityService);

  constructor() {
    afterNextRender(() => {
      mountAccessibilityWidget(this.service, {
        position: "bottom-right",
        config: { buttonSize: 56 },
      });
    });
  }
}
```

`mountAccessibilityWidget` returns the controller. Destroy it to remount with new
options; engine state is preserved.

## Tests

`__tests__/angular-adapter.test.ts` covers signals, actions, provider creation, mount, and teardown.
