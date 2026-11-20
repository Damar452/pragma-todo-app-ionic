import {
  LOCALE_ID,
  type EnvironmentProviders,
  type Provider,
  importProvidersFrom,
} from '@angular/core';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { provideTranslocoMessageformat } from '@jsverse/transloco-messageformat';

import es from '@assets/i18n/es.json';

/** The real Spanish catalog, so specs assert the copy users actually see. */
export const ES_TRANSLATIONS = es;

/** Transloco + ICU plurals + `es` locale, loaded synchronously from the real catalog. */
export function provideTranslocoTesting(): (Provider | EnvironmentProviders)[] {
  return [
    importProvidersFrom(
      TranslocoTestingModule.forRoot({
        langs: { es },
        translocoConfig: { availableLangs: ['es'], defaultLang: 'es', fallbackLang: 'es' },
        preloadLangs: true,
      }),
    ),
    provideTranslocoMessageformat({ locales: 'es' }),
    { provide: LOCALE_ID, useValue: 'es' },
  ];
}
