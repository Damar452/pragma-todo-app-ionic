import type { Provider } from '@angular/core';

import { CategoriesStore } from './categories.store';
import { SignalCategoriesStore } from './signal-categories.store';

/** Binds the categories state contract to its signal-based implementation (see `provideTasksState`). */
export function provideCategoriesState(): Provider[] {
  return [SignalCategoriesStore, { provide: CategoriesStore, useExisting: SignalCategoriesStore }];
}
