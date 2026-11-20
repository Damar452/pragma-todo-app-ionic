import { formatLongDate } from './format-long-date';

describe('formatLongDate', () => {
  it('formats weekday, day and month in Spanish', () => {
    // Arrange
    const date = new Date(2026, 10, 20);

    // Act
    const result = formatLongDate(date, 'es');

    // Assert
    expect(result).toBe('viernes, 20 de noviembre');
  });

  it('follows the given locale', () => {
    // Arrange
    const date = new Date(2026, 10, 20);

    // Act
    const result = formatLongDate(date, 'en-US');

    // Assert
    expect(result).toBe('Friday, November 20');
  });
});
