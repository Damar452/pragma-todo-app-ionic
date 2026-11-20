import { filterTasks } from './filter-tasks';
import { TaskFilterKind } from './task-filter.enums';
import type { Task } from './task.model';

function task(id: string, categoryId: string | null): Task {
  return { id, title: id, completed: false, categoryId, createdAt: 0 };
}

const TASKS = [task('a', 'c1'), task('b', null), task('c', 'c2'), task('d', 'c1')];

describe('filterTasks', () => {
  it('keeps every task for the "all" filter', () => {
    // Arrange / Act
    const result = filterTasks(TASKS, { kind: TaskFilterKind.All });

    // Assert
    expect(result).toEqual(TASKS);
  });

  it('keeps only tasks without category for the "uncategorized" filter', () => {
    // Arrange / Act
    const result = filterTasks(TASKS, { kind: TaskFilterKind.Uncategorized });

    // Assert
    expect(result.map((t) => t.id)).toEqual(['b']);
  });

  it('keeps only tasks of the given category for the "category" filter', () => {
    // Arrange / Act
    const result = filterTasks(TASKS, { kind: TaskFilterKind.Category, categoryId: 'c1' });

    // Assert
    expect(result.map((t) => t.id)).toEqual(['a', 'd']);
  });

  it('returns nothing for a category without tasks', () => {
    // Arrange / Act
    const result = filterTasks(TASKS, { kind: TaskFilterKind.Category, categoryId: 'zzz' });

    // Assert
    expect(result).toEqual([]);
  });
});
