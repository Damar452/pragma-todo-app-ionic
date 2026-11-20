import type { Task } from '../../domain/task.model';
import { TaskRepository } from '../task.repository';

/** Fake `TaskRepository` for store specs: keeps the list in memory and can fail on demand. */
export class InMemoryTaskRepository extends TaskRepository {
  /** What is currently "persisted". */
  tasks: readonly Task[];
  saveCount = 0;
  /** When set, the next `saveAll` rejects with it, then the fake recovers. */
  failNextSaveWith: Error | null = null;
  /** When set, `getAll` rejects with it. */
  failLoadWith: Error | null = null;

  constructor(initial: readonly Task[] = []) {
    super();
    this.tasks = initial;
  }

  override getAll(): Promise<readonly Task[]> {
    return this.failLoadWith ? Promise.reject(this.failLoadWith) : Promise.resolve(this.tasks);
  }

  override saveAll(tasks: readonly Task[]): Promise<void> {
    const failure = this.failNextSaveWith;
    if (failure) {
      this.failNextSaveWith = null;
      return Promise.reject(failure);
    }
    this.tasks = tasks;
    this.saveCount++;
    return Promise.resolve();
  }
}
