import { TestBed } from '@angular/core/testing';

import { provideCategoryTaskCleanup } from './provide-category-task-cleanup';

import { provideFakeDate } from '@core/date/testing/fake-date.service';
import { aCategory } from '@features/categories/domain/category-fixture.testing';
import { CategoriesStore } from '@features/categories/state/categories.store';
import { CategoryTaskCleanup } from '@features/categories/state/category-task-cleanup';
import { provideInMemoryCategories } from '@features/categories/state/testing/in-memory-categories.providers';
import { aTask } from '@features/tasks/domain/task-fixture.testing';
import { TasksStore } from '@features/tasks/state/tasks.store';
import { provideInMemoryTasks } from '@features/tasks/state/testing/in-memory-tasks.providers';

function setup() {
  const { providers: taskProviders } = provideInMemoryTasks([
    aTask({ id: 't1', categoryId: 'c1' }),
    aTask({ id: 't2', categoryId: 'other' }),
  ]);
  const { providers: categoryProviders } = provideInMemoryCategories([
    aCategory({ id: 'c1', name: 'Work' }),
  ]);
  TestBed.configureTestingModule({
    providers: [
      ...taskProviders,
      ...categoryProviders,
      provideCategoryTaskCleanup(),
      ...provideFakeDate(),
    ],
  });
  return {
    tasksStore: TestBed.inject(TasksStore),
    categoriesStore: TestBed.inject(CategoriesStore),
  };
}

describe('provideCategoryTaskCleanup', () => {
  it('resolves the cleanup contract to the tasks store instance', () => {
    // Arrange
    const { tasksStore } = setup();

    // Act
    const cleanup = TestBed.inject(CategoryTaskCleanup);

    // Assert
    expect(cleanup).toBe(tasksStore);
  });

  it('uncategorizes the tasks when a category is deleted through CategoriesStore', async () => {
    // Arrange
    const { tasksStore, categoriesStore } = setup();
    await Promise.all([tasksStore.load(), categoriesStore.load()]);

    // Act
    await categoriesStore.remove('c1');

    // Assert
    const byId = Object.fromEntries(tasksStore.tasks().map((task) => [task.id, task.categoryId]));
    expect(byId).toEqual({ t1: null, t2: 'other' });
  });
});
