import type { Provider } from '@angular/core';

import { CategoryTaskCleanup } from '@features/categories/state/category-task-cleanup';
import { TasksStore } from '@features/tasks/state/tasks.store';

/**
 * Cross-feature wiring lives at the app root: the tasks store fulfils the
 * categories feature's cleanup contract. The annotated return type of the
 * factory is the compile-time check: if `TasksStore` drifts from
 * `CategoryTaskCleanup`, the build fails here.
 */
export function provideCategoryTaskCleanup(): Provider[] {
  return [
    {
      provide: CategoryTaskCleanup,
      useFactory: (tasks: TasksStore): CategoryTaskCleanup => tasks,
      deps: [TasksStore],
    },
  ];
}
