import { TestBed } from '@angular/core/testing';

import { FeatureFlagPort } from './feature-flag.port';
import { FeatureFlag } from './feature-flags.enums';
import { FEATURE_FLAGS_CONFIG } from './feature-flags.tokens';
import { FirebaseFeatureFlagAdapter } from './firebase-feature-flag.adapter';
import { RemoteConfigClient } from './remote-config.client';
import { FakeRemoteConfigClient } from './testing/fake-remote-config.client';

function setup() {
  const client = new FakeRemoteConfigClient();
  TestBed.configureTestingModule({
    providers: [
      { provide: RemoteConfigClient, useValue: client },
      {
        provide: FEATURE_FLAGS_CONFIG,
        useValue: {
          firebase: {},
          remoteConfig: { minimumFetchIntervalMillis: 0, initTimeoutMs: 1 },
        },
      },
      { provide: FeatureFlagPort, useClass: FirebaseFeatureFlagAdapter },
    ],
  });
  const adapter = TestBed.inject(FeatureFlagPort);
  return { client, adapter, flag: adapter.isEnabled(FeatureFlag.CategoriesEnabled) };
}

describe('FirebaseFeatureFlagAdapter', () => {
  beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => undefined));
  afterEach(() => vi.restoreAllMocks());

  it('serves the local defaults before anything is fetched', () => {
    // Arrange / Act
    const { flag } = setup();

    // Assert
    expect(flag()).toBe(true);
  });

  it('takes the fetched values after init', async () => {
    // Arrange
    const { client, adapter, flag } = setup();
    client.published = { [FeatureFlag.CategoriesEnabled]: false };

    // Act
    await adapter.init();

    // Assert
    expect(flag()).toBe(false);
  });

  it('flips the signal when a realtime update is published', async () => {
    // Arrange
    const { client, adapter, flag } = setup();
    await adapter.init();

    // Act
    client.publish(FeatureFlag.CategoriesEnabled, false);
    await vi.waitFor(() => expect(flag()).toBe(false));

    // Assert
    expect(flag()).toBe(false);
  });

  it('refresh fetches again and updates the signal', async () => {
    // Arrange
    const { client, adapter, flag } = setup();
    await adapter.init();
    client.published = { [FeatureFlag.CategoriesEnabled]: false };

    // Act
    await adapter.refresh();

    // Assert
    expect(flag()).toBe(false);
  });

  it('keeps the defaults when the fetch fails', async () => {
    // Arrange
    const { client, adapter, flag } = setup();
    client.failFetchWith = new Error('offline');

    // Act
    await adapter.init();

    // Assert
    expect(flag()).toBe(true);
  });

  it('keeps the last values when a later refresh fails', async () => {
    // Arrange
    const { client, adapter, flag } = setup();
    client.published = { [FeatureFlag.CategoriesEnabled]: false };
    await adapter.init();
    client.failFetchWith = new Error('offline');

    // Act
    await adapter.refresh();

    // Assert
    expect(flag()).toBe(false);
  });

  it('never throws when the SDK is unavailable', async () => {
    // Arrange
    const { client, adapter, flag } = setup();
    client.failInitWith = new Error('unsupported');

    // Act
    const result = adapter.init();

    // Assert
    await expect(result).resolves.toBeUndefined();
    await expect(adapter.refresh()).resolves.toBeUndefined();
    expect(flag()).toBe(true);
  });
});
