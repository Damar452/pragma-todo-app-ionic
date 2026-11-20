import type { Task } from './task.model';

/** How many of `tasks` are completed. */
export function countCompletedTasks(tasks: readonly Task[]): number {
  return tasks.filter((task) => task.completed).length;
}
