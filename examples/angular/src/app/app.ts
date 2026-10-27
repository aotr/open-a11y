import { Component, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { AccessibilityService, AccessibilityWidgetDirective } from '@aotr/open-a11y/angular';
import {
  DEFAULT_DEMO_STATE,
  createDemoCustomizer,
  toDemoConfig,
  type DemoUiState,
} from '../../../shared/customizer';

@Component({
  selector: 'app-root',
  imports: [JsonPipe, AccessibilityWidgetDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly service = inject(AccessibilityService);
  readonly state = signal<DemoUiState>({ ...DEFAULT_DEMO_STATE });
  readonly widgetOptions = () => ({ config: toDemoConfig(this.state()) });
  private readonly customizer = viewChild.required<ElementRef<HTMLElement>>('customizer');

  constructor() {
    afterNextRender(() => {
      createDemoCustomizer(this.customizer().nativeElement, DEFAULT_DEMO_STATE, (next, key) => {
        this.state.set(next);
        if (key === 'language') void this.service.setLanguage(next.language);
      });
      void this.service.setLanguage(this.state().language);
    });
  }
}
