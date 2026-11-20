import type { Task } from './task.model';

/** Flips the completion of the task with `id`. */
export function toggleTask(tasks: readonly Task[], id: string): readonly Task[] {
  return tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task));
}
