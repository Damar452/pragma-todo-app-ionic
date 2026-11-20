import { HEADLINE_KEYS } from './progress-summary.constants';
import { resolveHeadlineKey } from './progress-summary.headline';

describe('resolveHeadlineKey', () => {
  it.each([
    [0, 0, HEADLINE_KEYS.Plan],
    [4, 0, HEADLINE_KEYS.Start],
    [4, 0.25, HEADLINE_KEYS.KeepGoing],
    [4, 0.5, HEADLINE_KEYS.AlmostDone],
    [4, 0.75, HEADLINE_KEYS.AlmostDone],
    [4, 1, HEADLINE_KEYS.AllDone],
  ])('for total %d and ratio %d returns %s', (total, ratio, expected) => {
    // Arrange / Act
    const result = resolveHeadlineKey({ total, ratio });

    // Assert
    expect(result).toBe(expected);
  });
});
