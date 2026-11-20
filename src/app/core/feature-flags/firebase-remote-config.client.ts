import { Injectable, inject } from '@angular/core';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  type RemoteConfig,
  activate,
  fetchAndActivate,
  getBoolean,
  getRemoteConfig,
  isSupported,
  onConfigUpdate,
} from 'firebase/remote-config';

import type { FeatureFlagKey, FeatureFlagValues } from './feature-flags';
import { FEATURE_FLAG_LOG } from './feature-flags.constants';
import type { RemoteConfigSettings } from './feature-flags.models';
import { FEATURE_FLAGS_CONFIG } from './feature-flags.tokens';
import { RemoteConfigClient } from './remote-config.client';

/** Firebase JS SDK (modular) implementation. Initializes the Firebase app once, on first `init()`. */
@Injectable()
export class FirebaseRemoteConfigClient extends RemoteConfigClient {
  private readonly config = inject(FEATURE_FLAGS_CONFIG);
  private remoteConfig: RemoteConfig | null = null;

  override async init(
    defaults: FeatureFlagValues,
    settings: Pick<RemoteConfigSettings, 'minimumFetchIntervalMillis'>,
  ): Promise<void> {
    if (this.remoteConfig) {
      return;
    }
    if (!(await isSupported())) {
      throw new Error(FEATURE_FLAG_LOG.unsupported);
    }
    const app = getApps().length > 0 ? getApp() : initializeApp(this.config.firebase);
    const remoteConfig = getRemoteConfig(app);
    remoteConfig.settings.minimumFetchIntervalMillis = settings.minimumFetchIntervalMillis;
    remoteConfig.defaultConfig = defaults;
    this.remoteConfig = remoteConfig;
  }

  override fetchAndActivate(): Promise<boolean> {
    return fetchAndActivate(this.ready());
  }

  override activate(): Promise<boolean> {
    return activate(this.ready());
  }

  override getBoolean(key: FeatureFlagKey): boolean {
    return getBoolean(this.ready(), key);
  }

  override onUpdate(listener: () => void): () => void {
    return onConfigUpdate(this.ready(), {
      next: listener,
      error: (error) => console.error(FEATURE_FLAG_LOG.realtime, error),
      complete: () => undefined,
    });
  }

  private ready(): RemoteConfig {
    if (!this.remoteConfig) {
      throw new Error(FEATURE_FLAG_LOG.init);
    }
    return this.remoteConfig;
  }
}
