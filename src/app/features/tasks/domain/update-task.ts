import type { TaskDraft } from './task-draft.model';
import type { Task } from './task.model';

/** Applies `draft` (title and category) to the task with `id`; other tasks are untouched. */
export function updateTask(tasks: readonly Task[], id: string, draft: TaskDraft): readonly Task[] {
  return tasks.map((task) =>
    task.id === id ? { ...task, title: draft.title.trim(), categoryId: draft.categoryId } : task,
  );
}
