import { generateId } from './generate-id';

describe('generateId', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uses crypto.randomUUID when available', () => {
    // Arrange
    vi.stubGlobal('crypto', { randomUUID: () => 'uuid-from-crypto' });

    // Act
    const result = generateId();

    // Assert
    expect(result).toBe('uuid-from-crypto');
  });

  it('falls back to a non-empty string when crypto is unavailable', () => {
    // Arrange
    vi.stubGlobal('crypto', undefined);

    // Act
    const result = generateId();

    // Assert
    expect(result.length).toBeGreaterThan(0);
  });

  it('generates distinct ids with the fallback', () => {
    // Arrange
    vi.stubGlobal('crypto', undefined);

    // Act
    const ids = new Set(Array.from({ length: 50 }, () => generateId()));

    // Assert
    expect(ids.size).toBe(50);
  });
});
