import { Drivers } from '@ionic/storage';

/** Name of the local database (IndexedDB / SQLite file) that holds every key. */
export const STORAGE_DB_NAME = 'todo-app';

/** Key that records which schema version the stored data is in (see `runMigrations`). */
export const SCHEMA_VERSION_KEY = 'todo:schemaVersion';

/** Version assumed when nothing was stored yet (fresh install or data older than versioning). */
export const INITIAL_SCHEMA_VERSION = 0;

/** Name the `localforage-cordovasqlitedriver` driver registers itself with. */
export const CORDOVA_SQLITE_DRIVER = 'cordovaSQLiteDriver';

/** Engines in order of preference: native SQLite on device, then the browser's own. */
export const STORAGE_DRIVER_ORDER = [
  CORDOVA_SQLITE_DRIVER,
  Drivers.IndexedDB,
  Drivers.LocalStorage,
];
