import type { Category } from './category.model';

import { isRecord } from '@shared/utils/object/is-record';

/** Type guard for a persisted category: every field has the right type. */
export function isCategory(value: unknown): value is Category {
  return (
    isRecord(value) &&
    typeof value['id'] === 'string' &&
    typeof value['name'] === 'string' &&
    typeof value['color'] === 'string'
  );
}

/** Defensive parse of whatever storage returned: only the valid categories (or `[]`). */
export function parseCategories(stored: unknown): readonly Category[] {
  return Array.isArray(stored) ? stored.filter(isCategory) : [];
}
