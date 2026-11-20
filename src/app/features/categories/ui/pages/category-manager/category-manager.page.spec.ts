import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CategoryManagerPage } from './category-manager.page';

import { ItemAction } from '@core/feedback/feedback.enums';
import {
  FakeFeedbackService,
  provideFakeFeedback,
} from '@core/feedback/testing/fake-feedback.service';
import { aCategory } from '@features/categories/domain/category-fixture.testing';
import { CategoriesStore } from '@features/categories/state/categories.store';
import { provideInMemoryCategories } from '@features/categories/state/testing/in-memory-categories.providers';
import { CategoryListComponent } from '@features/categories/ui/organisms/category-list/category-list.component';
import { aTask } from '@features/tasks/domain/task-fixture.testing';
import { TasksStore } from '@features/tasks/state/tasks.store';
import { provideInMemoryTasks } from '@features/tasks/state/testing/in-memory-tasks.providers';

async function setup() {
  const { repository: categoryRepository, providers: categoryProviders } =
    provideInMemoryCategories([aCategory({ id: 'c1', name: 'Educación' })]);
  const { providers: taskProviders } = provideInMemoryTasks([
    aTask({ id: 't1', categoryId: 'c1' }),
    aTask({ id: 't2', categoryId: 'c1', completed: true }),
  ]);
  TestBed.configureTestingModule({
    providers: [...categoryProviders, ...taskProviders, provideFakeFeedback()],
  });
  const categoriesStore = TestBed.inject(CategoriesStore);
  const tasksStore = TestBed.inject(TasksStore);
  await Promise.all([categoriesStore.load(), tasksStore.load()]);

  const fixture = TestBed.createComponent(CategoryManagerPage);
  fixture.detectChanges();
  return {
    fixture,
    page: fixture.componentInstance,
    categoriesStore,
    tasksStore,
    categoryRepository,
    feedback: TestBed.inject(FakeFeedbackService),
  };
}

describe('CategoryManagerPage', () => {
  it('lists the stored categories', async () => {
    // Arrange / Act
    const { fixture } = await setup();

    // Assert
    expect(fixture.nativeElement.textContent).toContain('Educación');
  });

  it('creates a category from the form draft and confirms with a toast', async () => {
    // Arrange
    const { page, categoriesStore, feedback } = await setup();

    // Act
    await page['onSave']({ name: 'Casa', color: '#111111' });

    // Assert
    expect(categoriesStore.categories().map((category) => category.name)).toEqual([
      'Casa',
      'Educación',
    ]);
    expect(feedback.toasts.map((toast) => toast.key)).toEqual(['categories.feedback.created']);
  });

  it('updates the category being edited', async () => {
    // Arrange
    const { page, categoriesStore, feedback } = await setup();
    page['openEdit'](categoriesStore.categories()[0]);

    // Act
    await page['onSave']({ name: 'Estudio', color: '#222222' });

    // Assert
    expect(categoriesStore.categories()[0]).toMatchObject({ name: 'Estudio', color: '#222222' });
    expect(feedback.toasts.map((toast) => toast.key)).toEqual(['categories.feedback.updated']);
  });

  describe('name validation', () => {
    it('flags a name another category uses, ignoring case and accents', async () => {
      // Arrange
      const { page } = await setup();

      // Act / Assert
      expect(page['isNameTaken']()('educacion')).toBe(true);
    });

    it('lets the category being edited keep its own name', async () => {
      // Arrange
      const { page, categoriesStore } = await setup();
      page['openEdit'](categoriesStore.categories()[0]);

      // Act / Assert
      expect(page['isNameTaken']()('EDUCACIÓN')).toBe(false);
    });
  });

  describe('remove', () => {
    it('asks for a destructive confirmation that mentions how many tasks are affected', async () => {
      // Arrange
      const { page, categoriesStore, feedback } = await setup();

      // Act
      await page['onRemove'](categoriesStore.categories()[0]);

      // Assert
      expect(feedback.confirmations[0]).toMatchObject({
        params: { name: 'Educación', count: 2 },
        destructive: true,
      });
    });

    it('deletes the category and uncategorizes its tasks once confirmed', async () => {
      // Arrange
      const { page, categoriesStore, tasksStore, feedback } = await setup();
      feedback.confirmAnswer = true;

      // Act
      await page['onRemove'](categoriesStore.categories()[0]);

      // Assert
      expect(categoriesStore.categories()).toEqual([]);
      expect(tasksStore.tasks().every((task) => task.categoryId === null)).toBe(true);
      expect(feedback.toasts.map((toast) => toast.key)).toEqual(['categories.feedback.deleted']);
    });

    it('does nothing when the user cancels', async () => {
      // Arrange
      const { page, categoriesStore, tasksStore, feedback } = await setup();
      feedback.confirmAnswer = false;

      // Act
      await page['onRemove'](categoriesStore.categories()[0]);

      // Assert
      expect(categoriesStore.categories()).toHaveLength(1);
      expect(tasksStore.tasks().every((task) => task.categoryId === 'c1')).toBe(true);
    });

    it('shows an error toast and keeps the category when persisting fails', async () => {
      // Arrange
      const { page, categoriesStore, categoryRepository, feedback } = await setup();
      categoryRepository.failNextSaveWith = new Error('disk');

      // Act
      await page['onRemove'](categoriesStore.categories()[0]);

      // Assert
      expect(feedback.errors.map((error) => error.key)).toEqual(['feedback.error']);
      expect(categoriesStore.categories()).toHaveLength(1);
    });
  });
});

describe('CategoryManagerPage item menu', () => {
  function listOf(fixture: Awaited<ReturnType<typeof setup>>['fixture']): CategoryListComponent {
    return fixture.debugElement.query(By.directive(CategoryListComponent)).componentInstance;
  }

  it('opens the edit form for the category when "Editar" is chosen', async () => {
    // Arrange
    const { fixture, page, categoriesStore, feedback } = await setup();
    feedback.itemActionAnswer = ItemAction.Edit;

    // Act
    listOf(fixture).menuRequested.emit(categoriesStore.categories()[0]);
    await vi.waitFor(() => expect(page['isFormOpen']()).toBe(true));

    // Assert
    expect(feedback.itemActionSheets).toEqual([{ header: 'Educación' }]);
    expect(page['editingCategory']()?.id).toBe('c1');
  });

  it('asks for confirmation before deleting when "Eliminar" is chosen', async () => {
    // Arrange
    const { fixture, categoriesStore, feedback } = await setup();
    feedback.itemActionAnswer = ItemAction.Delete;
    feedback.confirmAnswer = true;

    // Act
    listOf(fixture).menuRequested.emit(categoriesStore.categories()[0]);
    await vi.waitFor(() => expect(feedback.confirmations).toHaveLength(1));

    // Assert
    await vi.waitFor(() => expect(categoriesStore.categories()).toEqual([]));
  });

  it('does nothing when the sheet is cancelled', async () => {
    // Arrange
    const { page, categoriesStore, feedback } = await setup();
    feedback.itemActionAnswer = null;

    // Act
    await page['onMenu'](categoriesStore.categories()[0]);

    // Assert
    expect(page['isFormOpen']()).toBe(false);
    expect(feedback.confirmations).toEqual([]);
    expect(categoriesStore.categories()).toHaveLength(1);
  });
});
