import { restoreTask } from './restore-task';
import { aTask } from './task-fixture.testing';

describe('restoreTask', () => {
  it('re-inserts the task at its previous index', () => {
    // Arrange
    const tasks = [aTask({ id: 'a' }), aTask({ id: 'c' })];
    const removed = { task: aTask({ id: 'b' }), index: 1 };

    // Act
    const result = restoreTask(tasks, removed);

    // Assert
    expect(result.map((task) => task.id)).toEqual(['a', 'b', 'c']);
  });

  it('clamps an index past the end to the end', () => {
    // Arrange
    const tasks = [aTask({ id: 'a' })];

    // Act
    const result = restoreTask(tasks, { task: aTask({ id: 'b' }), index: 99 });

    // Assert
    expect(result.map((task) => task.id)).toEqual(['a', 'b']);
  });

  it('clamps a negative index to the start', () => {
    // Arrange
    const tasks = [aTask({ id: 'a' })];

    // Act
    const result = restoreTask(tasks, { task: aTask({ id: 'b' }), index: -3 });

    // Assert
    expect(result.map((task) => task.id)).toEqual(['b', 'a']);
  });

  it('does not duplicate a task that is already present', () => {
    // Arrange
    const tasks = [aTask({ id: 'a' })];

    // Act
    const result = restoreTask(tasks, { task: aTask({ id: 'a' }), index: 0 });

    // Assert
    expect(result).toHaveLength(1);
  });
});
