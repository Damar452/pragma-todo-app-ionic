import { InjectionToken } from '@angular/core';

import { generateId } from '@shared/utils/id/generate-id';

/** Produces unique ids. Stores inject it so specs can supply a deterministic sequence. */
export const ID_GENERATOR = new InjectionToken<() => string>('ID_GENERATOR', {
  providedIn: 'root',
  factory: () => generateId,
});
