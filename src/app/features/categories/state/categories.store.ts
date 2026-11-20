import { Injectable, LOCALE_ID, computed, inject, signal } from '@angular/core';

import { ID_GENERATOR } from '@core/runtime/id-generator';
import { LoadStatus } from '@core/state/load-status.enums';
import { CategoryRepository } from '@features/categories/data/category.repository';
import type { CategoryDraft } from '@features/categories/domain/category-draft.model';
import type { Category } from '@features/categories/domain/category.model';
import { createCategory } from '@features/categories/domain/create-category';
import { isCategoryNameTaken } from '@features/categories/domain/is-category-name-taken';
import { removeCategory } from '@features/categories/domain/remove-category';
import { sortCategories } from '@features/categories/domain/sort-categories';
import { updateCategory } from '@features/categories/domain/update-category';
import { TasksStore } from '@features/tasks/state/tasks.store';

/**
 * Single source of truth for categories. Same flow as TasksStore: optimistic
 * publish, persist, roll back and rethrow on failure. Deleting a category
 * also sends its tasks to "uncategorized" through TasksStore.
 */
@Injectable({ providedIn: 'root' })
export class CategoriesStore {
  private readonly repository = inject(CategoryRepository);
  private readonly tasksStore = inject(TasksStore);
  private readonly generateId = inject(ID_GENERATOR);
  private readonly locale = inject(LOCALE_ID);

  private readonly _categories = signal<readonly Category[]>([]);
  private readonly _status = signal<LoadStatus>(LoadStatus.Idle);

  readonly status = this._status.asReadonly();
  /** Ordered by name using the app locale's collation. */
  readonly categories = computed(() => sortCategories(this._categories(), this.locale));

  /** Reads persisted categories. Never throws: a failed read leaves an empty list and `Error` status. */
  async load(): Promise<void> {
    this._status.set(LoadStatus.Loading);
    try {
      this._categories.set(await this.repository.getAll());
      this._status.set(LoadStatus.Ready);
    } catch {
      this._categories.set([]);
      this._status.set(LoadStatus.Error);
    }
  }

  async add(draft: CategoryDraft): Promise<Category> {
    const category = createCategory(draft, { id: this.generateId() });
    await this.commit([...this._categories(), category]);
    return category;
  }

  update(id: string, draft: CategoryDraft): Promise<void> {
    return this.commit(updateCategory(this._categories(), id, draft));
  }

  /** Deletes the category and moves its tasks to "uncategorized"; if that fails, the category comes back. */
  async remove(id: string): Promise<void> {
    const previous = this._categories();
    await this.commit(removeCategory(previous, id));
    try {
      await this.tasksStore.unassignCategory(id);
    } catch (error) {
      await this.commit(previous).catch(() => undefined);
      throw error;
    }
  }

  /** Whether another category already uses this name (case/accent-insensitive). */
  isNameTaken(name: string, exceptId?: string): boolean {
    return isCategoryNameTaken(this._categories(), name, exceptId);
  }

  private async commit(next: readonly Category[]): Promise<void> {
    const previous = this._categories();
    this._categories.set(next);
    try {
      await this.repository.saveAll(next);
    } catch (error) {
      if (this._categories() === next) {
        this._categories.set(previous);
      }
      throw error;
    }
  }
}
