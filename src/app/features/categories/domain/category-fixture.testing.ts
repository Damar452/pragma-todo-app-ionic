import type { Category } from './category.model';

/** Builds a category for specs; override only what the test cares about. */
export function aCategory(overrides: Partial<Category> = {}): Category {
  return { id: 'c1', name: 'Work', color: '#4F46E5', ...overrides };
}
