import type { TaskFilter, TaskFilterHandlers } from './task-filter.model';

/** Runs the handler registered for `filter.kind` and returns its result. */
export function matchTaskFilter<R>(filter: TaskFilter, handlers: TaskFilterHandlers<R>): R {
  // TypeScript cannot correlate `filter.kind` with the matching handler's parameter,
  // so the handler table is widened once here; `TaskFilterHandlers` keeps callers exact.
  const handler = handlers[filter.kind] as (filter: TaskFilter) => R;
  return handler(filter);
}
