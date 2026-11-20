import { countTasksByCategory } from './count-tasks-by-category';

describe('countTasksByCategory', () => {
  it('counts total and completed tasks per category', () => {
    // Arrange
    const tasks = [
      { categoryId: 'c1', completed: true },
      { categoryId: 'c1', completed: false },
      { categoryId: 'c2', completed: true },
    ];

    // Act
    const result = countTasksByCategory(tasks);

    // Assert
    expect(result.get('c1')).toEqual({ total: 2, completed: 1 });
    expect(result.get('c2')).toEqual({ total: 1, completed: 1 });
  });

  it('ignores uncategorized tasks', () => {
    // Arrange
    const tasks = [{ categoryId: null, completed: true }];

    // Act
    const result = countTasksByCategory(tasks);

    // Assert
    expect(result.size).toBe(0);
  });

  it('returns an empty map without tasks', () => {
    // Arrange / Act
    const result = countTasksByCategory([]);

    // Assert
    expect(result.size).toBe(0);
  });
});
