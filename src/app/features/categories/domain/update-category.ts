import type { CategoryDraft } from './category-draft.model';
import type { Category } from './category.model';

/** Applies `draft` to the category with `id`; other categories are untouched. */
export function updateCategory(
  categories: readonly Category[],
  id: string,
  draft: CategoryDraft,
): readonly Category[] {
  return categories.map((category) =>
    category.id === id ? { ...category, name: draft.name.trim(), color: draft.color } : category,
  );
}
