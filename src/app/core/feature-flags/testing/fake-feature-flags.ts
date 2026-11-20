import { Injectable, type Provider, type Signal, signal } from '@angular/core';

import { FeatureFlagPort } from '@core/feature-flags/feature-flag.port';
import {
  FEATURE_FLAG_DEFAULTS,
  FEATURE_FLAG_KEYS,
  type FeatureFlagKey,
} from '@core/feature-flags/feature-flags';

/** Fake flags for specs: defaults until `set()` flips a value. */
@Injectable()
export class FakeFeatureFlags extends FeatureFlagPort {
  private readonly signals = Object.fromEntries(
    FEATURE_FLAG_KEYS.map((key) => [key, signal<boolean>(FEATURE_FLAG_DEFAULTS[key])]),
  ) as Record<FeatureFlagKey, ReturnType<typeof signal<boolean>>>;

  override init(): Promise<void> {
    return Promise.resolve();
  }

  override refresh(): Promise<void> {
    return Promise.resolve();
  }

  override isEnabled(key: FeatureFlagKey): Signal<boolean> {
    return this.signals[key].asReadonly();
  }

  set(key: FeatureFlagKey, value: boolean): void {
    this.signals[key].set(value);
  }
}

/** Binds the fake to the `FeatureFlagPort` contract; `TestBed.inject(FakeFeatureFlags)` gives the same instance. */
export function provideFakeFeatureFlags(
  overrides: Partial<Record<FeatureFlagKey, boolean>> = {},
): Provider[] {
  return [
    {
      provide: FakeFeatureFlags,
      useFactory: () => {
        const fake = new FakeFeatureFlags();
        FEATURE_FLAG_KEYS.forEach((key) =>
          fake.set(key, overrides[key] ?? FEATURE_FLAG_DEFAULTS[key]),
        );
        return fake;
      },
    },
    { provide: FeatureFlagPort, useExisting: FakeFeatureFlags },
  ];
}
