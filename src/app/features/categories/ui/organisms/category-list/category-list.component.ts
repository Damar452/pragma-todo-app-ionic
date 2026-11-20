import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IonList } from '@ionic/angular';
import { TranslocoPipe } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { pricetagsOutline } from 'ionicons/icons';

import { EMPTY_CATEGORY_TASK_STATS } from '../../../domain/category-task-stats.constants';
import type { CategoryTaskStats } from '../../../domain/category-task-stats.model';
import type { Category } from '../../../domain/category.model';
import { CategoryItemComponent } from '../category-item/category-item.component';

import { EmptyStateComponent } from '@shared/ui/molecules/empty-state/empty-state.component';
import { SectionHeaderComponent } from '@shared/ui/molecules/section-header/section-header.component';

@Component({
  selector: 'app-category-list',
  templateUrl: 'category-list.component.html',
  styleUrl: 'category-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonList,
    CategoryItemComponent,
    EmptyStateComponent,
    SectionHeaderComponent,
    TranslocoPipe,
  ],
})
export class CategoryListComponent {
  readonly categories = input.required<readonly Category[]>();
  readonly statsByCategory = input<ReadonlyMap<string, CategoryTaskStats>>(new Map());

  protected readonly emptyStats = EMPTY_CATEGORY_TASK_STATS;

  readonly edit = output<Category>();
  readonly remove = output<Category>();
  readonly menuRequested = output<Category>();

  constructor() {
    addIcons({ pricetagsOutline });
  }
}
