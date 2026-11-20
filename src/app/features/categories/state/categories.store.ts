import { Injectable, signal } from '@angular/core';

import type { Category } from '../domain/category.model';

/**
 * Single source of truth for categories. Exposes read-only signals; all
 * mutations go through store methods, which persist via CategoryRepository.
 */
@Injectable({ providedIn: 'root' })
export class CategoriesStore {
  private readonly _categories = signal<readonly Category[]>([]);

  readonly categories = this._categories.asReadonly();
}
