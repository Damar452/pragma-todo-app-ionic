import { inject } from '@angular/core';

import { APP_MIGRATIONS } from './app.migrations';

import { KeyValueStorage } from '@core/storage/key-value-storage';
import { runMigrations } from '@core/storage/run-migrations';
import { CategoriesStore } from '@features/categories/state/categories.store';
import { TasksStore } from '@features/tasks/state/tasks.store';

/**
 * Runs before the first render: migrates the stored data to the current
 * schema, then loads tasks and categories into their stores, so screens never
 * flash an empty state and the native splash stays up meanwhile. A failing
 * migration is logged and does not block start-up (the stores report their own
 * load errors through `status`).
 */
export async function initializeAppData(): Promise<void> {
  const storage = inject(KeyValueStorage);
  const tasks = inject(TasksStore);
  const categories = inject(CategoriesStore);

  try {
    await runMigrations(storage, APP_MIGRATIONS);
  } catch (error) {
    console.error('Storage migration failed', error);
  }
  await Promise.all([tasks.load(), categories.load()]);
}
