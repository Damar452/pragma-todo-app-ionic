import type { RemovedTask } from './removed-task.model';
import type { Task } from './task.model';

/** Snapshot (task + index) of the task with `id`, taken before removing it; `null` if absent. */
export function findRemovedTask(tasks: readonly Task[], id: string): RemovedTask | null {
  const index = tasks.findIndex((task) => task.id === id);
  return index === -1 ? null : { task: tasks[index], index };
}
