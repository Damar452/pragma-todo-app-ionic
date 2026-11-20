import type { ApplicationConfig } from '@angular/core';
import { provideAppInitializer } from '@angular/core';
import {
  PreloadAllModules,
  RouteReuseStrategy,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { initializeAppData } from './app.initializer';
import { routes } from './app.routes';

import { provideI18n } from '@core/i18n/provide-i18n';
import { provideStorage } from '@core/storage/provide-storage';
import { provideCategoriesData } from '@features/categories/data/provide-categories-data';
import { provideTasksData } from '@features/tasks/data/provide-tasks-data';

/** Composition root: the only place that binds ports to adapters and wires start-up work. */
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideI18n(),
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
    provideStorage(),
    provideTasksData(),
    provideCategoriesData(),
    provideAppInitializer(initializeAppData),
  ],
};
