import type { Task } from './task.model';

/** Builds a task for specs; override only what the test cares about. */
export function aTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 't1',
    title: 'Task',
    completed: false,
    categoryId: null,
    createdAt: 1,
    ...overrides,
  };
}
