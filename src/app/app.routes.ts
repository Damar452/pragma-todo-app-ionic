import type { Routes } from '@angular/router';

import { featureFlagGuard } from '@core/feature-flags/feature-flag.guard';
import { FeatureFlag } from '@core/feature-flags/feature-flags.enums';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@layout/tabs-layout/tabs-layout.component').then((m) => m.TabsLayoutComponent),
    children: [
      {
        path: 'tasks',
        loadChildren: () => import('@features/tasks/tasks.routes').then((m) => m.TASKS_ROUTES),
      },
      {
        path: 'categories',
        canMatch: [featureFlagGuard(FeatureFlag.CategoriesEnabled)],
        loadChildren: () =>
          import('@features/categories/categories.routes').then((m) => m.CATEGORIES_ROUTES),
      },
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'tasks',
  },
];
