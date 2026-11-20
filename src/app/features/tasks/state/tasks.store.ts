import { Injectable, signal } from '@angular/core';

import type { Task } from '../domain/task.model';

/**
 * Single source of truth for tasks. Exposes read-only signals; all mutations
 * go through store methods, which persist via TaskRepository.
 */
@Injectable({ providedIn: 'root' })
export class TasksStore {
  private readonly _tasks = signal<readonly Task[]>([]);

  readonly tasks = this._tasks.asReadonly();
}
