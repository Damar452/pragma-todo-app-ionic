import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

import { KeyValueStorage } from './key-value-storage';

/**
 * `KeyValueStorage` backed by `@ionic/storage-angular`. The engine is chosen
 * by the driver order configured in `provideStorage()`: SQLite on device,
 * IndexedDB / localStorage in the browser. The Cordova SQLite driver must be
 * defined before `create()`, and `create()` must run once, so both happen
 * lazily behind a memoized promise on the first read or write.
 */
@Injectable()
export class IonicStorageAdapter extends KeyValueStorage {
  private readonly storage = inject(Storage);
  private ready: Promise<Storage> | null = null;

  override async get<T>(key: string): Promise<T | null> {
    const storage = await this.open();
    return ((await storage.get(key)) as T | null | undefined) ?? null;
  }

  override async set<T>(key: string, value: T): Promise<void> {
    const storage = await this.open();
    await storage.set(key, value);
  }

  override async remove(key: string): Promise<void> {
    const storage = await this.open();
    await storage.remove(key);
  }

  private open(): Promise<Storage> {
    this.ready ??= this.initialize();
    return this.ready;
  }

  private async initialize(): Promise<Storage> {
    await this.storage.defineDriver(CordovaSQLiteDriver);
    return this.storage.create();
  }
}
