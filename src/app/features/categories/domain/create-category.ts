import type { CategoryDraft } from './category-draft.model';
import type { CategoryMeta } from './category-meta.model';
import type { Category } from './category.model';

/** A new category from the form draft plus the id supplied by the caller. */
export function createCategory(draft: CategoryDraft, meta: CategoryMeta): Category {
  return { id: meta.id, name: draft.name.trim(), color: draft.color };
}
