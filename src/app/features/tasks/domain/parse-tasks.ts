import type { Task } from './task.model';

import { isRecord } from '@shared/utils/object/is-record';

/** Type guard for a persisted task: every field has the right type. */
export function isTask(value: unknown): value is Task {
  return (
    isRecord(value) &&
    typeof value['id'] === 'string' &&
    typeof value['title'] === 'string' &&
    typeof value['completed'] === 'boolean' &&
    (value['categoryId'] === null || typeof value['categoryId'] === 'string') &&
    typeof value['createdAt'] === 'number' &&
    Number.isFinite(value['createdAt'])
  );
}

/** Defensive parse of whatever storage returned: anything that is not an array of tasks yields only the valid tasks (or `[]`). */
export function parseTasks(stored: unknown): readonly Task[] {
  return Array.isArray(stored) ? stored.filter(isTask) : [];
}
