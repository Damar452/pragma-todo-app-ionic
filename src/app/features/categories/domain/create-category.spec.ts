import { createCategory } from './create-category';

describe('createCategory', () => {
  it('builds a category with the given id and the draft color', () => {
    // Arrange / Act
    const category = createCategory({ name: 'Home', color: '#111111' }, { id: 'abc' });

    // Assert
    expect(category).toEqual({ id: 'abc', name: 'Home', color: '#111111' });
  });

  it('trims the name', () => {
    // Arrange / Act
    const category = createCategory({ name: '  Home  ', color: '#111111' }, { id: 'a' });

    // Assert
    expect(category.name).toBe('Home');
  });
});
