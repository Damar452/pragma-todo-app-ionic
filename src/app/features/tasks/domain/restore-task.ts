import type { RemovedTask } from './removed-task.model';
import type { Task } from './task.model';

import { clamp } from '@shared/utils/number/clamp';

/** Puts a removed task back at its previous index (clamped); a task already present is not duplicated. */
export function restoreTask(tasks: readonly Task[], removed: RemovedTask): readonly Task[] {
  if (tasks.some((task) => task.id === removed.task.id)) {
    return tasks;
  }
  const index = clamp(removed.index, 0, tasks.length);
  return [...tasks.slice(0, index), removed.task, ...tasks.slice(index)];
}
