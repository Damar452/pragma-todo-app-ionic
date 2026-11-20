import type { Task } from './task.model';

/** Tasks of `categoryId` become uncategorized (used when that category is deleted). */
export function unassignCategory(tasks: readonly Task[], categoryId: string): readonly Task[] {
  return tasks.map((task) =>
    task.categoryId === categoryId ? { ...task, categoryId: null } : task,
  );
}
