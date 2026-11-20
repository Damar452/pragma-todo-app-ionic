/** Name of every feature flag, as published in Remote Config. */
export const FeatureFlag = {
  /** Category management: CRUD screen, category on tasks, filter by category. */
  CategoriesEnabled: 'categories_enabled',
} as const;

export type FeatureFlag = (typeof FeatureFlag)[keyof typeof FeatureFlag];
