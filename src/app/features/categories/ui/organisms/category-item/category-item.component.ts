import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import {
  IonButton,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
} from '@ionic/angular';
import { TranslocoPipe, translateSignal } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { createOutline, ellipsisVertical, pricetag, trashOutline } from 'ionicons/icons';

import {
  CATEGORY_RING_SIZE,
  CATEGORY_RING_STROKE_WIDTH,
  MORE_LABEL_KEY,
  PROGRESS_LABEL_KEY,
  TASK_COUNT_KEY,
} from './category-item.constants';

import { EMPTY_CATEGORY_TASK_STATS } from '@features/categories/domain/category-task-stats.constants';
import type { CategoryTaskStats } from '@features/categories/domain/category-task-stats.model';
import type { Category } from '@features/categories/domain/category.model';
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
    IonButton,
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
  /** The ⋮ button was tapped; the page decides what to offer. */
  readonly menuRequested = output<void>();

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

  protected readonly moreLabel = translateSignal(
    MORE_LABEL_KEY,
    computed(() => ({ name: this.category().name })),
  );

  protected readonly ratio = computed(() => {
    const { total, completed } = this.stats();
    return toRatio(completed, total);
  });

  constructor() {
    addIcons({ createOutline, ellipsisVertical, pricetag, trashOutline });
  }

  /** Opens the menu without letting the tap reach the card (which would edit). */
  protected onMenu(event: Event): void {
    event.stopPropagation();
    this.menuRequested.emit();
  }
}
