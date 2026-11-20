import { KeyValueStorage } from '@core/storage/key-value-storage';

/** Map-backed fake of the storage port for specs. Values are cloned so callers cannot alias state. */
export class InMemoryKeyValueStorage extends KeyValueStorage {
  private readonly entries = new Map<string, string>();

  /** When set, the next write (`set`/`remove`) rejects with it, then the fake recovers. */
  failNextWriteWith: Error | null = null;

  /** Number of successful `set` calls, to assert that a mutation was persisted. */
  setCount = 0;

  override get<T>(key: string): Promise<T | null> {
    const raw = this.entries.get(key);
    return Promise.resolve(raw === undefined ? null : (JSON.parse(raw) as T));
  }

  override set<T>(key: string, value: T): Promise<void> {
    const failure = this.consumeFailure();
    if (failure) {
      return Promise.reject(failure);
    }
    this.entries.set(key, JSON.stringify(value));
    this.setCount++;
    return Promise.resolve();
  }

  override remove(key: string): Promise<void> {
    const failure = this.consumeFailure();
    if (failure) {
      return Promise.reject(failure);
    }
    this.entries.delete(key);
    return Promise.resolve();
  }

  private consumeFailure(): Error | null {
    const failure = this.failNextWriteWith;
    this.failNextWriteWith = null;
    return failure;
  }
}
