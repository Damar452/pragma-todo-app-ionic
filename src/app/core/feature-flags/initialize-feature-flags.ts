import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Platform } from '@ionic/angular';

import { FeatureFlagPort } from './feature-flag.port';
import { FEATURE_FLAGS_CONFIG } from './feature-flags.tokens';

/**
 * Start-up task: loads the flags but never keeps the app waiting longer than
 * `initTimeoutMs` (offline, slow network): the app then starts with cached or
 * default values and the signals update whenever the fetch ends. Also refreshes
 * the flags whenever the app returns to the foreground.
 */
export async function initializeFeatureFlags(): Promise<void> {
  const flags = inject(FeatureFlagPort);
  const { initTimeoutMs } = inject(FEATURE_FLAGS_CONFIG).remoteConfig;

  inject(Platform)
    .resume.pipe(takeUntilDestroyed(inject(DestroyRef)))
    .subscribe(() => void flags.refresh());

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<void>((resolve) => {
    timer = setTimeout(resolve, initTimeoutMs);
  });
  try {
    await Promise.race([flags.init(), timeout]);
  } finally {
    clearTimeout(timer);
  }
}
