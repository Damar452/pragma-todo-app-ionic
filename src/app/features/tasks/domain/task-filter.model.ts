import type { TaskFilterKind } from './task-filter.enums';

export type TaskFilter =
  | { readonly kind: typeof TaskFilterKind.All }
  | { readonly kind: typeof TaskFilterKind.Uncategorized }
  | { readonly kind: typeof TaskFilterKind.Category; readonly categoryId: string };

/** The `TaskFilter` variant whose `kind` is `K`. */
export type TaskFilterOfKind<K extends TaskFilterKind> = Extract<TaskFilter, { kind: K }>;

/** One handler per filter kind: the lookup table that replaces a `switch` on `filter.kind`. */
export type TaskFilterHandlers<R> = {
  readonly [K in TaskFilterKind]: (filter: TaskFilterOfKind<K>) => R;
};
