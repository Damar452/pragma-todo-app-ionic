import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding } from '@ionic/angular';
import { TranslocoPipe, translateSignal } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { createOutline, pricetag, trashOutline } from 'ionicons/icons';

import { EMPTY_CATEGORY_TASK_STATS } from '../../../domain/category-task-stats.constants';
import type { CategoryTaskStats } from '../../../domain/category-task-stats.model';
import type { Category } from '../../../domain/category.model';

import {
  CATEGORY_RING_SIZE,
  CATEGORY_RING_STROKE_WIDTH,
  PROGRESS_LABEL_KEY,
  TASK_COUNT_KEY,
} from './category-item.constants';

import { IconBadgeComponent } from '@shared/ui/atoms/icon-badge/icon-badge.component';
import { ProgressRingComponent } from '@shared/ui/atoms/progress-ring/progress-ring.component';
import { toRatio } from '@shared/utils/number/to-ratio';

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
  readonly stats = input<CategoryTaskStats>(EMPTY_CATEGORY_TASK_STATS);

  readonly edit = output<void>();
  readonly remove = output<void>();

  protected readonly ringSize = CATEGORY_RING_SIZE;
  protected readonly ringStrokeWidth = CATEGORY_RING_STROKE_WIDTH;

  protected readonly countLabel = translateSignal(
    TASK_COUNT_KEY,
    computed(() => ({ count: this.stats().total })),
  );

  protected readonly progressLabel = translateSignal(
    PROGRESS_LABEL_KEY,
    computed(() => ({ name: this.category().name })),
  );

  protected readonly ratio = computed(() => {
    const { total, completed } = this.stats();
    return toRatio(completed, total);
  });

  constructor() {
    addIcons({ createOutline, pricetag, trashOutline });
  }
}
