import { isTask, parseTasks } from './parse-tasks';
import { aTask } from './task-fixture.testing';

describe('isTask', () => {
  it('accepts a well-formed task', () => {
    // Arrange / Act / Assert
    expect(isTask(aTask({ categoryId: 'c1' }))).toBe(true);
  });

  it('accepts a null category', () => {
    // Arrange / Act / Assert
    expect(isTask(aTask({ categoryId: null }))).toBe(true);
  });

  it.each([
    ['null', null],
    ['a string', 'task'],
    ['a missing title', { id: 'a', completed: false, categoryId: null, createdAt: 1 }],
    ['a non-boolean completed', { ...aTask(), completed: 'yes' }],
    ['an undefined category', { id: 'a', title: 'T', completed: false, createdAt: 1 }],
    ['a non-finite createdAt', { ...aTask(), createdAt: Number.NaN }],
  ])('rejects %s', (_label, value) => {
    // Arrange / Act / Assert
    expect(isTask(value)).toBe(false);
  });
});

describe('parseTasks', () => {
  it('returns the valid tasks of a stored array', () => {
    // Arrange
    const stored = [aTask({ id: 'a' }), aTask({ id: 'b' })];

    // Act
    const result = parseTasks(stored);

    // Assert
    expect(result).toEqual(stored);
  });

  it('drops invalid items', () => {
    // Arrange
    const stored = [aTask({ id: 'a' }), { id: 'broken' }, null];

    // Act
    const result = parseTasks(stored);

    // Assert
    expect(result.map((task) => task.id)).toEqual(['a']);
  });

  it.each([null, undefined, 'text', 42, { length: 1 }])('returns [] for %s', (stored) => {
    // Arrange / Act
    const result = parseTasks(stored);

    // Assert
    expect(result).toEqual([]);
  });
});
