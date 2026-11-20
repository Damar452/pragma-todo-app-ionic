import { aCategory } from './category-fixture.testing';
import { isCategoryNameTaken } from './is-category-name-taken';

const CATEGORIES = [
  aCategory({ id: 'a', name: 'Educación' }),
  aCategory({ id: 'b', name: 'Casa' }),
];

describe('isCategoryNameTaken', () => {
  it('detects an exact match', () => {
    // Arrange / Act / Assert
    expect(isCategoryNameTaken(CATEGORIES, 'Casa')).toBe(true);
  });

  it('ignores case', () => {
    // Arrange / Act / Assert
    expect(isCategoryNameTaken(CATEGORIES, 'cAsA')).toBe(true);
  });

  it('ignores accents', () => {
    // Arrange / Act / Assert
    expect(isCategoryNameTaken(CATEGORIES, 'educacion')).toBe(true);
  });

  it('ignores surrounding spaces', () => {
    // Arrange / Act / Assert
    expect(isCategoryNameTaken(CATEGORIES, '  Casa ')).toBe(true);
  });

  it('is false for a new name', () => {
    // Arrange / Act / Assert
    expect(isCategoryNameTaken(CATEGORIES, 'Trabajo')).toBe(false);
  });

  it('does not clash with the category being edited', () => {
    // Arrange / Act / Assert
    expect(isCategoryNameTaken(CATEGORIES, 'Casa', 'b')).toBe(false);
  });

  it('still clashes with a different category when editing', () => {
    // Arrange / Act / Assert
    expect(isCategoryNameTaken(CATEGORIES, 'Casa', 'a')).toBe(true);
  });
});
