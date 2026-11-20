import { Injectable, inject } from '@angular/core';

import { parseTasks } from '../domain/parse-tasks';
import type { Task } from '../domain/task.model';

import { TASKS_STORAGE_KEY } from './task-storage.constants';
import { TaskRepository } from './task.repository';

import { KeyValueStorage } from '@core/storage/key-value-storage';

/** Stores the task list as one array under a single key; unreadable data reads as an empty list. */
@Injectable()
export class TaskLocalRepository extends TaskRepository {
  private readonly storage = inject(KeyValueStorage);

  override async getAll(): Promise<readonly Task[]> {
    return parseTasks(await this.storage.get<unknown>(TASKS_STORAGE_KEY));
  }

  override saveAll(tasks: readonly Task[]): Promise<void> {
    return this.storage.set(TASKS_STORAGE_KEY, tasks);
  }
}
