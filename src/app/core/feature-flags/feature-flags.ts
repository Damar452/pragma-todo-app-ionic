/**
 * Every feature flag the app knows about, with its local default.
 * Defaults apply until Remote Config responds, and whenever it can't (offline).
 */
export const FEATURE_FLAG_DEFAULTS = {
  /** Category management: CRUD screen, category on tasks, filter by category. */
  categories_enabled: true,
} as const satisfies Record<string, boolean>;

export type FeatureFlagKey = keyof typeof FEATURE_FLAG_DEFAULTS;
