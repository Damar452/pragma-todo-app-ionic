import { TestBed } from '@angular/core/testing';

import { TaskLocalRepository } from './task-local.repository';
import { TASKS_STORAGE_KEY } from './task-storage.constants';

import { KeyValueStorage } from '@core/storage/key-value-storage';
import { InMemoryKeyValueStorage } from '@core/storage/testing/in-memory-key-value-storage';
import { aTask } from '@features/tasks/domain/task-fixture.testing';

function setup() {
  const storage = new InMemoryKeyValueStorage();
  TestBed.configureTestingModule({
    providers: [{ provide: KeyValueStorage, useValue: storage }, TaskLocalRepository],
  });
  return { storage, repository: TestBed.inject(TaskLocalRepository) };
}

describe('TaskLocalRepository', () => {
  it('reads an empty list when nothing is stored', async () => {
    // Arrange
    const { repository } = setup();

    // Act
    const tasks = await repository.getAll();

    // Assert
    expect(tasks).toEqual([]);
  });

  it('reads back what it saved', async () => {
    // Arrange
    const { repository } = setup();
    const tasks = [aTask({ id: 'a' }), aTask({ id: 'b', completed: true })];

    // Act
    await repository.saveAll(tasks);

    // Assert
    expect(await repository.getAll()).toEqual(tasks);
  });

  it('reads an empty list when the stored value is corrupt', async () => {
    // Arrange
    const { repository, storage } = setup();
    await storage.set(TASKS_STORAGE_KEY, 'not-an-array');

    // Act
    const tasks = await repository.getAll();

    // Assert
    expect(tasks).toEqual([]);
  });

  it('skips corrupt items and keeps the valid ones', async () => {
    // Arrange
    const { repository, storage } = setup();
    await storage.set(TASKS_STORAGE_KEY, [aTask({ id: 'a' }), { id: 'broken' }]);

    // Act
    const tasks = await repository.getAll();

    // Assert
    expect(tasks.map((task) => task.id)).toEqual(['a']);
  });
});
