import type { Migration } from './migration.model';
import { runMigrations } from './run-migrations';
import { SCHEMA_VERSION_KEY } from './storage.constants';
import { InMemoryKeyValueStorage } from './testing/in-memory-key-value-storage';

function recordingMigration(version: number, applied: number[]): Migration {
  return {
    version,
    migrate: () => {
      applied.push(version);
      return Promise.resolve();
    },
  };
}

describe('runMigrations', () => {
  it('applies every migration on a fresh store, in ascending order', async () => {
    // Arrange
    const storage = new InMemoryKeyValueStorage();
    const applied: number[] = [];

    // Act
    await runMigrations(storage, [recordingMigration(2, applied), recordingMigration(1, applied)]);

    // Assert
    expect(applied).toEqual([1, 2]);
  });

  it('saves the version it reached', async () => {
    // Arrange
    const storage = new InMemoryKeyValueStorage();

    // Act
    const version = await runMigrations(storage, [
      recordingMigration(1, []),
      recordingMigration(2, []),
    ]);

    // Assert
    expect(version).toBe(2);
    expect(await storage.get(SCHEMA_VERSION_KEY)).toBe(2);
  });

  it('only applies the migrations newer than the stored version', async () => {
    // Arrange
    const storage = new InMemoryKeyValueStorage();
    await storage.set(SCHEMA_VERSION_KEY, 1);
    const applied: number[] = [];

    // Act
    await runMigrations(storage, [recordingMigration(1, applied), recordingMigration(2, applied)]);

    // Assert
    expect(applied).toEqual([2]);
  });

  it('does nothing when the data is already up to date', async () => {
    // Arrange
    const storage = new InMemoryKeyValueStorage();
    await storage.set(SCHEMA_VERSION_KEY, 2);
    const applied: number[] = [];

    // Act
    const version = await runMigrations(storage, [recordingMigration(2, applied)]);

    // Assert
    expect(applied).toEqual([]);
    expect(version).toBe(2);
  });

  it('leaves data written by a newer app version untouched', async () => {
    // Arrange
    const storage = new InMemoryKeyValueStorage();
    await storage.set(SCHEMA_VERSION_KEY, 5);

    // Act
    const version = await runMigrations(storage, [recordingMigration(2, [])]);

    // Assert
    expect(version).toBe(5);
    expect(await storage.get(SCHEMA_VERSION_KEY)).toBe(5);
  });

  it('keeps the version of the last completed step when a migration fails', async () => {
    // Arrange
    const storage = new InMemoryKeyValueStorage();
    const failing: Migration = { version: 2, migrate: () => Promise.reject(new Error('boom')) };

    // Act
    const run = runMigrations(storage, [recordingMigration(1, []), failing]);

    // Assert
    await expect(run).rejects.toThrow('boom');
    expect(await storage.get(SCHEMA_VERSION_KEY)).toBe(1);
  });
});
