import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TaskListPage } from './task-list.page';

import { provideFakeDate } from '@core/date/testing/fake-date.service';
import { FeatureFlag } from '@core/feature-flags/feature-flags.enums';
import {
  FakeFeatureFlags,
  provideFakeFeatureFlags,
} from '@core/feature-flags/testing/fake-feature-flags';
import { ItemAction } from '@core/feedback/feedback.enums';
import {
  FakeFeedbackService,
  provideFakeFeedback,
} from '@core/feedback/testing/fake-feedback.service';
import { aCategory } from '@features/categories/domain/category-fixture.testing';
import { CategoriesStore } from '@features/categories/state/categories.store';
import { CategoryTaskCleanup } from '@features/categories/state/category-task-cleanup';
import { provideInMemoryCategories } from '@features/categories/state/testing/in-memory-categories.providers';
import { TaskFilterKind } from '@features/tasks/domain/task-filter.enums';
import { aTask } from '@features/tasks/domain/task-fixture.testing';
import { TasksStore } from '@features/tasks/state/tasks.store';
import { provideInMemoryTasks } from '@features/tasks/state/testing/in-memory-tasks.providers';
import { TaskListComponent } from '@features/tasks/ui/organisms/task-list/task-list.component';

async function setup(tasks = [aTask({ id: 'a', title: 'Buy milk' })]) {
  const { repository: taskRepository, providers: taskProviders } = provideInMemoryTasks(tasks);
  const { providers: categoryProviders } = provideInMemoryCategories([
    aCategory({ id: 'c1', name: 'Home' }),
  ]);
  TestBed.configureTestingModule({
    providers: [
      ...taskProviders,
      ...categoryProviders,
      { provide: CategoryTaskCleanup, useExisting: TasksStore },
      provideFakeFeedback(),
      ...provideFakeDate(),
      ...provideFakeFeatureFlags(),
    ],
  });
  const tasksStore = TestBed.inject(TasksStore);
  const categoriesStore = TestBed.inject(CategoriesStore);
  await Promise.all([tasksStore.load(), categoriesStore.load()]);

  const fixture = TestBed.createComponent(TaskListPage);
  fixture.detectChanges();
  const list: TaskListComponent = fixture.debugElement.query(
    By.directive(TaskListComponent),
  ).componentInstance;
  return {
    fixture,
    page: fixture.componentInstance,
    list,
    tasksStore,
    categoriesStore,
    taskRepository,
    feedback: TestBed.inject(FakeFeedbackService),
    flags: TestBed.inject(FakeFeatureFlags),
  };
}

describe('TaskListPage', () => {
  it('lists the stored tasks', async () => {
    // Arrange / Act
    const { fixture } = await setup();

    // Assert
    expect(fixture.nativeElement.textContent).toContain('Buy milk');
  });

  it('shows today as the capitalized long date subtitle', async () => {
    // Arrange / Act
    const { fixture } = await setup();

    // Assert
    expect(fixture.nativeElement.textContent).toContain('Viernes, 20 de noviembre');
  });

  it('toggles a task through the store and persists it', async () => {
    // Arrange
    const { list, taskRepository, tasksStore } = await setup();

    // Act
    list.toggleComplete.emit(tasksStore.tasks()[0]);
    await Promise.resolve();

    // Assert
    expect(taskRepository.tasks[0].completed).toBe(true);
  });

  it('creates a task from the form draft and confirms with a toast', async () => {
    // Arrange
    const { page, tasksStore, feedback } = await setup([]);

    // Act
    await page['onSave']({ title: 'Walk the dog', categoryId: 'c1' });

    // Assert
    expect(tasksStore.tasks()[0]).toMatchObject({ title: 'Walk the dog', categoryId: 'c1' });
    expect(feedback.toasts.map((toast) => toast.key)).toEqual(['tasks.feedback.created']);
  });

  it('updates the task being edited and confirms with a toast', async () => {
    // Arrange
    const { page, tasksStore, feedback } = await setup();
    page['openEdit'](tasksStore.tasks()[0]);

    // Act
    await page['onSave']({ title: 'Buy oat milk', categoryId: null });

    // Assert
    expect(tasksStore.tasks()[0].title).toBe('Buy oat milk');
    expect(feedback.toasts.map((toast) => toast.key)).toEqual(['tasks.feedback.updated']);
    expect(page['isFormOpen']()).toBe(false);
  });

  it('removes a task and offers to undo', async () => {
    // Arrange
    const { list, tasksStore, feedback } = await setup();

    // Act
    list.remove.emit(tasksStore.tasks()[0]);
    await vi.waitFor(() => expect(feedback.undoToasts).toHaveLength(1));

    // Assert
    expect(feedback.undoToasts[0].key).toBe('tasks.feedback.deleted');
    expect(tasksStore.tasks()).toEqual([]);
  });

  it('restores the task when the user taps undo', async () => {
    // Arrange
    const { page, tasksStore, feedback } = await setup();
    feedback.undoAnswer = true;

    // Act
    await page['onRemove'](tasksStore.tasks()[0]);

    // Assert
    expect(tasksStore.tasks().map((task) => task.id)).toEqual(['a']);
  });

  it('keeps the task removed when the undo toast times out', async () => {
    // Arrange
    const { page, tasksStore, feedback } = await setup();
    feedback.undoAnswer = false;

    // Act
    await page['onRemove'](tasksStore.tasks()[0]);

    // Assert
    expect(tasksStore.tasks()).toEqual([]);
  });

  it('shows an error toast and keeps the task when persisting fails', async () => {
    // Arrange
    const { page, tasksStore, taskRepository, feedback } = await setup();
    taskRepository.failNextSaveWith = new Error('disk');

    // Act
    await page['onToggle'](tasksStore.tasks()[0]);

    // Assert
    expect(feedback.errors.map((error) => error.key)).toEqual(['feedback.error']);
    expect(tasksStore.tasks()[0].completed).toBe(false);
  });

  it('falls back to all tasks when the filtered category is deleted', async () => {
    // Arrange
    const { fixture, page, list, categoriesStore } = await setup([
      aTask({ id: 'a', categoryId: 'c1' }),
      aTask({ id: 'b', categoryId: null }),
    ]);
    page['filter'].set({ kind: TaskFilterKind.Category, categoryId: 'c1' });
    fixture.detectChanges();
    expect(list.tasks()).toHaveLength(1);

    // Act
    await categoriesStore.remove('c1');
    fixture.detectChanges();

    // Assert
    expect(list.tasks()).toHaveLength(2);
  });
});

