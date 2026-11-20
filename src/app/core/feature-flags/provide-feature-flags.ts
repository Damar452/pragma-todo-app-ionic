import {
  type EnvironmentProviders,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';

import { FeatureFlagPort } from './feature-flag.port';
import type { FeatureFlagsConfig } from './feature-flags.models';
import { FEATURE_FLAGS_CONFIG } from './feature-flags.tokens';
import { FirebaseFeatureFlagAdapter } from './firebase-feature-flag.adapter';
import { FirebaseRemoteConfigClient } from './firebase-remote-config.client';
import { initializeFeatureFlags } from './initialize-feature-flags';
import { RemoteConfigClient } from './remote-config.client';

/** Binds the flag port to Firebase Remote Config and loads the flags at start-up (bounded by `initTimeoutMs`). */
export function provideFeatureFlags(config: FeatureFlagsConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FEATURE_FLAGS_CONFIG, useValue: config },
    { provide: RemoteConfigClient, useClass: FirebaseRemoteConfigClient },
    { provide: FeatureFlagPort, useClass: FirebaseFeatureFlagAdapter },
    provideAppInitializer(initializeFeatureFlags),
  ]);
}
