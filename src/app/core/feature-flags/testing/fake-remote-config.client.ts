import {
  FEATURE_FLAG_DEFAULTS,
  type FeatureFlagKey,
  type FeatureFlagValues,
} from '@core/feature-flags/feature-flags';
import { RemoteConfigClient } from '@core/feature-flags/remote-config.client';

/** Fake Remote Config SDK: `published` is the backend, `active` what the app reads. */
export class FakeRemoteConfigClient extends RemoteConfigClient {
  published: FeatureFlagValues = { ...FEATURE_FLAG_DEFAULTS };
  failInitWith: Error | null = null;
  failFetchWith: Error | null = null;
  initCalls = 0;
  private active: FeatureFlagValues = { ...FEATURE_FLAG_DEFAULTS };
  private listeners = new Set<() => void>();

  override init(defaults: FeatureFlagValues): Promise<void> {
    this.initCalls++;
    if (this.failInitWith) {
      return Promise.reject(this.failInitWith);
    }
    this.active = { ...defaults };
    return Promise.resolve();
  }

  override fetchAndActivate(): Promise<boolean> {
    if (this.failFetchWith) {
      return Promise.reject(this.failFetchWith);
    }
    this.active = { ...this.published };
    return Promise.resolve(true);
  }

  override activate(): Promise<boolean> {
    this.active = { ...this.published };
    return Promise.resolve(true);
  }

  override getBoolean(key: FeatureFlagKey): boolean {
    return this.active[key];
  }

  override onUpdate(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Simulates the console publishing a new value and the realtime stream notifying the app. */
  publish(key: FeatureFlagKey, value: boolean): void {
    this.published = { ...this.published, [key]: value };
    this.listeners.forEach((listener) => listener());
  }
}
