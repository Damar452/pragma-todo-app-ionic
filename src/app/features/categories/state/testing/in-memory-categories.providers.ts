import type { Provider } from '@angular/core';

import { CategoryRepository } from '../../data/category.repository';
import { InMemoryCategoryRepository } from '../../data/testing/in-memory-category.repository';
import type { Category } from '../../domain/category.model';

/**
 * Binds `CategoryRepository` to an in-memory fake for page specs (pages may not
 * import `data`). Returns the fake too, to seed failures or inspect what was persisted.
 */
export function provideInMemoryCategories(initial: readonly Category[] = []): {
  repository: InMemoryCategoryRepository;
  providers: Provider[];
} {
  const repository = new InMemoryCategoryRepository(initial);
  const providers: Provider[] = [{ provide: CategoryRepository, useValue: repository }];
  return { repository, providers };
}
