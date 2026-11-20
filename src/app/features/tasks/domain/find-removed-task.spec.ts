import { findRemovedTask } from './find-removed-task';
import { aTask } from './task-fixture.testing';

describe('findRemovedTask', () => {
  it('returns the task with its index', () => {
    // Arrange
    const tasks = [aTask({ id: 'a' }), aTask({ id: 'b' })];

    // Act
    const result = findRemovedTask(tasks, 'b');

    // Assert
    expect(result).toEqual({ task: tasks[1], index: 1 });
  });

  it('returns null when the task does not exist', () => {
    // Arrange / Act
    const result = findRemovedTask([aTask({ id: 'a' })], 'missing');

    // Assert
    expect(result).toBeNull();
  });
});
