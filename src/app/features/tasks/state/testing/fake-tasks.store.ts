/**
 * Stand-in for `TasksStore` in other features' specs (e.g. CategoriesStore),
 * which only need to know that tasks were told to drop a category.
 * Provide it with `{ provide: TasksStore, useClass: FakeTasksStore }`.
 */
export class FakeTasksStore {
  readonly unassignedCategoryIds: string[] = [];
  /** When set, the next `unassignCategory` rejects with it, then the fake recovers. */
  failNextUnassignWith: Error | null = null;

  unassignCategory(categoryId: string): Promise<void> {
    const failure = this.failNextUnassignWith;
    if (failure) {
      this.failNextUnassignWith = null;
      return Promise.reject(failure);
    }
    this.unassignedCategoryIds.push(categoryId);
    return Promise.resolve();
  }
}
