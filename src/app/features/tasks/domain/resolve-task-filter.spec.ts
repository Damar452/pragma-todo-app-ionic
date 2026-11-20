import { resolveTaskFilter } from './resolve-task-filter';
import { TaskFilterKind } from './task-filter.enums';

describe('resolveTaskFilter', () => {
  it('keeps a category filter whose category exists', () => {
    // Arrange
    const filter = { kind: TaskFilterKind.Category, categoryId: 'c1' } as const;

    // Act
    const result = resolveTaskFilter(filter, ['c1', 'c2']);

    // Assert
    expect(result).toBe(filter);
  });

  it('falls back to "all" when the category no longer exists', () => {
    // Arrange
    const filter = { kind: TaskFilterKind.Category, categoryId: 'gone' } as const;

    // Act
    const result = resolveTaskFilter(filter, ['c1']);

    // Assert
    expect(result).toEqual({ kind: TaskFilterKind.All });
  });

  it.each([{ kind: TaskFilterKind.All }, { kind: TaskFilterKind.Uncategorized }] as const)(
    'keeps the $kind filter as is',
    (filter) => {
      // Arrange / Act
      const result = resolveTaskFilter(filter, []);

      // Assert
      expect(result).toBe(filter);
    },
  );
});
