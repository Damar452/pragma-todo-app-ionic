import { Injectable, LOCALE_ID, inject } from '@angular/core';

import { formatLongDate } from '@shared/utils/date/format-long-date';
import { capitalize } from '@shared/utils/string/capitalize';

/**
 * Single entry point for date and time. Stores and pages never call `Date.now()`,
 * `new Date()` or `Intl` directly, so specs can freeze time with `FakeDateService`.
 */
@Injectable({ providedIn: 'root' })
export class DateService {
  private readonly locale = inject(LOCALE_ID);

  /** Current time as epoch milliseconds. */
  now(): number {
    return Date.now();
  }

  /** The current moment as a `Date`. */
  today(): Date {
    return new Date(this.now());
  }

  /** Weekday, day and month in the app locale, capitalized (e.g. "Viernes, 20 de noviembre"). */
  formatLongDate(date: Date): string {
    return capitalize(formatLongDate(date, this.locale), this.locale);
  }
}
