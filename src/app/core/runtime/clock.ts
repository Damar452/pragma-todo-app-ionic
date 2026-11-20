import { InjectionToken } from '@angular/core';

/** Current time as epoch milliseconds. Stores inject it so specs can freeze time. */
export const CLOCK = new InjectionToken<() => number>('CLOCK', {
  providedIn: 'root',
  factory: () => () => Date.now(),
});
