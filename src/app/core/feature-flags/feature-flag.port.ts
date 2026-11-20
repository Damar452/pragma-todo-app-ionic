import type { Signal } from '@angular/core';

import type { FeatureFlagKey } from './feature-flags';

/**
 * Port for remote feature flags. The app reads flags as signals so the UI
 * reacts when they change; the adapter (Firebase Remote Config) is swappable
 * and tests use a fake. Abstract class (not interface) so it doubles as the
 * DI token.
 */
export abstract class FeatureFlagPort {
  /** Loads cached values and fetches fresh ones. Must never block app start. */
  abstract init(): Promise<void>;
  /** Fetches and activates the latest values (e.g. on app resume). */
  abstract refresh(): Promise<void>;
  abstract isEnabled(key: FeatureFlagKey): Signal<boolean>;
}
