import { FIREBASE_OPTIONS } from './firebase.config';

export const environment = {
  production: true,
  firebase: FIREBASE_OPTIONS,
  remoteConfig: {
    // 1 minute: a flag flipped in the console shows up on the next start/resume. The SDK default
    // is 12 h, and too many fetches per hour get throttled, so don't lower this much further.
    minimumFetchIntervalMillis: 60_000,
    initTimeoutMs: 2000,
  },
};
