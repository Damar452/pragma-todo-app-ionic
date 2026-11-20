import { TestBed } from '@angular/core/testing';

import { initializeAppData } from './app.initializer';

import { LoadStatus } from '@core/state/load-status.enums';
import { KeyValueStorage } from '@core/storage/key-value-storage';
import { SCHEMA_VERSION_KEY } from '@core/storage/storage.constants';
import { InMemoryKeyValueStorage } from '@core/storage/testing/in-memory-key-value-storage';
import { provideCategoriesData } from '@features/categories/data/provide-categories-data';
import { CategoriesStore } from '@features/categories/state/categories.store';
import { provideTasksData } from '@features/tasks/data/provide-tasks-data';
import { TASKS_STORAGE_KEY } from '@features/tasks/data/task-storage.constants';
import { TasksStore } from '@features/tasks/state/tasks.store';

function setup() {
  const storage = new InMemoryKeyValueStorage();
  TestBed.configureTestingModule({
    providers: [
      { provide: KeyValueStorage, useValue: storage },
      provideTasksData(),
      provideCategoriesData(),
    ],
  });
  return { storage };
}

describe('initializeAppData', () => {
  it('leaves both stores ready and empty on a fresh install', async () => {
    // Arrange
    setup();

    // Act
    await TestBed.runInInjectionContext(initializeAppData);

    // Assert
    expect(TestBed.inject(TasksStore).status()).toBe(LoadStatus.Ready);
    expect(TestBed.inject(CategoriesStore).status()).toBe(LoadStatus.Ready);
    expect(TestBed.inject(TasksStore).tasks()).toEqual([]);
  });

  it('migrates stored data before loading it', async () => {
    // Arrange
    const { storage } = setup();
    await storage.set(TASKS_STORAGE_KEY, [
      { id: 'a', title: 'Legacy', completed: false, createdAt: 1 },
    ]);

    // Act
    await TestBed.runInInjectionContext(initializeAppData);

    // Assert
    expect(TestBed.inject(TasksStore).tasks()).toEqual([
      { id: 'a', title: 'Legacy', completed: false, createdAt: 1, categoryId: null },
    ]);
    expect(await storage.get(SCHEMA_VERSION_KEY)).toBe(2);
  });
});
