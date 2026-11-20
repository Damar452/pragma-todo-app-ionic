import type { Routes } from '@angular/router';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/pages/category-manager/category-manager.page').then(
        (m) => m.CategoryManagerPage,
      ),
  },
];
