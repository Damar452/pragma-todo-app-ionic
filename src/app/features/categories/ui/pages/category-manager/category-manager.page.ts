import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { IonFabButton, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from '@ionic/angular';
import { TranslocoPipe } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

import type { CategoryDraft } from '../../../domain/category-draft.model';
import { CATEGORY_COLORS } from '../../../domain/category-palette';
import type { Category } from '../../../domain/category.model';
import { countTasksByCategory } from '../../../domain/count-tasks-by-category';
import { CategoriesStore } from '../../../state/categories.store';
import { CategoryFormComponent } from '../../organisms/category-form/category-form.component';
import { CategoryListComponent } from '../../organisms/category-list/category-list.component';

import {
  FORM_MODAL_BREAKPOINTS,
  FORM_MODAL_INITIAL_BREAKPOINT,
} from './category-manager.page.constants';

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

  protected readonly categories = this.categoriesStore.categories;
  protected readonly colors = CATEGORY_COLORS;
  protected readonly modalBreakpoints = FORM_MODAL_BREAKPOINTS;
  protected readonly modalInitialBreakpoint = FORM_MODAL_INITIAL_BREAKPOINT;

  protected readonly isFormOpen = signal(false);
  protected readonly editingCategory = signal<Category | null>(null);

  protected readonly statsByCategory = computed(() =>
    countTasksByCategory(this.tasksStore.tasks()),
  );

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

  protected onSave(_draft: CategoryDraft): void {
    this.closeForm();
  }

  protected onRemove(_category: Category): void {
    // Wired to CategoriesStore in the base-app stage.
  }
}
