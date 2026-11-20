import { normalizeText } from './normalize-text';

describe('normalizeText', () => {
  it('lowercases the text', () => {
    // Arrange / Act
    const result = normalizeText('TRABAJO');

    // Assert
    expect(result).toBe('trabajo');
  });

  it('removes accents', () => {
    // Arrange / Act
    const result = normalizeText('Educación Ñandú');

    // Assert
    expect(result).toBe('educacion nandu');
  });

  it('trims surrounding whitespace', () => {
    // Arrange / Act
    const result = normalizeText('  casa  ');

    // Assert
    expect(result).toBe('casa');
  });

  it('treats precomposed and decomposed accents the same', () => {
    // Arrange
    const precomposed = 'é';
    const decomposed = 'é';

    // Act / Assert
    expect(normalizeText(precomposed)).toBe(normalizeText(decomposed));
  });
});
