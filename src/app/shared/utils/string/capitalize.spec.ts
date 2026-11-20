import { capitalize } from './capitalize';

describe('capitalize', () => {
  it('uppercases only the first character', () => {
    // Arrange / Act
    const result = capitalize('viernes, 20 de noviembre', 'es');

    // Assert
    expect(result).toBe('Viernes, 20 de noviembre');
  });

  it('returns an empty string untouched', () => {
    // Arrange / Act
    const result = capitalize('', 'es');

    // Assert
    expect(result).toBe('');
  });

  it('uses the locale casing rules', () => {
    // Arrange / Act
    const result = capitalize('ibiza', 'tr');

    // Assert
    expect(result).toBe('İbiza');
  });
});
