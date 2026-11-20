/** Where a disabled feature sends the user. */
export const FEATURE_DISABLED_REDIRECT = ['/tasks'] as const;

export const FEATURE_FLAG_LOG = {
  unsupported: 'Remote Config is not supported in this environment; using default flags',
  init: 'Feature flags init failed; using default flags',
  fetch: 'Feature flags fetch failed; keeping last known values',
  realtime: 'Feature flags realtime update failed',
  sync: 'Feature flags could not be read; keeping last known values',
} as const;
