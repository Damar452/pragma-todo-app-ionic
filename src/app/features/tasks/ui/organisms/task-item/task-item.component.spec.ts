import { TestBed } from '@angular/core/testing';

import { TaskItemComponent } from './task-item.component';

import type { Task } from '@features/tasks/domain/task.model';

const TASK: Task = {
  id: 't1',
  title: 'Buy milk',
  completed: false,
  categoryId: null,
  createdAt: 1,
};

describe('TaskItemComponent', () => {
  it('emits toggleComplete when the checkbox changes', () => {
    // Arrange
    const fixture = TestBed.createComponent(TaskItemComponent);
    fixture.componentRef.setInput('task', TASK);
    fixture.detectChanges();
    let toggled = 0;
    fixture.componentInstance.toggleComplete.subscribe(() => toggled++);
    const checkbox: HTMLElement = fixture.nativeElement.querySelector('ion-checkbox');

    // Act
    checkbox.dispatchEvent(new CustomEvent('ionChange', { detail: { checked: true } }));

    // Assert
    expect(toggled).toBe(1);
  });

  it('renders the title and the category tag', () => {
    // Arrange
    const fixture = TestBed.createComponent(TaskItemComponent);
    fixture.componentRef.setInput('task', TASK);
    fixture.componentRef.setInput('category', { id: 'c1', name: 'Home', color: '#10B981' });

    // Act
    fixture.detectChanges();

    // Assert
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Buy milk');
    expect(text).toContain('Home');
  });

  it('shows a "Pendiente" pill for open tasks and "Hecha" with strike-through when completed', () => {
    // Arrange
    const fixture = TestBed.createComponent(TaskItemComponent);
    fixture.componentRef.setInput('task', TASK);
    fixture.detectChanges();
    const pill: HTMLElement = fixture.nativeElement.querySelector('app-status-pill');
    expect(pill.textContent).toContain('Pendiente');

    // Act
    fixture.componentRef.setInput('task', { ...TASK, completed: true });
    fixture.detectChanges();

    // Assert
    expect(pill.textContent).toContain('Hecha');
    expect(fixture.nativeElement.querySelector('.title--done')).not.toBeNull();
  });

  describe('tap targets', () => {
    function setup() {
      const fixture = TestBed.createComponent(TaskItemComponent);
      fixture.componentRef.setInput('task', TASK);
      fixture.detectChanges();
      const counts = { edit: 0, menu: 0, toggle: 0 };
      fixture.componentInstance.edit.subscribe(() => counts.edit++);
      fixture.componentInstance.menuRequested.subscribe(() => counts.menu++);
      fixture.componentInstance.toggleComplete.subscribe(() => counts.toggle++);
      return { fixture, counts };
    }

    it('emits edit when the card body is tapped', () => {
      // Arrange
      const { fixture, counts } = setup();

      // Act
      fixture.nativeElement.querySelector('ion-item').click();

      // Assert
      expect(counts).toEqual({ edit: 1, menu: 0, toggle: 0 });
    });

    it('emits menuRequested, and not edit, when the ⋮ button is clicked', () => {
      // Arrange
      const { fixture, counts } = setup();

      // Act
      fixture.nativeElement.querySelector('ion-button.menu-button').click();

      // Assert
      expect(counts).toEqual({ edit: 0, menu: 1, toggle: 0 });
    });

    it('labels the ⋮ button with the task title', () => {
      // Arrange
      const { fixture } = setup();

      // Assert
      const button: HTMLElement = fixture.nativeElement.querySelector('ion-button.menu-button');
      expect(button.getAttribute('aria-label')).toBe('Más opciones para Buy milk');
    });

    it('does not edit when the checkbox is tapped', () => {
      // Arrange
      const { fixture, counts } = setup();
      const checkbox: HTMLElement = fixture.nativeElement.querySelector('ion-checkbox');

      // Act
      checkbox.click();
      checkbox.dispatchEvent(new CustomEvent('ionChange', { detail: { checked: true } }));

      // Assert
      expect(counts).toEqual({ edit: 0, menu: 0, toggle: 1 });
    });
  });
});
