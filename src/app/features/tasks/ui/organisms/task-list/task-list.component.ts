import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IonList } from '@ionic/angular';
import { TranslocoPipe } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { checkboxOutline } from 'ionicons/icons';

import type { Category } from '@features/categories/domain/category.model';
import type { Task } from '@features/tasks/domain/task.model';
import { TaskItemComponent } from '@features/tasks/ui/organisms/task-item/task-item.component';
import { EmptyStateComponent } from '@shared/ui/molecules/empty-state/empty-state.component';
import { SectionHeaderComponent } from '@shared/ui/molecules/section-header/section-header.component';

@Component({
  selector: 'app-task-list',
  templateUrl: 'task-list.component.html',
  styleUrl: 'task-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonList, TaskItemComponent, EmptyStateComponent, SectionHeaderComponent, TranslocoPipe],
})
export class TaskListComponent {
  readonly tasks = input.required<readonly Task[]>();
  readonly categories = input.required<readonly Category[]>();
  readonly showCategory = input(true);

  readonly toggleComplete = output<Task>();
  readonly edit = output<Task>();
  readonly remove = output<Task>();
  readonly menuRequested = output<Task>();

  protected readonly categoriesById = computed(
    () => new Map(this.categories().map((category) => [category.id, category])),
  );

  constructor() {
    addIcons({ checkboxOutline });
  }
}
