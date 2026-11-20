import type { Category } from './category.model';

import { normalizeText } from '@shared/utils/string/normalize-text';

/**
 * Whether another category already uses `name` (ignoring case, accents and surrounding spaces).
 * Pass `exceptId` when editing so a category does not clash with itself.
 */
export function isCategoryNameTaken(
  categories: readonly Category[],
  name: string,
  exceptId?: string,
): boolean {
  const wanted = normalizeText(name);
  return categories.some(
    (category) => category.id !== exceptId && normalizeText(category.name) === wanted,
  );
}
