import type { Category } from './category.model';

/** Categories ordered by name using the collation rules of `locale` (accents and case aware). A new array. */
export function sortCategories(
  categories: readonly Category[],
  locale?: string,
): readonly Category[] {
  const collator = new Intl.Collator(locale, { sensitivity: 'base', numeric: true });
  return [...categories].sort((a, b) => collator.compare(a.name, b.name));
}
