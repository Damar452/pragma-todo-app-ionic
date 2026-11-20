import { sortTasks } from './sort-tasks';
import { aTask } from './task-fixture.testing';

describe('sortTasks', () => {
  it('puts pending tasks before completed ones', () => {
    // Arrange
    const tasks = [
      aTask({ id: 'done', completed: true, createdAt: 9 }),
      aTask({ id: 'todo', completed: false, createdAt: 1 }),
    ];

    // Act
    const result = sortTasks(tasks);

    // Assert
    expect(result.map((task) => task.id)).toEqual(['todo', 'done']);
  });

  it('orders each group by newest first', () => {
    // Arrange
    const tasks = [
      aTask({ id: 'old', createdAt: 1 }),
      aTask({ id: 'new', createdAt: 3 }),
      aTask({ id: 'done-old', completed: true, createdAt: 2 }),
      aTask({ id: 'done-new', completed: true, createdAt: 4 }),
    ];

    // Act
    const result = sortTasks(tasks);

    // Assert
    expect(result.map((task) => task.id)).toEqual(['new', 'old', 'done-new', 'done-old']);
  });

  it('does not mutate the input', () => {
    // Arrange
    const tasks = [aTask({ id: 'a', createdAt: 1 }), aTask({ id: 'b', createdAt: 2 })];

    // Act
    sortTasks(tasks);

    // Assert
    expect(tasks.map((task) => task.id)).toEqual(['a', 'b']);
  });
});
