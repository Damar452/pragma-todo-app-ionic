import { toPercent } from './to-percent';

describe('toPercent', () => {
  it.each([
    [0, 0],
    [0.854, 85],
    [0.855, 86],
    [1, 100],
  ])('converts %d into %d', (ratio, expected) => {
    // Arrange / Act
    const result = toPercent(ratio);

    // Assert
    expect(result).toBe(expected);
  });
});
