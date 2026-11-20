import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { translateSignal } from '@jsverse/transloco';

import type { TaskFilter } from '../../../domain/task-filter.model';

import type { Category } from '@features/categories/domain/category.model';
import {
  type ChipOption,
  ChipSelectorComponent,
} from '@shared/ui/molecules/chip-selector/chip-selector.component';

const ALL_ID = '__all__';
const UNCATEGORIZED_ID = '__none__';

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

  private readonly allLabel = translateSignal('tasks.filter.all');
  private readonly uncategorizedLabel = translateSignal('tasks.filter.uncategorized');

  protected readonly options = computed<readonly ChipOption[]>(() => [
    { id: ALL_ID, label: this.allLabel() },
    ...this.categories().map((c) => ({ id: c.id, label: c.name, color: c.color })),
    { id: UNCATEGORIZED_ID, label: this.uncategorizedLabel() },
  ]);

  protected readonly selectedId = computed(() => {
    const filter = this.filter();
    switch (filter.kind) {
      case 'all':
        return ALL_ID;
      case 'uncategorized':
        return UNCATEGORIZED_ID;
      case 'category':
        return filter.categoryId;
    }
  });

  protected onSelect(id: string): void {
    if (id === ALL_ID) {
      this.filterChange.emit({ kind: 'all' });
    } else if (id === UNCATEGORIZED_ID) {
      this.filterChange.emit({ kind: 'uncategorized' });
    } else {
      this.filterChange.emit({ kind: 'category', categoryId: id });
    }
  }
}
