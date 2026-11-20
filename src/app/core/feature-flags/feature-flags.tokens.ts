import { InjectionToken } from '@angular/core';

import type { FeatureFlagsConfig } from './feature-flags.models';

export const FEATURE_FLAGS_CONFIG = new InjectionToken<FeatureFlagsConfig>('FEATURE_FLAGS_CONFIG');
