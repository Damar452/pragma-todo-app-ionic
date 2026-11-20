import type { Category } from './category.model';

/** A new collection without the category with `id`. */
export function removeCategory(categories: readonly Category[], id: string): readonly Category[] {
  return categories.filter((category) => category.id !== id);
}
