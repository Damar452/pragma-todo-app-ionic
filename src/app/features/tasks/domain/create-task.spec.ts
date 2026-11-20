import { createTask } from './create-task';

describe('createTask', () => {
  it('builds a pending task with the given id and creation time', () => {
    // Arrange
    const draft = { title: 'Buy milk', categoryId: 'c1' };

    // Act
    const task = createTask(draft, { id: 'abc', now: 1000 });

    // Assert
    expect(task).toEqual({
      id: 'abc',
      title: 'Buy milk',
      completed: false,
      categoryId: 'c1',
      createdAt: 1000,
    });
  });

  it('trims the title', () => {
    // Arrange / Act
    const task = createTask({ title: '  Buy milk  ', categoryId: null }, { id: 'a', now: 1 });

    // Assert
    expect(task.title).toBe('Buy milk');
  });
});
