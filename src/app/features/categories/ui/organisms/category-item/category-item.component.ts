import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding } from '@ionic/angular';
import { TranslocoPipe, translateSignal } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { createOutline, pricetag, trashOutline } from 'ionicons/icons';

import type { CategoryTaskStats } from '../../../domain/category-task-stats.model';
import type { Category } from '../../../domain/category.model';

import { IconBadgeComponent } from '@shared/ui/atoms/icon-badge/icon-badge.component';
import { ProgressRingComponent } from '@shared/ui/atoms/progress-ring/progress-ring.component';

const EMPTY_STATS: CategoryTaskStats = { total: 0, completed: 0 };

@Component({
  selector: 'app-category-item',
  templateUrl: 'category-item.component.html',
  styleUrl: 'category-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonItem,
    IonIcon,
    IconBadgeComponent,
    ProgressRingComponent,
    TranslocoPipe,
  ],
})
export class CategoryItemComponent {
  readonly category = input.required<Category>();
  readonly stats = input<CategoryTaskStats>(EMPTY_STATS);

  readonly edit = output<void>();
  readonly remove = output<void>();

  protected readonly countLabel = translateSignal(
    'categories.taskCount',
    computed(() => ({ count: this.stats().total })),
  );

  protected readonly progressLabel = translateSignal(
    'categories.progressLabel',
    computed(() => ({ name: this.category().name })),
  );

  protected readonly ratio = computed(() => {
    const { total, completed } = this.stats();
    return total > 0 ? completed / total : 0;
  });

  constructor() {
    addIcons({ createOutline, pricetag, trashOutline });
  }
}
