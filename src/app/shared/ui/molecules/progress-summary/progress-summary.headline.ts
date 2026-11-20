import { HEADLINE_KEYS, KEEP_GOING_RATIO_LIMIT } from './progress-summary.constants';

import {
  PROGRESS_MAX_RATIO,
  PROGRESS_MIN_RATIO,
} from '@shared/ui/atoms/progress-ring/progress-ring.constants';

export interface HeadlineContext {
  readonly total: number;
  readonly ratio: number;
}

interface HeadlineRule {
  readonly key: string;
  readonly matches: (context: HeadlineContext) => boolean;
}

/** Evaluated in order: the first rule that matches wins. */
const HEADLINE_RULES: readonly HeadlineRule[] = [
  { key: HEADLINE_KEYS.Plan, matches: ({ total }) => total === 0 },
  { key: HEADLINE_KEYS.Start, matches: ({ ratio }) => ratio === PROGRESS_MIN_RATIO },
  { key: HEADLINE_KEYS.KeepGoing, matches: ({ ratio }) => ratio < KEEP_GOING_RATIO_LIMIT },
  { key: HEADLINE_KEYS.AlmostDone, matches: ({ ratio }) => ratio < PROGRESS_MAX_RATIO },
];

/** Translation key of the motivational headline for the given progress. */
export function resolveHeadlineKey(context: HeadlineContext): string {
  return HEADLINE_RULES.find((rule) => rule.matches(context))?.key ?? HEADLINE_KEYS.AllDone;
}
