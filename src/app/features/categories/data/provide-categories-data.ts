import type { Provider } from '@angular/core';

import { CategoryLocalRepository } from './category-local.repository';
import { CategoryRepository } from './category.repository';

/** Binds the category persistence contract to its local-storage implementation. */
export function provideCategoriesData(): Provider[] {
  return [{ provide: CategoryRepository, useClass: CategoryLocalRepository }];
}
