import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAccessibility } from '@aotr/open-a11y/angular';
import { engine } from './engine';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAccessibility(engine),
  ]
};
