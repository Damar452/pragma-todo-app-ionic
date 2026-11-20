import { FALLBACK_ID_RADIX, FALLBACK_ID_SEPARATOR } from './generate-id.constants';

/** A unique id: `crypto.randomUUID()` when available, otherwise a time + random string. */
export function generateId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  const time = Date.now().toString(FALLBACK_ID_RADIX);
  const random = Math.random().toString(FALLBACK_ID_RADIX).slice(2);
  return `${time}${FALLBACK_ID_SEPARATOR}${random}`;
}
