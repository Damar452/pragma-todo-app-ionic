import { aTask } from './task-fixture.testing';
import { unassignCategory } from './unassign-category';

describe('unassignCategory', () => {
  it('moves the tasks of the category to uncategorized', () => {
    // Arrange
    const tasks = [aTask({ id: 'a', categoryId: 'c1' }), aTask({ id: 'b', categoryId: 'c2' })];

    // Act
    const result = unassignCategory(tasks, 'c1');

    // Assert
    expect(result.map((task) => task.categoryId)).toEqual([null, 'c2']);
  });

  it('keeps untouched tasks by reference', () => {
    // Arrange
    const tasks = [aTask({ id: 'a', categoryId: 'c2' })];

    // Act
    const result = unassignCategory(tasks, 'c1');

    // Assert
    expect(result[0]).toBe(tasks[0]);
  });
});
