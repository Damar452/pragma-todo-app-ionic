import { EMPTY_CATEGORY_TASK_STATS } from './category-task-stats.constants';
import type { CategoryTaskStats } from './category-task-stats.model';

/**
 * The only task fields the count needs. Declared structurally because a feature's
 * domain may not import another feature's domain (see eslint boundaries).
 */
export interface CategorizedTask {
  readonly categoryId: string | null;
  readonly completed: boolean;
}

/** Total and completed tasks per category id. Uncategorized tasks are ignored. */
export function countTasksByCategory(
  tasks: readonly CategorizedTask[],
): ReadonlyMap<string, CategoryTaskStats> {
  const stats = new Map<string, CategoryTaskStats>();
  for (const { categoryId, completed } of tasks) {
    if (categoryId !== null) {
      const current = stats.get(categoryId) ?? EMPTY_CATEGORY_TASK_STATS;
      stats.set(categoryId, {
        total: current.total + 1,
        completed: current.completed + (completed ? 1 : 0),
      });
    }
  }
  return stats;
}
