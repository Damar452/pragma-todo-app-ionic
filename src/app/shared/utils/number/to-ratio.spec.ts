import { toRatio } from './to-ratio';

describe('toRatio', () => {
  it('divides part by total', () => {
    // Arrange / Act
    const result = toRatio(1, 4);

    // Assert
    expect(result).toBe(0.25);
  });

  it.each([0, -2])('returns 0 when the total is %d', (total) => {
    // Arrange / Act
    const result = toRatio(3, total);

    // Assert
    expect(result).toBe(0);
  });

  it('does not cap ratios above 1', () => {
    // Arrange / Act
    const result = toRatio(6, 3);

    // Assert
    expect(result).toBe(2);
  });
});
