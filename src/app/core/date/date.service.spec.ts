import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DateService } from './date.service';

function setup(locale = 'es') {
  TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: locale }] });
  return TestBed.inject(DateService);
}

describe('DateService', () => {
  it('formats a long date capitalized in the app locale', () => {
    // Arrange
    const service = setup('es');

    // Act
    const result = service.formatLongDate(new Date(2026, 10, 20));

    // Assert
    expect(result).toBe('Viernes, 20 de noviembre');
  });

  it('returns the current time as epoch milliseconds', () => {
    // Arrange
    const service = setup();
    const before = Date.now();

    // Act
    const result = service.now();

    // Assert
    expect(Number.isInteger(result)).toBe(true);
    expect(result).toBeGreaterThanOrEqual(before);
    expect(result).toBeLessThanOrEqual(Date.now());
  });

  it('returns today as a Date', () => {
    // Arrange
    const service = setup();

    // Act
    const result = service.today();

    // Assert
    expect(result).toBeInstanceOf(Date);
    expect(Math.abs(result.getTime() - Date.now())).toBeLessThan(1000);
  });
});
