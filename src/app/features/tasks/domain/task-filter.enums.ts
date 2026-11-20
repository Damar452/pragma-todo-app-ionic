/** Discriminant of every `TaskFilter` variant. */
export const TaskFilterKind = {
  All: 'all',
  Uncategorized: 'uncategorized',
  Category: 'category',
} as const;

export type TaskFilterKind = (typeof TaskFilterKind)[keyof typeof TaskFilterKind];
