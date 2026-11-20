import type { Task } from './task.model';

/** A new collection without the task with `id`. */
export function removeTask(tasks: readonly Task[], id: string): readonly Task[] {
  return tasks.filter((task) => task.id !== id);
}
