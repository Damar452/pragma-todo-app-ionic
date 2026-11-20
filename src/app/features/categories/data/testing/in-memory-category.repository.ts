import type { Category } from '../../domain/category.model';
import { CategoryRepository } from '../category.repository';

/** Fake `CategoryRepository` for store specs: keeps the list in memory and can fail on demand. */
export class InMemoryCategoryRepository extends CategoryRepository {
  /** What is currently "persisted". */
  categories: readonly Category[];
  saveCount = 0;
  /** When set, the next `saveAll` rejects with it, then the fake recovers. */
  failNextSaveWith: Error | null = null;
  /** When set, `getAll` rejects with it. */
  failLoadWith: Error | null = null;

  constructor(initial: readonly Category[] = []) {
    super();
    this.categories = initial;
  }

  override getAll(): Promise<readonly Category[]> {
    return this.failLoadWith ? Promise.reject(this.failLoadWith) : Promise.resolve(this.categories);
  }

  override saveAll(categories: readonly Category[]): Promise<void> {
    const failure = this.failNextSaveWith;
    if (failure) {
      this.failNextSaveWith = null;
      return Promise.reject(failure);
    }
    this.categories = categories;
    this.saveCount++;
    return Promise.resolve();
  }
}
