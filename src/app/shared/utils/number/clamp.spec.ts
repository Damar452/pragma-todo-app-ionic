import { clamp } from './clamp';

describe('clamp', () => {
  it.each([
    [5, 0, 10, 5],
    [-3, 0, 10, 0],
    [42, 0, 10, 10],
    [0, 0, 10, 0],
    [10, 0, 10, 10],
  ])('clamps %d into [%d, %d] as %d', (value, min, max, expected) => {
    // Arrange / Act
    const result = clamp(value, min, max);

    // Assert
    expect(result).toBe(expected);
  });
});
