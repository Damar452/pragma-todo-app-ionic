import { aCategory } from './category-fixture.testing';
import { isCategory, parseCategories } from './parse-categories';

describe('isCategory', () => {
  it('accepts a well-formed category', () => {
    // Arrange / Act / Assert
    expect(isCategory(aCategory())).toBe(true);
  });

  it.each([
    ['null', null],
    ['a string', 'x'],
    ['a missing name', { id: 'a', color: '#fff' }],
    ['a numeric id', { id: 1, name: 'A', color: '#fff' }],
  ])('rejects %s', (_label, value) => {
    // Arrange / Act / Assert
    expect(isCategory(value)).toBe(false);
  });
});

describe('parseCategories', () => {
  it('returns the valid categories of a stored array', () => {
    // Arrange
    const stored = [aCategory({ id: 'a' }), { nope: true }];

    // Act
    const result = parseCategories(stored);

    // Assert
    expect(result).toEqual([aCategory({ id: 'a' })]);
  });

  it.each([null, undefined, 'text', 7, {}])('returns [] for %s', (stored) => {
    // Arrange / Act
    const result = parseCategories(stored);

    // Assert
    expect(result).toEqual([]);
  });
});
