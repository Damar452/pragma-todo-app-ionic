import { aTask } from './task-fixture.testing';
import { toggleTask } from './toggle-task';

describe('toggleTask', () => {
  it('completes a pending task', () => {
    // Arrange
    const tasks = [aTask({ id: 'a', completed: false })];

    // Act
    const result = toggleTask(tasks, 'a');

    // Assert
    expect(result[0].completed).toBe(true);
  });

  it('reopens a completed task', () => {
    // Arrange
    const tasks = [aTask({ id: 'a', completed: true })];

    // Act
    const result = toggleTask(tasks, 'a');

    // Assert
    expect(result[0].completed).toBe(false);
  });

  it('does not touch other tasks', () => {
    // Arrange
    const tasks = [aTask({ id: 'a' }), aTask({ id: 'b' })];

    // Act
    const result = toggleTask(tasks, 'a');

    // Assert
    expect(result[1]).toBe(tasks[1]);
  });
});
