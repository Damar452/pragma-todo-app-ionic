/**
 * Port for local key-value persistence. Repositories depend on this
 * abstraction; the adapter decides the engine (SQLite on device, IndexedDB in
 * the browser). Abstract class (not interface) so it doubles as the DI token.
 */
export abstract class KeyValueStorage {
  abstract get<T>(key: string): Promise<T | null>;
  abstract set<T>(key: string, value: T): Promise<void>;
  abstract remove(key: string): Promise<void>;
}
