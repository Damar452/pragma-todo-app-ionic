import { TestBed } from '@angular/core/testing';

import type { Task } from '../../../domain/task.model';

import { TaskItemComponent } from './task-item.component';

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
});
