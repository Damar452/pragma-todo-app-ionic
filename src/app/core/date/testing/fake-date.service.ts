import { Injectable, LOCALE_ID, type Provider, inject } from '@angular/core';

import { DateService } from '@core/date/date.service';
import { formatLongDate } from '@shared/utils/date/format-long-date';
import { capitalize } from '@shared/utils/string/capitalize';

/** Fixed point in time used by `provideFakeDate()` when none is given (2026-11-20 12:00 local). */
export const FAKE_NOW = new Date(2026, 10, 20, 12).getTime();

/** Fake `DateService` for specs: time stands still until `now` is set. */
@Injectable()
export class FakeDateService extends DateService {
  /** Epoch milliseconds returned by `now()` and used by `today()`. */
  fakeNow = FAKE_NOW;

  private readonly locale = inject(LOCALE_ID);

  override now(): number {
    return this.fakeNow;
  }

  override today(): Date {
    return new Date(this.fakeNow);
  }

  override formatLongDate(date: Date): string {
    return capitalize(formatLongDate(date, this.locale), this.locale);
  }
}

/** Binds the fake to the `DateService` contract; `TestBed.inject(FakeDateService)` gives the same instance. */
export function provideFakeDate(now: number = FAKE_NOW): Provider[] {
  return [
    {
      provide: FakeDateService,
      useFactory: () => Object.assign(new FakeDateService(), { fakeNow: now }),
    },
    { provide: DateService, useExisting: FakeDateService },
  ];
}
