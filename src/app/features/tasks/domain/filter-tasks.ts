import { matchTaskFilter } from './match-task-filter';
import { TaskFilterKind } from './task-filter.enums';
import type { TaskFilter, TaskFilterHandlers } from './task-filter.model';
import type { Task } from './task.model';

type TaskPredicate = (task: Task) => boolean;

const TASK_FILTER_PREDICATES: TaskFilterHandlers<TaskPredicate> = {
  [TaskFilterKind.All]: () => () => true,
  [TaskFilterKind.Uncategorized]: () => (task) => task.categoryId === null,
  [TaskFilterKind.Category]: (filter) => (task) => task.categoryId === filter.categoryId,
};

/** Tasks that satisfy `filter`, keeping their original order. */
export function filterTasks(tasks: readonly Task[], filter: TaskFilter): readonly Task[] {
  return tasks.filter(matchTaskFilter(filter, TASK_FILTER_PREDICATES));
}
