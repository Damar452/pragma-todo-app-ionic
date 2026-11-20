/**
 * Contract and DI token for date and time. Stores and pages never call
 * `Date.now()`, `new Date()` or `Intl` directly, so specs can freeze time with
 * `FakeDateService`. `provideDate()` binds the implementation.
 */
export abstract class DateService {
  /** Current time as epoch milliseconds. */
  abstract now(): number;

  /** The current moment as a `Date`. */
  abstract today(): Date;

  /** Weekday, day and month in the app locale, capitalized (e.g. "Viernes, 20 de noviembre"). */
  abstract formatLongDate(date: Date): string;
}
