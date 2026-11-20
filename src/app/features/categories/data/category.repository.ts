import type { Category } from '@features/categories/domain/category.model';

/**
 * Persistence contract for categories. Abstract class (not interface) so it
 * doubles as the Angular DI token.
 */
export abstract class CategoryRepository {
  abstract getAll(): Promise<readonly Category[]>;
  abstract saveAll(categories: readonly Category[]): Promise<void>;
}
