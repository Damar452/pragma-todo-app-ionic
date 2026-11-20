import { Injectable, inject } from '@angular/core';

import { CATEGORIES_STORAGE_KEY } from './category-storage.constants';
import { CategoryRepository } from './category.repository';

import { KeyValueStorage } from '@core/storage/key-value-storage';
import type { Category } from '@features/categories/domain/category.model';
import { parseCategories } from '@features/categories/domain/parse-categories';

/** Stores the category list as one array under a single key; unreadable data reads as an empty list. */
@Injectable()
export class CategoryLocalRepository extends CategoryRepository {
  private readonly storage = inject(KeyValueStorage);

  override async getAll(): Promise<readonly Category[]> {
    return parseCategories(await this.storage.get<unknown>(CATEGORIES_STORAGE_KEY));
  }

  override saveAll(categories: readonly Category[]): Promise<void> {
    return this.storage.set(CATEGORIES_STORAGE_KEY, categories);
  }
}
