import type { KeyValueStorage } from './key-value-storage';
import type { Migration } from './migration.model';
import { INITIAL_SCHEMA_VERSION, SCHEMA_VERSION_KEY } from './storage.constants';

/**
 * Brings the stored data up to date: reads the stored schema version, applies
 * every migration newer than it in ascending order and records the version
 * after each one, so a crash mid-way resumes from the last completed step.
 * Returns the resulting version. Data from a newer app version is left alone.
 */
export async function runMigrations(
  storage: KeyValueStorage,
  migrations: readonly Migration[],
): Promise<number> {
  let version = (await storage.get<number>(SCHEMA_VERSION_KEY)) ?? INITIAL_SCHEMA_VERSION;
  const pending = migrations
    .filter((migration) => migration.version > version)
    .sort((a, b) => a.version - b.version);

  for (const migration of pending) {
    await migration.migrate(storage);
    await storage.set(SCHEMA_VERSION_KEY, migration.version);
    version = migration.version;
  }
  return version;
}
