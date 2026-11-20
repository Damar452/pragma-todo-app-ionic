import { LONG_DATE_FORMAT_OPTIONS } from './format-long-date.constants';

/** Formats `date` as weekday, day and month in `locale` (e.g. "viernes, 20 de noviembre"). */
export function formatLongDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, LONG_DATE_FORMAT_OPTIONS).format(date);
}
