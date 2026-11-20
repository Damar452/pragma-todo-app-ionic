import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { IonFabButton, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from '@ionic/angular';
import { TranslocoPipe } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

import {
  CATEGORY_FEEDBACK_KEYS,
  DELETE_CONFIRMATION_KEYS,
  FORM_MODAL_BREAKPOINTS,
  FORM_MODAL_INITIAL_BREAKPOINT,
} from './category-manager.page.constants';

import { ItemAction } from '@core/feedback/feedback.enums';
import { FeedbackService } from '@core/feedback/feedback.service';
import type { CategoryDraft } from '@features/categories/domain/category-draft.model';
import { CATEGORY_COLORS } from '@features/categories/domain/category-palette';
import type { Category } from '@features/categories/domain/category.model';
import { countTasksByCategory } from '@features/categories/domain/count-tasks-by-category';
import { CategoriesStore } from '@features/categories/state/categories.store';
import { CategoryFormComponent } from '@features/categories/ui/organisms/category-form/category-form.component';
import type { NameTakenPredicate } from '@features/categories/ui/organisms/category-form/category-form.models';
import { CategoryListComponent } from '@features/categories/ui/organisms/category-list/category-list.component';
import { TasksStore } from '@features/tasks/state/tasks.store';
import { ListPageTemplateComponent } from '@shared/ui/templates/list-page-template/list-page-template.component';

@Component({
  selector: 'app-category-manager',
  templateUrl: 'category-manager.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonFabButton,
    IonIcon,
    ListPageTemplateComponent,
    CategoryListComponent,
    CategoryFormComponent,
    TranslocoPipe,
  ],
})
export class CategoryManagerPage {
  private readonly categoriesStore = inject(CategoriesStore);
  private readonly tasksStore = inject(TasksStore);
  private readonly feedback = inject(FeedbackService);

  protected readonly categories = this.categoriesStore.categories;
  protected readonly colors = CATEGORY_COLORS;
  protected readonly modalBreakpoints = FORM_MODAL_BREAKPOINTS;
  protected readonly modalInitialBreakpoint = FORM_MODAL_INITIAL_BREAKPOINT;

  protected readonly isFormOpen = signal(false);
  protected readonly editingCategory = signal<Category | null>(null);

  protected readonly statsByCategory = computed(() =>
    countTasksByCategory(this.tasksStore.tasks()),
  );

  /** Flags names already used by another category; the one being edited may keep its own. */
  protected readonly isNameTaken = computed<NameTakenPredicate>(() => {
    const exceptId = this.editingCategory()?.id;
    return (name) => this.categoriesStore.isNameTaken(name, exceptId);
  });

  constructor() {
    addIcons({ add });
  }

  protected openNew(): void {
    this.editingCategory.set(null);
    this.isFormOpen.set(true);
  }

  protected openEdit(category: Category): void {
    this.editingCategory.set(category);
    this.isFormOpen.set(true);
  }

  protected closeForm(): void {
    this.isFormOpen.set(false);
    this.editingCategory.set(null);
  }

  protected async onSave(draft: CategoryDraft): Promise<void> {
    const editing = this.editingCategory();
    this.closeForm();
    await this.attempt(async () => {
      if (editing) {
        await this.categoriesStore.update(editing.id, draft);
        await this.feedback.toast(CATEGORY_FEEDBACK_KEYS.updated);
      } else {
        await this.categoriesStore.add(draft);
        await this.feedback.toast(CATEGORY_FEEDBACK_KEYS.created);
      }
    });
  }

  /** Asks first: deleting a category leaves its tasks without category. */
  protected async onRemove(category: Category): Promise<void> {
    const params = {
      name: category.name,
      count: this.statsByCategory().get(category.id)?.total ?? 0,
    };
    const confirmed = await this.feedback.confirm({
      ...DELETE_CONFIRMATION_KEYS,
      params,
      destructive: true,
    });
    if (confirmed) {
      await this.attempt(async () => {
        await this.categoriesStore.remove(category.id);
        await this.feedback.toast(CATEGORY_FEEDBACK_KEYS.deleted, { name: category.name });
      });
    }
  }

  /** Offers edit / delete for one category in a native action sheet. */
  protected async onMenu(category: Category): Promise<void> {
    const action = await this.feedback.chooseItemAction({ header: category.name });
    if (action) {
      await this.itemActionHandlers[action](category);
    }
  }

  private readonly itemActionHandlers: Record<
    ItemAction,
    (category: Category) => void | Promise<void>
  > = {
    [ItemAction.Edit]: (category) => this.openEdit(category),
    [ItemAction.Delete]: (category) => this.onRemove(category),
  };

  /** Runs a store action; a persistence failure (already rolled back by the store) becomes an error toast. */
  private async attempt(action: () => Promise<void>): Promise<void> {
    try {
      await action();
    } catch {
      await this.feedback.toastError(CATEGORY_FEEDBACK_KEYS.error);
    }
  }
}
