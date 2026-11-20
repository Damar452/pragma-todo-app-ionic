import { TestBed } from '@angular/core/testing';

import { TasksStore } from './tasks.store';

import { provideFakeDate } from '@core/date/testing/fake-date.service';
import { ID_GENERATOR } from '@core/runtime/id-generator';
import { LoadStatus } from '@core/state/load-status.enums';
import { TaskRepository } from '@features/tasks/data/task.repository';
import { InMemoryTaskRepository } from '@features/tasks/data/testing/in-memory-task.repository';
import { aTask } from '@features/tasks/domain/task-fixture.testing';

const NOW = 5000;

function setup(initial = [aTask({ id: 'seed' })]) {
  const repository = new InMemoryTaskRepository(initial);
  let nextId = 0;
  TestBed.configureTestingModule({
    providers: [
      { provide: TaskRepository, useValue: repository },
      { provide: ID_GENERATOR, useValue: () => `id-${++nextId}` },
      ...provideFakeDate(NOW),
    ],
  });
  return { repository, store: TestBed.inject(TasksStore) };
}

describe('TasksStore', () => {
  describe('load', () => {
    it('starts idle and empty', () => {
      // Arrange / Act
      const { store } = setup();

      // Assert
      expect(store.status()).toBe(LoadStatus.Idle);
      expect(store.tasks()).toEqual([]);
    });

    it('publishes the persisted tasks and becomes ready', async () => {
      // Arrange
      const { store } = setup([aTask({ id: 'a' }), aTask({ id: 'b' })]);

      // Act
      await store.load();

      // Assert
      expect(store.status()).toBe(LoadStatus.Ready);
      expect(store.tasks()).toHaveLength(2);
    });

    it('ends in error status with an empty list when reading fails', async () => {
      // Arrange
      const { store, repository } = setup();
      repository.failLoadWith = new Error('disk');

      // Act
      await store.load();

      // Assert
      expect(store.status()).toBe(LoadStatus.Error);
      expect(store.tasks()).toEqual([]);
    });
  });

  describe('tasks ordering', () => {
    it('lists pending tasks first, newest first', async () => {
      // Arrange
      const { store } = setup([
        aTask({ id: 'done', completed: true, createdAt: 9 }),
        aTask({ id: 'old', createdAt: 1 }),
        aTask({ id: 'new', createdAt: 2 }),
      ]);

      // Act
      await store.load();

      // Assert
      expect(store.tasks().map((task) => task.id)).toEqual(['new', 'old', 'done']);
    });
  });

  describe('add', () => {
    it('creates a pending task with the generated id and the current time', async () => {
      // Arrange
      const { store } = setup([]);
      await store.load();

      // Act
      const task = await store.add({ title: ' Buy milk ', categoryId: 'c1' });

      // Assert
      expect(task).toEqual({
        id: 'id-1',
        title: 'Buy milk',
        completed: false,
        categoryId: 'c1',
        createdAt: NOW,
      });
      expect(store.tasks()).toEqual([task]);
    });

    it('persists the new list', async () => {
      // Arrange
      const { store, repository } = setup([]);
      await store.load();

      // Act
      await store.add({ title: 'A', categoryId: null });

      // Assert
      expect(repository.tasks.map((task) => task.title)).toEqual(['A']);
    });

    it('rolls back and rethrows when persisting fails', async () => {
      // Arrange
      const { store, repository } = setup([]);
      await store.load();
      repository.failNextSaveWith = new Error('disk full');

      // Act
      const result = store.add({ title: 'A', categoryId: null });

      // Assert
      await expect(result).rejects.toThrow('disk full');
      expect(store.tasks()).toEqual([]);
      expect(repository.tasks).toEqual([]);
    });
  });

  describe('update', () => {
    it('changes title and category and persists', async () => {
      // Arrange
      const { store, repository } = setup([aTask({ id: 'a', title: 'Old' })]);
      await store.load();

      // Act
      await store.update('a', { title: ' New ', categoryId: 'c1' });

      // Assert
      expect(store.tasks()[0]).toMatchObject({ title: 'New', categoryId: 'c1' });
      expect(repository.tasks[0]).toMatchObject({ title: 'New', categoryId: 'c1' });
    });

    it('rolls back when persisting fails', async () => {
      // Arrange
      const { store, repository } = setup([aTask({ id: 'a', title: 'Old' })]);
      await store.load();
      repository.failNextSaveWith = new Error('boom');

      // Act
      const result = store.update('a', { title: 'New', categoryId: null });

      // Assert
      await expect(result).rejects.toThrow('boom');
      expect(store.tasks()[0].title).toBe('Old');
    });
  });

  describe('toggle', () => {
    it('flips completion and persists', async () => {
      // Arrange
      const { store, repository } = setup([aTask({ id: 'a' })]);
      await store.load();

      // Act
      await store.toggle('a');

      // Assert
      expect(store.tasks()[0].completed).toBe(true);
      expect(repository.tasks[0].completed).toBe(true);
    });

    it('rolls back when persisting fails', async () => {
      // Arrange
      const { store, repository } = setup([aTask({ id: 'a' })]);
      await store.load();
      repository.failNextSaveWith = new Error('boom');

      // Act
      const result = store.toggle('a');

      // Assert
      await expect(result).rejects.toThrow('boom');
      expect(store.tasks()[0].completed).toBe(false);
    });
  });

  describe('remove and restore', () => {
    it('removes the task, persists, and returns a snapshot', async () => {
      // Arrange
      const { store, repository } = setup([aTask({ id: 'a' }), aTask({ id: 'b' })]);
      await store.load();

      // Act
      const removed = await store.remove('b');

      // Assert
      expect(removed).toEqual({ task: aTask({ id: 'b' }), index: 1 });
      expect(store.tasks().map((task) => task.id)).toEqual(['a']);
      expect(repository.tasks.map((task) => task.id)).toEqual(['a']);
    });

    it('returns null and persists nothing for an unknown id', async () => {
      // Arrange
      const { store, repository } = setup([aTask({ id: 'a' })]);
      await store.load();

      // Act
      const removed = await store.remove('missing');

      // Assert
      expect(removed).toBeNull();
      expect(repository.saveCount).toBe(0);
    });

    it('puts the task back where it was (undo round trip)', async () => {
      // Arrange
      const initial = [aTask({ id: 'a' }), aTask({ id: 'b' }), aTask({ id: 'c' })];
      const { store, repository } = setup(initial);
      await store.load();
      const removed = await store.remove('b');

      // Act
      await store.restore(removed!);

      // Assert
      expect(repository.tasks).toEqual(initial);
      expect(store.tasks()).toHaveLength(3);
    });

    it('rolls back a failed removal', async () => {
      // Arrange
      const { store, repository } = setup([aTask({ id: 'a' })]);
      await store.load();
      repository.failNextSaveWith = new Error('boom');

      // Act
      const result = store.remove('a');

      // Assert
      await expect(result).rejects.toThrow('boom');
      expect(store.tasks()).toHaveLength(1);
    });

    it('rolls back a failed restore', async () => {
      // Arrange
      const { store, repository } = setup([aTask({ id: 'a' })]);
      await store.load();
      const removed = await store.remove('a');
      repository.failNextSaveWith = new Error('boom');

      // Act
      const result = store.restore(removed!);

      // Assert
      await expect(result).rejects.toThrow('boom');
      expect(store.tasks()).toEqual([]);
    });
  });

  describe('unassignCategory', () => {
    it('moves the category tasks to uncategorized and persists', async () => {
      // Arrange
      const { store, repository } = setup([
        aTask({ id: 'a', categoryId: 'c1' }),
        aTask({ id: 'b', categoryId: 'c2' }),
      ]);
      await store.load();

      // Act
      await store.unassignCategory('c1');

      // Assert
      expect(repository.tasks.map((task) => task.categoryId)).toEqual([null, 'c2']);
      expect(store.tasks().find((task) => task.id === 'a')?.categoryId).toBeNull();
    });

    it('does not persist when no task used the category', async () => {
      // Arrange
      const { store, repository } = setup([aTask({ id: 'a', categoryId: 'c2' })]);
      await store.load();

      // Act
      await store.unassignCategory('c1');

      // Assert
      expect(repository.saveCount).toBe(0);
    });
  });
});
