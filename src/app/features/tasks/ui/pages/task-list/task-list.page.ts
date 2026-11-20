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

import { countCompletedTasks } from '../../../domain/count-completed-tasks';
import { filterTasks } from '../../../domain/filter-tasks';
import type { TaskDraft } from '../../../domain/task-draft.model';
import type { TaskFilter } from '../../../domain/task-filter.model';
import type { Task } from '../../../domain/task.model';
import { TasksStore } from '../../../state/tasks.store';
import { CategoryFilterComponent } from '../../organisms/category-filter/category-filter.component';
import { TaskFormComponent } from '../../organisms/task-form/task-form.component';
import { TaskListComponent } from '../../organisms/task-list/task-list.component';

import {
  FORM_MODAL_BREAKPOINTS,
  FORM_MODAL_INITIAL_BREAKPOINT,
  INITIAL_TASK_FILTER,
} from './task-list.page.constants';

import { FEATURE_FLAG_DEFAULTS } from '@core/feature-flags/feature-flags';
import { CategoriesStore } from '@features/categories/state/categories.store';
import { ProgressSummaryComponent } from '@shared/ui/molecules/progress-summary/progress-summary.component';
import { ListPageTemplateComponent } from '@shared/ui/templates/list-page-template/list-page-template.component';
import { formatLongDate } from '@shared/utils/date/format-long-date';
import { capitalize } from '@shared/utils/string/capitalize';

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
  private readonly locale = inject(LOCALE_ID);

  protected readonly tasks = this.tasksStore.tasks;
  protected readonly categories = this.categoriesStore.categories;

  /** Will be wired to the `categories_enabled` feature flag. */
  protected readonly categoriesEnabled = signal(FEATURE_FLAG_DEFAULTS.categories_enabled);

  /** Subtitle under the page title in the app locale, e.g. "Viernes, 20 de noviembre". */
  protected readonly todayLabel = capitalize(formatLongDate(new Date(), this.locale), this.locale);

  protected readonly modalBreakpoints = FORM_MODAL_BREAKPOINTS;
  protected readonly modalInitialBreakpoint = FORM_MODAL_INITIAL_BREAKPOINT;

  protected readonly filter = signal<TaskFilter>(INITIAL_TASK_FILTER);
  protected readonly isFormOpen = signal(false);
  protected readonly editingTask = signal<Task | null>(null);

  protected readonly completedCount = computed(() => countCompletedTasks(this.tasks()));

  protected readonly visibleTasks = computed(() => filterTasks(this.tasks(), this.filter()));

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
