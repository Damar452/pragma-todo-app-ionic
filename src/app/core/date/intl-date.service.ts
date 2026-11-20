import { Injectable, LOCALE_ID, inject } from '@angular/core';

import { DateService } from './date.service';

import { formatLongDate } from '@shared/utils/date/format-long-date';
import { capitalize } from '@shared/utils/string/capitalize';

/** `DateService` backed by the system clock and `Intl`, formatting in the app `LOCALE_ID`. */
@Injectable()
export class IntlDateService extends DateService {
  private readonly locale = inject(LOCALE_ID);

  /** Current time as epoch milliseconds. */
  override now(): number {
    return Date.now();
  }

  /** The current moment as a `Date`. */
  override today(): Date {
    return new Date(this.now());
  }

  /** Weekday, day and month in the app locale, capitalized (e.g. "Viernes, 20 de noviembre"). */
  override formatLongDate(date: Date): string {
    return capitalize(formatLongDate(date, this.locale), this.locale);
  }
}
