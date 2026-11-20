import type { KeyValueStorage } from '@core/storage/key-value-storage';
import type { Migration } from '@core/storage/migration.model';
import { CATEGORIES_STORAGE_KEY } from '@features/categories/data/category-storage.constants';
import { TASKS_STORAGE_KEY } from '@features/tasks/data/task-storage.constants';
import { isRecord } from '@shared/utils/object/is-record';

/**
 * v1 -> v2 (categories): tasks stored before categories existed get
 * `categoryId: null`, and the categories key starts as an empty list.
 */
async function addCategories(storage: KeyValueStorage): Promise<void> {
  const tasks = await storage.get<unknown>(TASKS_STORAGE_KEY);
  if (Array.isArray(tasks)) {
    const migrated = tasks.map((task: unknown) =>
      isRecord(task) ? { ...task, categoryId: task['categoryId'] ?? null } : task,
    );
    await storage.set(TASKS_STORAGE_KEY, migrated);
  }

  if ((await storage.get<unknown>(CATEGORIES_STORAGE_KEY)) === null) {
    await storage.set(CATEGORIES_STORAGE_KEY, []);
  }
}

/**
 * The app's schema history, oldest first. v1 is the original shape (no
 * migration needed to be "at" it); append a new entry whenever the stored
 * shape changes, never edit an old one.
 */
export const APP_MIGRATIONS: readonly Migration[] = [{ version: 2, migrate: addCategories }];
