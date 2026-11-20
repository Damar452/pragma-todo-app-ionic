import type { Task } from './task.model';

type TaskComparator = (a: Task, b: Task) => number;

/** Tie-breakers applied in order: the first comparator that returns non-zero decides. */
const TASK_COMPARATORS: readonly TaskComparator[] = [
  (a, b) => Number(a.completed) - Number(b.completed),
  (a, b) => b.createdAt - a.createdAt,
];

const compareTasks: TaskComparator = (a, b) =>
  TASK_COMPARATORS.reduce((result, compare) => result || compare(a, b), 0);

/** Pending tasks first, then completed; newest first inside each group. Returns a new array. */
export function sortTasks(tasks: readonly Task[]): readonly Task[] {
  return [...tasks].sort(compareTasks);
}
