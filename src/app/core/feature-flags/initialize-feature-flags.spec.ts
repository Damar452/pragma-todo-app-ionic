import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';

import { FeatureFlagPort } from './feature-flag.port';
import { FEATURE_FLAGS_CONFIG } from './feature-flags.tokens';
import { initializeFeatureFlags } from './initialize-feature-flags';

const INIT_TIMEOUT_MS = 50;

class StubFlags extends FeatureFlagPort {
  refreshes = 0;
  init = (): Promise<void> => new Promise<void>(() => undefined);
  refresh = (): Promise<void> => {
    this.refreshes++;
    return Promise.resolve();
  };
  isEnabled = (): never => {
    throw new Error('unused');
  };
}

function setup(flags = new StubFlags()) {
  const resume = new Subject<void>();
  TestBed.configureTestingModule({
    providers: [
      { provide: FeatureFlagPort, useValue: flags },
      { provide: Platform, useValue: { resume } },
      {
        provide: FEATURE_FLAGS_CONFIG,
        useValue: {
          firebase: {},
          remoteConfig: { minimumFetchIntervalMillis: 0, initTimeoutMs: INIT_TIMEOUT_MS },
        },
      },
    ],
  });
  return { flags, resume };
}

describe('initializeFeatureFlags', () => {
  it('gives up waiting after the init timeout when the fetch hangs', async () => {
    // Arrange
    setup();

    // Act
    const started = Date.now();
    await TestBed.runInInjectionContext(initializeFeatureFlags);

    // Assert
    expect(Date.now() - started).toBeLessThan(INIT_TIMEOUT_MS * 20);
  });

  it('finishes as soon as init resolves', async () => {
    // Arrange
    const flags = new StubFlags();
    flags.init = () => Promise.resolve();
    setup(flags);

    // Act
    const started = Date.now();
    await TestBed.runInInjectionContext(initializeFeatureFlags);

    // Assert
    expect(Date.now() - started).toBeLessThan(INIT_TIMEOUT_MS);
  });

  it('refreshes the flags when the app resumes', async () => {
    // Arrange
    const { flags, resume } = setup();
    await TestBed.runInInjectionContext(initializeFeatureFlags);

    // Act
    resume.next();

    // Assert
    expect(flags.refreshes).toBe(1);
  });
});
