import type { Task } from './task.model';

/** A removed task and where it sat in the collection, enough to put it back (undo). */
export interface RemovedTask {
  readonly task: Task;
  readonly index: number;
}
