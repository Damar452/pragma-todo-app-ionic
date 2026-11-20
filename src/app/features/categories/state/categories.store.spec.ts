import { TestBed } from '@angular/core/testing';

import { CategoryRepository } from '../data/category.repository';
import { InMemoryCategoryRepository } from '../data/testing/in-memory-category.repository';
import { aCategory } from '../domain/category-fixture.testing';

import { CategoriesStore } from './categories.store';

import { ID_GENERATOR } from '@core/runtime/id-generator';
import { LoadStatus } from '@core/state/load-status.enums';
import { TasksStore } from '@features/tasks/state/tasks.store';
import { FakeTasksStore } from '@features/tasks/state/testing/fake-tasks.store';

function setup(initial = [aCategory({ id: 'a', name: 'Work' })]) {
  const repository = new InMemoryCategoryRepository(initial);
  let nextId = 0;
  TestBed.configureTestingModule({
    providers: [
      { provide: CategoryRepository, useValue: repository },
      { provide: TasksStore, useClass: FakeTasksStore },
      { provide: ID_GENERATOR, useValue: () => `id-${++nextId}` },
    ],
  });
  return {
    repository,
    store: TestBed.inject(CategoriesStore),
    tasksStore: TestBed.inject(TasksStore) as unknown as FakeTasksStore,
  };
}

describe('CategoriesStore', () => {
  describe('load', () => {
    it('publishes the persisted categories sorted by name and becomes ready', async () => {
      // Arrange
      const { store } = setup([
        aCategory({ id: '1', name: 'Zeta' }),
        aCategory({ id: '2', name: 'alfa' }),
      ]);

      // Act
      await store.load();

      // Assert
      expect(store.status()).toBe(LoadStatus.Ready);
      expect(store.categories().map((category) => category.name)).toEqual(['alfa', 'Zeta']);
    });

    it('ends in error status when reading fails', async () => {
      // Arrange
      const { store, repository } = setup();
      repository.failLoadWith = new Error('disk');

      // Act
      await store.load();

      // Assert
      expect(store.status()).toBe(LoadStatus.Error);
      expect(store.categories()).toEqual([]);
    });
  });

  describe('add', () => {
    it('creates the category with a generated id and persists it', async () => {
      // Arrange
      const { store, repository } = setup([]);
      await store.load();

      // Act
      const category = await store.add({ name: ' Home ', color: '#111111' });

      // Assert
      expect(category).toEqual({ id: 'id-1', name: 'Home', color: '#111111' });
      expect(repository.categories).toEqual([category]);
    });

    it('rolls back and rethrows when persisting fails', async () => {
      // Arrange
      const { store, repository } = setup([]);
      await store.load();
      repository.failNextSaveWith = new Error('boom');

      // Act
      const result = store.add({ name: 'Home', color: '#111111' });

      // Assert
      await expect(result).rejects.toThrow('boom');
      expect(store.categories()).toEqual([]);
    });
  });

  describe('update', () => {
    it('changes name and color and persists', async () => {
      // Arrange
      const { store, repository } = setup();
      await store.load();

      // Act
      await store.update('a', { name: 'Job', color: '#222222' });

      // Assert
      expect(store.categories()[0]).toMatchObject({ name: 'Job', color: '#222222' });
      expect(repository.categories[0]).toMatchObject({ name: 'Job', color: '#222222' });
    });

    it('rolls back when persisting fails', async () => {
      // Arrange
      const { store, repository } = setup();
      await store.load();
      repository.failNextSaveWith = new Error('boom');

      // Act
      const result = store.update('a', { name: 'Job', color: '#222222' });

      // Assert
      await expect(result).rejects.toThrow('boom');
      expect(store.categories()[0].name).toBe('Work');
    });
  });

  describe('remove', () => {
    it('deletes the category and persists', async () => {
      // Arrange
      const { store, repository } = setup();
      await store.load();

      // Act
      await store.remove('a');

      // Assert
      expect(store.categories()).toEqual([]);
      expect(repository.categories).toEqual([]);
    });

    it('sends the tasks of the category to uncategorized', async () => {
      // Arrange
      const { store, tasksStore } = setup();
      await store.load();

      // Act
      await store.remove('a');

      // Assert
      expect(tasksStore.unassignedCategoryIds).toEqual(['a']);
    });

    it('rolls back the deletion when persisting it fails, leaving tasks alone', async () => {
      // Arrange
      const { store, repository, tasksStore } = setup();
      await store.load();
      repository.failNextSaveWith = new Error('boom');

      // Act
      const result = store.remove('a');

      // Assert
      await expect(result).rejects.toThrow('boom');
      expect(store.categories()).toHaveLength(1);
      expect(tasksStore.unassignedCategoryIds).toEqual([]);
    });

    it('brings the category back when its tasks cannot be unassigned', async () => {
      // Arrange
      const { store, repository, tasksStore } = setup();
      await store.load();
      tasksStore.failNextUnassignWith = new Error('boom');

      // Act
      const result = store.remove('a');

      // Assert
      await expect(result).rejects.toThrow('boom');
      expect(store.categories()).toHaveLength(1);
      expect(repository.categories).toHaveLength(1);
    });
  });

  describe('isNameTaken', () => {
    it('matches ignoring case and accents', async () => {
      // Arrange
      const { store } = setup([aCategory({ id: 'a', name: 'Educación' })]);
      await store.load();

      // Act / Assert
      expect(store.isNameTaken(' educacion ')).toBe(true);
    });

    it('ignores the category being edited', async () => {
      // Arrange
      const { store } = setup([aCategory({ id: 'a', name: 'Work' })]);
      await store.load();

      // Act / Assert
      expect(store.isNameTaken('work', 'a')).toBe(false);
    });
  });
});
