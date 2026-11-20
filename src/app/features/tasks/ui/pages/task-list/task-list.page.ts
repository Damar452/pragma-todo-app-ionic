import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { IonFabButton, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from '@ionic/angular';
import { TranslocoPipe } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

import {
  FORM_MODAL_BREAKPOINTS,
  FORM_MODAL_INITIAL_BREAKPOINT,
  INITIAL_TASK_FILTER,
  TASK_FEEDBACK_KEYS,
} from './task-list.page.constants';

import { DateService } from '@core/date/date.service';
import { FEATURE_FLAG_DEFAULTS } from '@core/feature-flags/feature-flags';
import { ItemAction } from '@core/feedback/feedback.enums';
import { FeedbackService } from '@core/feedback/feedback.service';
import { CategoriesStore } from '@features/categories/state/categories.store';
import { countCompletedTasks } from '@features/tasks/domain/count-completed-tasks';
import { filterTasks } from '@features/tasks/domain/filter-tasks';
import { resolveTaskFilter } from '@features/tasks/domain/resolve-task-filter';
import type { TaskDraft } from '@features/tasks/domain/task-draft.model';
import type { TaskFilter } from '@features/tasks/domain/task-filter.model';
import type { Task } from '@features/tasks/domain/task.model';
import { TasksStore } from '@features/tasks/state/tasks.store';
import { CategoryFilterComponent } from '@features/tasks/ui/organisms/category-filter/category-filter.component';
import { TaskFormComponent } from '@features/tasks/ui/organisms/task-form/task-form.component';
import { TaskListComponent } from '@features/tasks/ui/organisms/task-list/task-list.component';
import { ProgressSummaryComponent } from '@shared/ui/molecules/progress-summary/progress-summary.component';
import { ListPageTemplateComponent } from '@shared/ui/templates/list-page-template/list-page-template.component';

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
  private readonly feedback = inject(FeedbackService);
  private readonly dateService = inject(DateService);

  protected readonly tasks = this.tasksStore.tasks;
  protected readonly categories = this.categoriesStore.categories;

  /** Will be wired to the `categories_enabled` feature flag. */
  protected readonly categoriesEnabled = signal(FEATURE_FLAG_DEFAULTS.categories_enabled);

  /** Subtitle under the page title in the app locale, e.g. "Viernes, 20 de noviembre". */
  protected readonly todayLabel = this.dateService.formatLongDate(this.dateService.today());

  protected readonly modalBreakpoints = FORM_MODAL_BREAKPOINTS;
  protected readonly modalInitialBreakpoint = FORM_MODAL_INITIAL_BREAKPOINT;

  protected readonly filter = signal<TaskFilter>(INITIAL_TASK_FILTER);
  protected readonly isFormOpen = signal(false);
  protected readonly editingTask = signal<Task | null>(null);

  protected readonly completedCount = computed(() => countCompletedTasks(this.tasks()));

  /** The selected filter, or "all" when its category was deleted meanwhile. */
  protected readonly activeFilter = computed(() =>
    resolveTaskFilter(
      this.filter(),
      this.categories().map((category) => category.id),
    ),
  );

  protected readonly visibleTasks = computed(() => filterTasks(this.tasks(), this.activeFilter()));

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

  protected async onSave(draft: TaskDraft): Promise<void> {
    const editing = this.editingTask();
    this.closeForm();
    await this.attempt(async () => {
      if (editing) {
        await this.tasksStore.update(editing.id, draft);
        await this.feedback.toast(TASK_FEEDBACK_KEYS.updated);
      } else {
        await this.tasksStore.add(draft);
        await this.feedback.toast(TASK_FEEDBACK_KEYS.created);
      }
    });
  }

  protected onToggle(task: Task): Promise<void> {
    return this.attempt(() => this.tasksStore.toggle(task.id));
  }

  /** Removes the task right away and offers to undo it from the toast. */
  protected onRemove(task: Task): Promise<void> {
    return this.attempt(async () => {
      const removed = await this.tasksStore.remove(task.id);
      if (removed && (await this.feedback.toastWithUndo(TASK_FEEDBACK_KEYS.deleted))) {
        await this.tasksStore.restore(removed);
      }
    });
  }

  /** Offers edit / delete for one task in a native action sheet. */
  protected async onMenu(task: Task): Promise<void> {
    const action = await this.feedback.chooseItemAction({ header: task.title });
    if (action) {
      await this.itemActionHandlers[action](task);
    }
  }

  private readonly itemActionHandlers: Record<ItemAction, (task: Task) => void | Promise<void>> = {
    [ItemAction.Edit]: (task) => this.openEdit(task),
    [ItemAction.Delete]: (task) => this.onRemove(task),
  };

  /** Runs a store action; a persistence failure (already rolled back by the store) becomes an error toast. */
  private async attempt(action: () => Promise<void>): Promise<void> {
    try {
      await action();
    } catch {
      await this.feedback.toastError(TASK_FEEDBACK_KEYS.error);
    }
  }
}
