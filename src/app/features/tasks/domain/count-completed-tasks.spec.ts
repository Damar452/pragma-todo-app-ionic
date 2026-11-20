import { countCompletedTasks } from './count-completed-tasks';
import type { Task } from './task.model';

function task(completed: boolean): Task {
  return { id: 'x', title: 'x', completed, categoryId: null, createdAt: 0 };
}

describe('countCompletedTasks', () => {
  it('counts only completed tasks', () => {
    // Arrange
    const tasks = [task(true), task(false), task(true)];

    // Act
    const result = countCompletedTasks(tasks);

    // Assert
    expect(result).toBe(2);
  });

  it('returns 0 for an empty list', () => {
    // Arrange / Act
    const result = countCompletedTasks([]);

    // Assert
    expect(result).toBe(0);
  });
});
