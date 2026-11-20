import { matchTaskFilter } from './match-task-filter';
import { TaskFilterKind } from './task-filter.enums';
import type { TaskFilter, TaskFilterHandlers } from './task-filter.model';

const ALL_TASKS: TaskFilter = { kind: TaskFilterKind.All };

/** How to read a filter given which categories exist: only the category filter can go stale. */
function resolversFor(existingCategoryIds: readonly string[]): TaskFilterHandlers<TaskFilter> {
  return {
    [TaskFilterKind.All]: (filter) => filter,
    [TaskFilterKind.Uncategorized]: (filter) => filter,
    [TaskFilterKind.Category]: (filter) =>
      existingCategoryIds.includes(filter.categoryId) ? filter : ALL_TASKS,
  };
}

/** The filter to actually apply: a category filter whose category no longer exists falls back to "all". */
export function resolveTaskFilter(
  filter: TaskFilter,
  existingCategoryIds: readonly string[],
): TaskFilter {
  return matchTaskFilter(filter, resolversFor(existingCategoryIds));
}
