import type { Signal } from '@angular/core';

import type { LoadStatus } from '@core/state/load-status.enums';
import type { RemovedTask } from '@features/tasks/domain/removed-task.model';
import type { TaskDraft } from '@features/tasks/domain/task-draft.model';
import type { Task } from '@features/tasks/domain/task.model';

/**
 * Contract and DI token of the tasks state. Consumers depend on this class;
 * `provideTasksState()` binds the implementation. Every mutation publishes
 * optimistically, persists, and on failure restores the previous list and
 * rethrows so the caller can report it.
 */
export abstract class TasksStore {
  abstract readonly status: Signal<LoadStatus>;
  /** Pending tasks first, newest first inside each group. */
  abstract readonly tasks: Signal<readonly Task[]>;

  /** Reads persisted tasks. Never throws: a failed read leaves an empty list and `Error` status. */
  abstract load(): Promise<void>;

  abstract add(draft: TaskDraft): Promise<Task>;

  abstract update(id: string, draft: TaskDraft): Promise<void>;

  abstract toggle(id: string): Promise<void>;

  /** Removes a task and returns the snapshot to hand to `restore` (undo); `null` if it did not exist. */
  abstract remove(id: string): Promise<RemovedTask | null>;

  abstract restore(removed: RemovedTask): Promise<void>;

  /** Used when a category is deleted: its tasks become uncategorized. */
  abstract unassignCategory(categoryId: string): Promise<void>;
}
