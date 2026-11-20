import type { Provider } from '@angular/core';

import { DateService } from './date.service';
import { IntlDateService } from './intl-date.service';

/** Binds the date contract to its `Intl`-based implementation. */
export function provideDate(): Provider[] {
  return [{ provide: DateService, useClass: IntlDateService }];
}
