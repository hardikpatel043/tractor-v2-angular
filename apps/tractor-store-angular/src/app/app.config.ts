import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';

import { ServiceWorkerModule } from '@angular/service-worker';
import { appRoutes } from './app.routes';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: true,
        registrationStrategy: 'registerWhenStable:30000'
      }),
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
  ],
};
