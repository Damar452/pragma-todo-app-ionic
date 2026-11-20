import { aCategory } from './category-fixture.testing';
import { removeCategory } from './remove-category';

describe('removeCategory', () => {
  it('returns a new array without the category', () => {
    // Arrange
    const categories = [aCategory({ id: 'a' }), aCategory({ id: 'b' })];

    // Act
    const result = removeCategory(categories, 'a');

    // Assert
    expect(result.map((category) => category.id)).toEqual(['b']);
    expect(categories).toHaveLength(2);
  });
});
