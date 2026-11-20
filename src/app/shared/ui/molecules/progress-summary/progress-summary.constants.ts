/** Progress ring drawn next to the summary text (white on the gradient banner). */
export const SUMMARY_RING_SIZE = 64;
export const SUMMARY_RING_STROKE_WIDTH = 6;
export const SUMMARY_RING_COLOR = '#FFFFFF';
export const SUMMARY_RING_TRACK_COLOR = 'rgba(255, 255, 255, 0.28)';

/** Ratio below which the user is still "keeping going" rather than "almost done". */
export const KEEP_GOING_RATIO_LIMIT = 0.5;

export const HEADLINE_KEYS = {
  Plan: 'shared.progress.headline.plan',
  Start: 'shared.progress.headline.start',
  KeepGoing: 'shared.progress.headline.keepGoing',
  AlmostDone: 'shared.progress.headline.almostDone',
  AllDone: 'shared.progress.headline.allDone',
} as const;

export const SUBTITLE_KEYS = {
  CompletedOf: 'shared.progress.completedOf',
  AddFirst: 'shared.progress.addFirst',
} as const;
