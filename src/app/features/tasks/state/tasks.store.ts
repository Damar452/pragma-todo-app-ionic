import { Injectable, computed, inject, signal } from '@angular/core';

import { TaskRepository } from '../data/task.repository';
import { createTask } from '../domain/create-task';
import { findRemovedTask } from '../domain/find-removed-task';
import { removeTask } from '../domain/remove-task';
import type { RemovedTask } from '../domain/removed-task.model';
import { restoreTask } from '../domain/restore-task';
import { sortTasks } from '../domain/sort-tasks';
import type { TaskDraft } from '../domain/task-draft.model';
import type { Task } from '../domain/task.model';
import { toggleTask } from '../domain/toggle-task';
import { unassignCategory } from '../domain/unassign-category';
import { updateTask } from '../domain/update-task';

import { CLOCK } from '@core/runtime/clock';
import { ID_GENERATOR } from '@core/runtime/id-generator';
import { LoadStatus } from '@core/state/load-status.enums';

/**
 * Single source of truth for tasks. Exposes read-only signals; every mutation
 * computes the next list with a pure domain function, publishes it
 * optimistically, persists it through TaskRepository and, if persisting
 * fails, restores the previous list and rethrows so the caller can report it.
 */
@Injectable({ providedIn: 'root' })
export class TasksStore {
  private readonly repository = inject(TaskRepository);
  private readonly generateId = inject(ID_GENERATOR);
  private readonly now = inject(CLOCK);

  /** Insertion order, so an undo can put a task back at its exact index. */
  private readonly _tasks = signal<readonly Task[]>([]);
  private readonly _status = signal<LoadStatus>(LoadStatus.Idle);

  readonly status = this._status.asReadonly();
  /** Pending tasks first, newest first inside each group. */
  readonly tasks = computed(() => sortTasks(this._tasks()));

  /** Reads persisted tasks. Never throws: a failed read leaves an empty list and `Error` status. */
  async load(): Promise<void> {
    this._status.set(LoadStatus.Loading);
    try {
      this._tasks.set(await this.repository.getAll());
      this._status.set(LoadStatus.Ready);
    } catch {
      this._tasks.set([]);
      this._status.set(LoadStatus.Error);
    }
  }

  async add(draft: TaskDraft): Promise<Task> {
    const task = createTask(draft, { id: this.generateId(), now: this.now() });
    await this.commit([...this._tasks(), task]);
    return task;
  }

  update(id: string, draft: TaskDraft): Promise<void> {
    return this.commit(updateTask(this._tasks(), id, draft));
  }

  toggle(id: string): Promise<void> {
    return this.commit(toggleTask(this._tasks(), id));
  }

  /** Removes a task and returns the snapshot to hand to `restore` (undo); `null` if it did not exist. */
  async remove(id: string): Promise<RemovedTask | null> {
    const removed = findRemovedTask(this._tasks(), id);
    if (removed) {
      await this.commit(removeTask(this._tasks(), id));
    }
    return removed;
  }

  restore(removed: RemovedTask): Promise<void> {
    return this.commit(restoreTask(this._tasks(), removed));
  }

  /** Used when a category is deleted: its tasks become uncategorized. */
  async unassignCategory(categoryId: string): Promise<void> {
    const next = unassignCategory(this._tasks(), categoryId);
    const changed = next.some((task, index) => task !== this._tasks()[index]);
    if (changed) {
      await this.commit(next);
    }
  }

  /**
   * Publishes `next`, then persists it. On failure the previous list comes
   * back, unless a newer mutation already replaced `next` (its own save
   * writes the whole list, so nothing is lost).
   */
  private async commit(next: readonly Task[]): Promise<void> {
    const previous = this._tasks();
    this._tasks.set(next);
    try {
      await this.repository.saveAll(next);
    } catch (error) {
      if (this._tasks() === next) {
        this._tasks.set(previous);
      }
      throw error;
    }
  }
}
