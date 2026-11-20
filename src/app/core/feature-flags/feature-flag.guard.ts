import { inject } from '@angular/core';
import { type CanMatchFn, Router } from '@angular/router';

import { FeatureFlagPort } from './feature-flag.port';
import type { FeatureFlagKey } from './feature-flags';
import { FEATURE_DISABLED_REDIRECT } from './feature-flags.constants';

/** Lets the route match only while the flag is on; otherwise redirects to the tasks screen. */
export function featureFlagGuard(key: FeatureFlagKey): CanMatchFn {
  return () =>
    inject(FeatureFlagPort).isEnabled(key)() ||
    inject(Router).createUrlTree([...FEATURE_DISABLED_REDIRECT]);
}
