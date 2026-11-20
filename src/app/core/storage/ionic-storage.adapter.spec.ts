import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';

import { IonicStorageAdapter } from './ionic-storage.adapter';

/** Records the order of setup calls and keeps values in a Map, like the real engine would. */
class FakeIonicStorage {
  readonly calls: string[] = [];
  private readonly values = new Map<string, unknown>();

  defineDriver(): Promise<void> {
    this.calls.push('defineDriver');
    return Promise.resolve();
  }

  create(): Promise<this> {
    this.calls.push('create');
    return Promise.resolve(this);
  }

  get(key: string): Promise<unknown> {
    return Promise.resolve(this.values.get(key) ?? null);
  }

  set(key: string, value: unknown): Promise<void> {
    this.values.set(key, value);
    return Promise.resolve();
  }

  remove(key: string): Promise<void> {
    this.values.delete(key);
    return Promise.resolve();
  }
}

function setup() {
  const fake = new FakeIonicStorage();
  TestBed.configureTestingModule({
    providers: [{ provide: Storage, useValue: fake }, IonicStorageAdapter],
  });
  return { fake, adapter: TestBed.inject(IonicStorageAdapter) };
}

describe('IonicStorageAdapter', () => {
  it('defines the SQLite driver before creating the database', async () => {
    // Arrange
    const { fake, adapter } = setup();

    // Act
    await adapter.get('k');

    // Assert
    expect(fake.calls).toEqual(['defineDriver', 'create']);
  });

  it('initializes only once across concurrent and later calls', async () => {
    // Arrange
    const { fake, adapter } = setup();

    // Act
    await Promise.all([adapter.get('a'), adapter.set('b', 1), adapter.remove('c')]);
    await adapter.get('a');

    // Assert
    expect(fake.calls).toEqual(['defineDriver', 'create']);
  });

  it('round-trips a value', async () => {
    // Arrange
    const { adapter } = setup();

    // Act
    await adapter.set('k', { n: 1 });

    // Assert
    expect(await adapter.get('k')).toEqual({ n: 1 });
  });

  it('returns null for a missing key', async () => {
    // Arrange
    const { adapter } = setup();

    // Act
    const value = await adapter.get('missing');

    // Assert
    expect(value).toBeNull();
  });

  it('removes a key', async () => {
    // Arrange
    const { adapter } = setup();
    await adapter.set('k', 1);

    // Act
    await adapter.remove('k');

    // Assert
    expect(await adapter.get('k')).toBeNull();
  });
});
