import { isRecord } from './is-record';

describe('isRecord', () => {
  it('accepts plain objects', () => {
    // Arrange / Act / Assert
    expect(isRecord({ a: 1 })).toBe(true);
  });

  it.each([null, undefined, [], 'text', 3, true])('rejects %s', (value) => {
    // Arrange / Act / Assert
    expect(isRecord(value)).toBe(false);
  });
});
