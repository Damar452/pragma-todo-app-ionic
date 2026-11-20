import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { IonFabButton, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from '@ionic/angular';
import { TranslocoPipe } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

import type { TaskDraft } from '../../../domain/task-draft.model';
import type { TaskFilter } from '../../../domain/task-filter.model';
import type { Task } from '../../../domain/task.model';
import { TasksStore } from '../../../state/tasks.store';
import { CategoryFilterComponent } from '../../organisms/category-filter/category-filter.component';
import { TaskFormComponent } from '../../organisms/task-form/task-form.component';
import { TaskListComponent } from '../../organisms/task-list/task-list.component';

import { CategoriesStore } from '@features/categories/state/categories.store';
import { ProgressSummaryComponent } from '@shared/ui/molecules/progress-summary/progress-summary.component';
import { ListPageTemplateComponent } from '@shared/ui/templates/list-page-template/list-page-template.component';

function formatToday(locale: string): string {
  const label = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
  return label.charAt(0).toLocaleUpperCase(locale) + label.slice(1);
}

@Component({
  selector: 'app-task-list-page',
  templateUrl: 'task-list.page.html',
  styleUrl: 'task-list.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonFabButton,
    IonIcon,
    ListPageTemplateComponent,
    ProgressSummaryComponent,
    CategoryFilterComponent,
    TaskListComponent,
    TaskFormComponent,
    TranslocoPipe,
  ],
})
export class TaskListPage {
  private readonly tasksStore = inject(TasksStore);
  private readonly categoriesStore = inject(CategoriesStore);

  protected readonly tasks = this.tasksStore.tasks;
  protected readonly categories = this.categoriesStore.categories;

  /** Will be wired to the `categories_enabled` feature flag. */
  protected readonly categoriesEnabled = signal(true);

  /** Subtitle under the page title in the app locale, e.g. "Viernes, 20 de noviembre". */
  protected readonly todayLabel = formatToday(inject(LOCALE_ID));

  protected readonly filter = signal<TaskFilter>({ kind: 'all' });
  protected readonly isFormOpen = signal(false);
  protected readonly editingTask = signal<Task | null>(null);

  protected readonly completedCount = computed(
    () => this.tasks().filter((task) => task.completed).length,
  );

  protected readonly visibleTasks = computed(() => {
    const filter = this.filter();
    switch (filter.kind) {
      case 'all':
        return this.tasks();
      case 'uncategorized':
        return this.tasks().filter((task) => task.categoryId === null);
      case 'category':
        return this.tasks().filter((task) => task.categoryId === filter.categoryId);
    }
  });

  constructor() {
    addIcons({ add });
  }

  protected openNew(): void {
    this.editingTask.set(null);
    this.isFormOpen.set(true);
  }

  protected openEdit(task: Task): void {
    this.editingTask.set(task);
    this.isFormOpen.set(true);
  }

  protected closeForm(): void {
    this.isFormOpen.set(false);
    this.editingTask.set(null);
  }

  protected onSave(_draft: TaskDraft): void {
    this.closeForm();
  }

  protected onToggle(_task: Task): void {
    // Wired to TasksStore in the base-app stage.
  }

  protected onRemove(_task: Task): void {
    // Wired to TasksStore in the base-app stage.
  }
}
