import { APP_MIGRATIONS } from './app.migrations';

import { runMigrations } from '@core/storage/run-migrations';
import { SCHEMA_VERSION_KEY } from '@core/storage/storage.constants';
import { InMemoryKeyValueStorage } from '@core/storage/testing/in-memory-key-value-storage';
import { CATEGORIES_STORAGE_KEY } from '@features/categories/data/category-storage.constants';
import { TASKS_STORAGE_KEY } from '@features/tasks/data/task-storage.constants';

describe('APP_MIGRATIONS', () => {
  it('brings a fresh install to schema version 2 with an empty categories list', async () => {
    // Arrange
    const storage = new InMemoryKeyValueStorage();

    // Act
    const version = await runMigrations(storage, APP_MIGRATIONS);

    // Assert
    expect(version).toBe(2);
    expect(await storage.get(SCHEMA_VERSION_KEY)).toBe(2);
    expect(await storage.get(CATEGORIES_STORAGE_KEY)).toEqual([]);
    expect(await storage.get(TASKS_STORAGE_KEY)).toBeNull();
  });

  it('gives tasks stored without a category a null categoryId', async () => {
    // Arrange
    const storage = new InMemoryKeyValueStorage();
    await storage.set(TASKS_STORAGE_KEY, [
      { id: 'a', title: 'Old task', completed: false, createdAt: 1 },
      { id: 'b', title: 'Kept', completed: true, createdAt: 2, categoryId: 'c1' },
    ]);

    // Act
    await runMigrations(storage, APP_MIGRATIONS);

    // Assert
    expect(await storage.get(TASKS_STORAGE_KEY)).toEqual([
      { id: 'a', title: 'Old task', completed: false, createdAt: 1, categoryId: null },
      { id: 'b', title: 'Kept', completed: true, createdAt: 2, categoryId: 'c1' },
    ]);
  });

  it('keeps categories that already exist', async () => {
    // Arrange
    const storage = new InMemoryKeyValueStorage();
    const categories = [{ id: 'c1', name: 'Home', color: '#111111' }];
    await storage.set(CATEGORIES_STORAGE_KEY, categories);

    // Act
    await runMigrations(storage, APP_MIGRATIONS);

    // Assert
    expect(await storage.get(CATEGORIES_STORAGE_KEY)).toEqual(categories);
  });
});
