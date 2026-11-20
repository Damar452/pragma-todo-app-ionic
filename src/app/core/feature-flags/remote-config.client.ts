import type { FeatureFlagKey, FeatureFlagValues } from './feature-flags';
import type { RemoteConfigSettings } from './feature-flags.models';

/**
 * Thin seam over the Remote Config SDK so the adapter (and its specs) never
 * touch the network. Booleans only: that is all the flags need.
 */
export abstract class RemoteConfigClient {
  /** Prepares the SDK with in-app defaults. Safe to call twice; rejects when unsupported. */
  abstract init(
    defaults: FeatureFlagValues,
    settings: Pick<RemoteConfigSettings, 'minimumFetchIntervalMillis'>,
  ): Promise<void>;
  /** Fetches from the backend and activates the result. */
  abstract fetchAndActivate(): Promise<boolean>;
  /** Activates values already fetched (used after a realtime update). */
  abstract activate(): Promise<boolean>;
  abstract getBoolean(key: FeatureFlagKey): boolean;
  /** Listens for server-side publishes; returns the unsubscribe function. */
  abstract onUpdate(listener: () => void): () => void;
}
