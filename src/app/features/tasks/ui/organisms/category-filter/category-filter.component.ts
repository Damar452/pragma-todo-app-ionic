import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { translateSignal } from '@jsverse/transloco';

import type { TaskFilter } from '../../../domain/task-filter.model';

import {
  ALL_CHIP_ID,
  ALL_LABEL_KEY,
  UNCATEGORIZED_CHIP_ID,
  UNCATEGORIZED_LABEL_KEY,
} from './category-filter.constants';
import { toChipId, toTaskFilter } from './category-filter.mappers';

import type { Category } from '@features/categories/domain/category.model';
import { ChipSelectorComponent } from '@shared/ui/molecules/chip-selector/chip-selector.component';
import type { ChipOption } from '@shared/ui/molecules/chip-selector/chip-selector.models';

@Component({
  selector: 'app-category-filter',
  templateUrl: 'category-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChipSelectorComponent],
})
export class CategoryFilterComponent {
  readonly categories = input.required<readonly Category[]>();
  readonly filter = input.required<TaskFilter>();

  readonly filterChange = output<TaskFilter>();

  private readonly allLabel = translateSignal(ALL_LABEL_KEY);
  private readonly uncategorizedLabel = translateSignal(UNCATEGORIZED_LABEL_KEY);

  protected readonly options = computed<readonly ChipOption[]>(() => [
    { id: ALL_CHIP_ID, label: this.allLabel() },
    ...this.categories().map((c) => ({ id: c.id, label: c.name, color: c.color })),
    { id: UNCATEGORIZED_CHIP_ID, label: this.uncategorizedLabel() },
  ]);

  protected readonly selectedId = computed(() => toChipId(this.filter()));

  protected onSelect(id: string): void {
    this.filterChange.emit(toTaskFilter(id));
  }
}
