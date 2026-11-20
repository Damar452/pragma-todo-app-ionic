import { Injectable, type Signal, computed, inject, signal } from '@angular/core';

import { FeatureFlagPort } from './feature-flag.port';
import { FEATURE_FLAG_DEFAULTS, FEATURE_FLAG_KEYS } from './feature-flags';
import type { FeatureFlagValues, FeatureFlagKey } from './feature-flags';
import { FEATURE_FLAG_LOG } from './feature-flags.constants';
import { FEATURE_FLAGS_CONFIG } from './feature-flags.tokens';
import { RemoteConfigClient } from './remote-config.client';

/**
 * Feature flags backed by Firebase Remote Config. Signals start at the local
 * defaults and follow the remote values once fetched or pushed. Nothing here
 * ever throws: on any failure the last known (or default) values stay.
 */
@Injectable()
export class FirebaseFeatureFlagAdapter extends FeatureFlagPort {
  private readonly client = inject(RemoteConfigClient);
  private readonly settings = inject(FEATURE_FLAGS_CONFIG).remoteConfig;

  private readonly values = signal<FeatureFlagValues>({ ...FEATURE_FLAG_DEFAULTS });
  private readonly flags = Object.fromEntries(
    FEATURE_FLAG_KEYS.map((key) => [key, computed(() => this.values()[key])]),
  ) as Record<FeatureFlagKey, Signal<boolean>>;

  private ready = false;
  private stopListening: (() => void) | null = null;

  override async init(): Promise<void> {
    try {
      await this.client.init({ ...FEATURE_FLAG_DEFAULTS }, this.settings);
      this.ready = true;
    } catch (error) {
      console.error(FEATURE_FLAG_LOG.init, error);
      return;
    }
    this.listenForUpdates();
    await this.refresh();
  }

  override async refresh(): Promise<void> {
    if (!this.ready) {
      return;
    }
    try {
      await this.client.fetchAndActivate();
    } catch (error) {
      console.error(FEATURE_FLAG_LOG.fetch, error);
    }
    this.sync();
  }

  override isEnabled(key: FeatureFlagKey): Signal<boolean> {
    return this.flags[key];
  }

  private listenForUpdates(): void {
    if (this.stopListening) {
      return;
    }
    try {
      this.stopListening = this.client.onUpdate(() => void this.applyPublishedValues());
    } catch (error) {
      console.error(FEATURE_FLAG_LOG.realtime, error);
    }
  }

  private async applyPublishedValues(): Promise<void> {
    try {
      await this.client.activate();
    } catch (error) {
      console.error(FEATURE_FLAG_LOG.realtime, error);
    }
    this.sync();
  }

  /** Copies the client's current values into the signals, one key at a time. */
  private sync(): void {
    try {
      this.values.set(
        Object.fromEntries(
          FEATURE_FLAG_KEYS.map((key) => [key, this.client.getBoolean(key)]),
        ) as FeatureFlagValues,
      );
    } catch (error) {
      console.error(FEATURE_FLAG_LOG.sync, error);
    }
  }
}
