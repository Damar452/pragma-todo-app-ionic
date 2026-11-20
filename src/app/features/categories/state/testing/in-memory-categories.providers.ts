import type { Provider } from '@angular/core';

import { CategoryRepository } from '@features/categories/data/category.repository';
import { InMemoryCategoryRepository } from '@features/categories/data/testing/in-memory-category.repository';
import type { Category } from '@features/categories/domain/category.model';
import { provideCategoriesState } from '@features/categories/state/provide-categories-state';

/**
 * Binds `CategoryRepository` to an in-memory fake and the categories state contract to its store for page specs (pages may not
 * import `data`). Returns the fake too, to seed failures or inspect what was persisted.
 */
export function provideInMemoryCategories(initial: readonly Category[] = []): {
  repository: InMemoryCategoryRepository;
  providers: Provider[];
} {
  const repository = new InMemoryCategoryRepository(initial);
  const providers: Provider[] = [
    { provide: CategoryRepository, useValue: repository },
    ...provideCategoriesState(),
  ];
  return { repository, providers };
}
