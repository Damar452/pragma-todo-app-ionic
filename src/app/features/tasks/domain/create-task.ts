import type { TaskDraft } from './task-draft.model';
import type { TaskMeta } from './task-meta.model';
import type { Task } from './task.model';

/** A new, pending task from the form draft plus the id and time supplied by the caller. */
export function createTask(draft: TaskDraft, meta: TaskMeta): Task {
  return {
    id: meta.id,
    title: draft.title.trim(),
    completed: false,
    categoryId: draft.categoryId,
    createdAt: meta.now,
  };
}
