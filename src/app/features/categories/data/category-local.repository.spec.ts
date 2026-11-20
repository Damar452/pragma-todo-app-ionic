import { TestBed } from '@angular/core/testing';

import { aCategory } from '../domain/category-fixture.testing';

import { CategoryLocalRepository } from './category-local.repository';
import { CATEGORIES_STORAGE_KEY } from './category-storage.constants';

import { KeyValueStorage } from '@core/storage/key-value-storage';
import { InMemoryKeyValueStorage } from '@core/storage/testing/in-memory-key-value-storage';

function setup() {
  const storage = new InMemoryKeyValueStorage();
  TestBed.configureTestingModule({
    providers: [{ provide: KeyValueStorage, useValue: storage }, CategoryLocalRepository],
  });
  return { storage, repository: TestBed.inject(CategoryLocalRepository) };
}

describe('CategoryLocalRepository', () => {
  it('reads an empty list when nothing is stored', async () => {
    // Arrange
    const { repository } = setup();

    // Act
    const categories = await repository.getAll();

    // Assert
    expect(categories).toEqual([]);
  });

  it('reads back what it saved', async () => {
    // Arrange
    const { repository } = setup();
    const categories = [aCategory({ id: 'a' }), aCategory({ id: 'b', name: 'Home' })];

    // Act
    await repository.saveAll(categories);

    // Assert
    expect(await repository.getAll()).toEqual(categories);
  });

  it('reads an empty list when the stored value is corrupt', async () => {
    // Arrange
    const { repository, storage } = setup();
    await storage.set(CATEGORIES_STORAGE_KEY, { oops: true });

    // Act
    const categories = await repository.getAll();

    // Assert
    expect(categories).toEqual([]);
  });
});