describe('TaskListPage with categories switched off', () => {
  const TASKS = [
    aTask({ id: 'a', title: 'Work item', categoryId: 'c1' }),
    aTask({ id: 'b', title: 'Loose item', categoryId: null }),
  ];

  it('hides the category filter chips and the category tags', async () => {
    // Arrange
    const { fixture, flags } = await setup(TASKS);
    expect(fixture.nativeElement.querySelector('app-category-filter')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Home');

    // Act
    flags.set(FeatureFlag.CategoriesEnabled, false);
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.querySelector('app-category-filter')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-color-tag')).toBeNull();
  });

  it('ignores a selected category filter and shows every task', async () => {
    // Arrange
    const { fixture, page, list, flags } = await setup(TASKS);
    page['filter'].set({ kind: TaskFilterKind.Category, categoryId: 'c1' });
    fixture.detectChanges();
    expect(list.tasks()).toHaveLength(1);

    // Act
    flags.set(FeatureFlag.CategoriesEnabled, false);
    fixture.detectChanges();

    // Assert
    expect(list.tasks()).toHaveLength(2);
  });

  it('restores the filter and the tags when the flag comes back', async () => {
    // Arrange
    const { fixture, page, list, flags } = await setup(TASKS);
    page['filter'].set({ kind: TaskFilterKind.Category, categoryId: 'c1' });
    flags.set(FeatureFlag.CategoriesEnabled, false);
    fixture.detectChanges();

    // Act
    flags.set(FeatureFlag.CategoriesEnabled, true);
    fixture.detectChanges();

    // Assert
    expect(list.tasks()).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('app-color-tag')).not.toBeNull();
  });
});

describe('TaskListPage item menu', () => {
  it('opens the edit form for the task when "Editar" is chosen', async () => {
    // Arrange
    const { list, tasksStore, feedback, page } = await setup();
    feedback.itemActionAnswer = ItemAction.Edit;

    // Act
    list.menuRequested.emit(tasksStore.tasks()[0]);
    await vi.waitFor(() => expect(page['isFormOpen']()).toBe(true));

    // Assert
    expect(feedback.itemActionSheets).toEqual([{ header: 'Buy milk' }]);
    expect(page['editingTask']()?.id).toBe('a');
  });

  it('removes the task with an undo toast when "Eliminar" is chosen', async () => {
    // Arrange
    const { list, tasksStore, feedback } = await setup();
    feedback.itemActionAnswer = ItemAction.Delete;

    // Act
    list.menuRequested.emit(tasksStore.tasks()[0]);
    await vi.waitFor(() => expect(feedback.undoToasts).toHaveLength(1));

    // Assert
    expect(tasksStore.tasks()).toEqual([]);
  });

  it('does nothing when the sheet is cancelled', async () => {
    // Arrange
    const { page, tasksStore, feedback } = await setup();
    feedback.itemActionAnswer = null;

    // Act
    await page['onMenu'](tasksStore.tasks()[0]);

    // Assert
    expect(page['isFormOpen']()).toBe(false);
    expect(tasksStore.tasks()).toHaveLength(1);
    expect(feedback.undoToasts).toEqual([]);
  });
});
