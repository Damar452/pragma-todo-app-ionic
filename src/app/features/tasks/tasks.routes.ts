import type { Routes } from '@angular/router';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./ui/pages/task-list/task-list.page').then((m) => m.TaskListPage),
  },
];
