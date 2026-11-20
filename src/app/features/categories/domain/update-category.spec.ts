import { aCategory } from './category-fixture.testing';
import { updateCategory } from './update-category';

describe('updateCategory', () => {
  it('applies the trimmed name and color to the matching category only', () => {
    // Arrange
    const categories = [aCategory({ id: 'a' }), aCategory({ id: 'b' })];

    // Act
    const result = updateCategory(categories, 'a', { name: '  Home ', color: '#222222' });

    // Assert
    expect(result[0]).toEqual({ id: 'a', name: 'Home', color: '#222222' });
    expect(result[1]).toBe(categories[1]);
  });

  it('returns the same content when the id does not exist', () => {
    // Arrange
    const categories = [aCategory({ id: 'a' })];

    // Act
    const result = updateCategory(categories, 'missing', { name: 'X', color: '#222222' });

    // Assert
    expect(result).toEqual(categories);
  });
});
