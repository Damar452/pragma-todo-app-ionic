import { aCategory } from './category-fixture.testing';
import { sortCategories } from './sort-categories';

describe('sortCategories', () => {
  it('orders by name ignoring case', () => {
    // Arrange
    const categories = [
      aCategory({ id: '1', name: 'trabajo' }),
      aCategory({ id: '2', name: 'Casa' }),
    ];

    // Act
    const result = sortCategories(categories, 'es');

    // Assert
    expect(result.map((category) => category.name)).toEqual(['Casa', 'trabajo']);
  });

  it('sorts accented names next to their base letter', () => {
    // Arrange
    const categories = [
      aCategory({ id: '1', name: 'Zapatos' }),
      aCategory({ id: '2', name: 'Álgebra' }),
      aCategory({ id: '3', name: 'Banco' }),
    ];

    // Act
    const result = sortCategories(categories, 'es');

    // Assert
    expect(result.map((category) => category.name)).toEqual(['Álgebra', 'Banco', 'Zapatos']);
  });

  it('does not mutate the input', () => {
    // Arrange
    const categories = [aCategory({ id: '1', name: 'b' }), aCategory({ id: '2', name: 'a' })];

    // Act
    sortCategories(categories, 'es');

    // Assert
    expect(categories.map((category) => category.id)).toEqual(['1', '2']);
  });
});
