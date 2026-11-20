import { TaskFilterKind } from '@features/tasks/domain/task-filter.enums';
import type { TaskFilter } from '@features/tasks/domain/task-filter.model';

/** Sheet modal that fits its content (see "Sheet modals" in docs/ARCHITECTURE.md). */
export const FORM_MODAL_BREAKPOINTS: number[] = [0, 1];
export const FORM_MODAL_INITIAL_BREAKPOINT = 1;

export const INITIAL_TASK_FILTER: TaskFilter = { kind: TaskFilterKind.All };

/** Translation keys the page shows as feedback. */
export const TASK_FEEDBACK_KEYS = {
  created: 'tasks.feedback.created',
  updated: 'tasks.feedback.updated',
  deleted: 'tasks.feedback.deleted',
  error: 'feedback.error',
} as const;
