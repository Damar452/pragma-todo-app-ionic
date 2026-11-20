import { matchTaskFilter } from '../../../domain/match-task-filter';
import { TaskFilterKind } from '../../../domain/task-filter.enums';
import type { TaskFilter, TaskFilterHandlers } from '../../../domain/task-filter.model';

import { ALL_CHIP_ID, UNCATEGORIZED_CHIP_ID } from './category-filter.constants';

const CHIP_ID_BY_FILTER: TaskFilterHandlers<string> = {
  [TaskFilterKind.All]: () => ALL_CHIP_ID,
  [TaskFilterKind.Uncategorized]: () => UNCATEGORIZED_CHIP_ID,
  [TaskFilterKind.Category]: (filter) => filter.categoryId,
};

const FILTER_BY_RESERVED_CHIP_ID: ReadonlyMap<string, TaskFilter> = new Map<string, TaskFilter>([
  [ALL_CHIP_ID, { kind: TaskFilterKind.All }],
  [UNCATEGORIZED_CHIP_ID, { kind: TaskFilterKind.Uncategorized }],
]);

/** Id of the chip that represents `filter`. */
export function toChipId(filter: TaskFilter): string {
  return matchTaskFilter(filter, CHIP_ID_BY_FILTER);
}

/** Filter selected by clicking the chip with `chipId` (non-reserved ids are category ids). */
export function toTaskFilter(chipId: string): TaskFilter {
  return (
    FILTER_BY_RESERVED_CHIP_ID.get(chipId) ?? { kind: TaskFilterKind.Category, categoryId: chipId }
  );
}
