import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Translation, TranslocoLoader } from '@jsverse/transloco';
import type { Observable } from 'rxjs';

import { I18N_ASSETS_PATH, I18N_FILE_EXTENSION } from './i18n.constants';

/**
 * Loads `assets/i18n/<lang>.json` from the app bundle. The URL is relative on
 * purpose (no leading slash) so it resolves under Cordova's WebView as well as
 * under `ng serve`.
 */
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);

  getTranslation(lang: string): Observable<Translation> {
    return this.http.get<Translation>(`${I18N_ASSETS_PATH}/${lang}${I18N_FILE_EXTENSION}`);
  }
}
