import type { FirebaseOptions } from 'firebase/app';

/** Remote Config behaviour, set per environment. */
export interface RemoteConfigSettings {
  /** Cached values younger than this are reused instead of fetched (throttle protection). */
  readonly minimumFetchIntervalMillis: number;
  /** How long app start may wait for the first fetch before showing the app with cached/default values. */
  readonly initTimeoutMs: number;
}

/** What `provideFeatureFlags()` needs from the environment. */
export interface FeatureFlagsConfig {
  readonly firebase: FirebaseOptions;
  readonly remoteConfig: RemoteConfigSettings;
}
