import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import localeEs from '@angular/common/locales/es';
import {
  type EnvironmentProviders,
  LOCALE_ID,
  inject,
  isDevMode,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { TranslocoService, provideTransloco } from '@jsverse/transloco';
import { provideTranslocoMessageformat } from '@jsverse/transloco-messageformat';
import { firstValueFrom } from 'rxjs';

import { TranslocoHttpLoader } from './transloco-http.loader';

export const DEFAULT_LANG = 'es';
export const AVAILABLE_LANGS = [DEFAULT_LANG];

/**
 * Registers Transloco (ICU plurals through messageformat), the Angular locale
 * and preloads the default language so the first render never shows raw keys.
 * To add a language, append it to `AVAILABLE_LANGS` and create its JSON file.
 */
export function provideI18n(): EnvironmentProviders {
  registerLocaleData(localeEs);

  return makeEnvironmentProviders([
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: AVAILABLE_LANGS,
        defaultLang: DEFAULT_LANG,
        fallbackLang: DEFAULT_LANG,
        reRenderOnLangChange: false,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideTranslocoMessageformat({ locales: DEFAULT_LANG }),
    { provide: LOCALE_ID, useValue: DEFAULT_LANG },
    provideAppInitializer(() => firstValueFrom(inject(TranslocoService).load(DEFAULT_LANG))),
  ]);
}
