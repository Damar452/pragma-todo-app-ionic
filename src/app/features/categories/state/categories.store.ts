import type { Signal } from '@angular/core';

import type { LoadStatus } from '@core/state/load-status.enums';
import type { CategoryDraft } from '@features/categories/domain/category-draft.model';
import type { Category } from '@features/categories/domain/category.model';

/**
 * Contract and DI token of the categories state. Consumers depend on this
 * class; `provideCategoriesState()` binds the implementation.
 */
export abstract class CategoriesStore {
  abstract readonly status: Signal<LoadStatus>;
  /** Ordered by name using the app locale's collation. */
  abstract readonly categories: Signal<readonly Category[]>;

  /** Reads persisted categories. Never throws: a failed read leaves an empty list and `Error` status. */
  abstract load(): Promise<void>;

  abstract add(draft: CategoryDraft): Promise<Category>;

  abstract update(id: string, draft: CategoryDraft): Promise<void>;

  /** Deletes the category and moves its tasks to "uncategorized"; if that fails, the category comes back. */
  abstract remove(id: string): Promise<void>;

  /** Whether another category already uses this name (case/accent-insensitive). */
  abstract isNameTaken(name: string, exceptId?: string): boolean;
}
