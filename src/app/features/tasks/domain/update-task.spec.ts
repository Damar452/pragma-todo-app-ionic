import { aTask } from './task-fixture.testing';
import { updateTask } from './update-task';

describe('updateTask', () => {
  it('applies the trimmed title and the category to the matching task only', () => {
    // Arrange
    const tasks = [aTask({ id: 'a' }), aTask({ id: 'b', title: 'Other' })];

    // Act
    const result = updateTask(tasks, 'a', { title: '  New  ', categoryId: 'c1' });

    // Assert
    expect(result[0]).toEqual({ ...tasks[0], title: 'New', categoryId: 'c1' });
    expect(result[1]).toBe(tasks[1]);
  });

  it('keeps completion and creation time', () => {
    // Arrange
    const tasks = [aTask({ id: 'a', completed: true, createdAt: 5 })];

    // Act
    const [updated] = updateTask(tasks, 'a', { title: 'X', categoryId: null });

    // Assert
    expect(updated.completed).toBe(true);
    expect(updated.createdAt).toBe(5);
  });

  it('returns the same content when the id does not exist', () => {
    // Arrange
    const tasks = [aTask({ id: 'a' })];

    // Act
    const result = updateTask(tasks, 'missing', { title: 'X', categoryId: null });

    // Assert
    expect(result).toEqual(tasks);
  });
});
