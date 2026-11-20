import { FeatureFlag } from './feature-flags.enums';

/**
 * Local default of every feature flag.
 * Defaults apply until Remote Config responds, and whenever it can't (offline).
 */
export const FEATURE_FLAG_DEFAULTS = {
  [FeatureFlag.CategoriesEnabled]: true,
} as const satisfies Record<FeatureFlag, boolean>;

export type FeatureFlagKey = FeatureFlag;

/** Current value of every flag. */
export type FeatureFlagValues = Record<FeatureFlagKey, boolean>;

export const FEATURE_FLAG_KEYS = Object.keys(FEATURE_FLAG_DEFAULTS) as FeatureFlagKey[];
