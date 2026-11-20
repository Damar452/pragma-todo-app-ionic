import { CategoryTaskCleanup } from '@features/categories/state/category-task-cleanup';

/**
 * Fake `CategoryTaskCleanup` for the categories store spec: records which
 * categories tasks were told to drop. Provide it with
 * `{ provide: CategoryTaskCleanup, useClass: FakeCategoryTaskCleanup }`.
 */
export class FakeCategoryTaskCleanup extends CategoryTaskCleanup {
  readonly unassignedCategoryIds: string[] = [];
  /** When set, the next `unassignCategory` rejects with it, then the fake recovers. */
  failNextUnassignWith: Error | null = null;

  override unassignCategory(categoryId: string): Promise<void> {
    const failure = this.failNextUnassignWith;
    if (failure) {
      this.failNextUnassignWith = null;
      return Promise.reject(failure);
    }
    this.unassignedCategoryIds.push(categoryId);
    return Promise.resolve();
  }
}
