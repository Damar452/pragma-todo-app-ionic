import { removeTask } from './remove-task';
import { aTask } from './task-fixture.testing';

describe('removeTask', () => {
  it('returns a new array without the task', () => {
    // Arrange
    const tasks = [aTask({ id: 'a' }), aTask({ id: 'b' })];

    // Act
    const result = removeTask(tasks, 'a');

    // Assert
    expect(result.map((task) => task.id)).toEqual(['b']);
    expect(tasks).toHaveLength(2);
  });

  it('returns the same content when the id does not exist', () => {
    // Arrange
    const tasks = [aTask({ id: 'a' })];

    // Act
    const result = removeTask(tasks, 'missing');

    // Assert
    expect(result).toEqual(tasks);
  });
});
