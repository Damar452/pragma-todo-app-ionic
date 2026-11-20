import { TestBed } from '@angular/core/testing';

import { TaskFormComponent } from './task-form.component';

import type { TaskDraft } from '@features/tasks/domain/task-draft.model';

function setup() {
  const fixture = TestBed.createComponent(TaskFormComponent);
  fixture.componentRef.setInput('categories', []);
  fixture.detectChanges();
  const emitted: TaskDraft[] = [];
  fixture.componentInstance.save.subscribe((draft) => emitted.push(draft));
  const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
  return { fixture, form, emitted };
}

describe('TaskFormComponent', () => {
  it('does not emit save when the title is empty', () => {
    // Arrange
    const { form, emitted } = setup();

    // Act
    form.dispatchEvent(new Event('submit'));

    // Assert
    expect(emitted).toEqual([]);
  });

  it('emits a trimmed draft when the title is valid', () => {
    // Arrange
    const { fixture, form, emitted } = setup();
    fixture.componentRef.setInput('task', {
      id: 't1',
      title: '  Buy milk  ',
      completed: false,
      categoryId: 'c1',
      createdAt: 1,
    });
    fixture.detectChanges();

    // Act
    form.dispatchEvent(new Event('submit'));

    // Assert
    expect(emitted).toEqual([{ title: 'Buy milk', categoryId: 'c1' }]);
  });

  it('hides the category select but keeps the task category when saving', () => {
    // Arrange
    const { fixture, form, emitted } = setup();
    fixture.componentRef.setInput('showCategory', false);
    fixture.componentRef.setInput('task', {
      id: 't1',
      title: 'Buy milk',
      completed: false,
      categoryId: 'c1',
      createdAt: 1,
    });
    fixture.detectChanges();

    // Act
    form.dispatchEvent(new Event('submit'));

    // Assert
    expect(fixture.nativeElement.querySelector('ion-select')).toBeNull();
    expect(emitted).toEqual([{ title: 'Buy milk', categoryId: 'c1' }]);
  });
});
