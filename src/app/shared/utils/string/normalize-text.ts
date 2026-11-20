import { DIACRITICS_PATTERN, NORMALIZATION_FORM } from './normalize-text.constants';

/** Trimmed, lowercase text without accents, for case- and accent-insensitive comparisons. */
export function normalizeText(text: string): string {
  return text.normalize(NORMALIZATION_FORM).replace(DIACRITICS_PATTERN, '').trim().toLowerCase();
}
