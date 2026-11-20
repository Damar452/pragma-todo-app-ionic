/** Lifecycle of a store's initial load from persistence. */
export const LoadStatus = {
  Idle: 'idle',
  Loading: 'loading',
  Ready: 'ready',
  Error: 'error',
} as const;

export type LoadStatus = (typeof LoadStatus)[keyof typeof LoadStatus];
