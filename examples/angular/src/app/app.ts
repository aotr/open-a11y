import { Component, ElementRef, afterNextRender, signal, viewChild } from "@angular/core";
import { JsonPipe } from "@angular/common";
import { AccessibilityService, mountAccessibilityWidget } from "@aotr/open-a11y/angular";
import {
  DEFAULT_DEMO_STATE,
  createDemoCustomizer,
  toDemoConfig,
  type DemoUiState,
} from "../../../shared/customizer";

@Component({
  selector: "app-root",
  imports: [JsonPipe],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  readonly state = signal<DemoUiState>({ ...DEFAULT_DEMO_STATE });
  readonly widgetOptions = () => ({ config: toDemoConfig(this.state()) });
  private readonly customizer = viewChild.required<ElementRef<HTMLElement>>("customizer");
  private widget: ReturnType<typeof mountAccessibilityWidget> | null = null;

  constructor(readonly service: AccessibilityService) {
    afterNextRender(() => {
      createDemoCustomizer(this.customizer().nativeElement, DEFAULT_DEMO_STATE, (next, key) => {
        this.state.set(next);
        if (key === "language") void this.service.setLanguage(next.language);
        this.mountWidget();
      });
      void this.service.setLanguage(this.state().language);
      this.mountWidget();
    });
  }

  private mountWidget(): void {
    this.widget?.destroy();
    this.widget = mountAccessibilityWidget(this.service, {
      config: toDemoConfig(this.state()),
    });
  }
}
