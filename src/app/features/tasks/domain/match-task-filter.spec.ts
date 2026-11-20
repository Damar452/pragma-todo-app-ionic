import { matchTaskFilter } from './match-task-filter';
import { TaskFilterKind } from './task-filter.enums';
import type { TaskFilter, TaskFilterHandlers } from './task-filter.model';

const HANDLERS: TaskFilterHandlers<string> = {
  [TaskFilterKind.All]: () => 'all',
  [TaskFilterKind.Uncategorized]: () => 'none',
  [TaskFilterKind.Category]: (filter) => `category:${filter.categoryId}`,
};

describe('matchTaskFilter', () => {
  it.each<[TaskFilter, string]>([
    [{ kind: TaskFilterKind.All }, 'all'],
    [{ kind: TaskFilterKind.Uncategorized }, 'none'],
    [{ kind: TaskFilterKind.Category, categoryId: 'c1' }, 'category:c1'],
  ])('dispatches %j to its handler', (filter, expected) => {
    // Arrange / Act
    const result = matchTaskFilter(filter, HANDLERS);

    // Assert
    expect(result).toBe(expected);
  });
});
