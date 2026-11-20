import {
  type EnvironmentProviders,
  importProvidersFrom,
  makeEnvironmentProviders,
} from '@angular/core';
import { IonicStorageModule } from '@ionic/storage-angular';

import { IonicStorageAdapter } from './ionic-storage.adapter';
import { KeyValueStorage } from './key-value-storage';
import { STORAGE_DB_NAME, STORAGE_DRIVER_ORDER } from './storage.constants';

/**
 * Binds the `KeyValueStorage` port to the Ionic Storage adapter.
 * `@ionic/storage-angular` v4 only ships an NgModule, hence `importProvidersFrom`.
 */
export function provideStorage(): EnvironmentProviders {
  return makeEnvironmentProviders([
    importProvidersFrom(
      IonicStorageModule.forRoot({ name: STORAGE_DB_NAME, driverOrder: STORAGE_DRIVER_ORDER }),
    ),
    { provide: KeyValueStorage, useClass: IonicStorageAdapter },
  ]);
}
