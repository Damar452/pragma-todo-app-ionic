import { TestBed } from '@angular/core/testing';

import type { Task } from '../../../domain/task.model';

import { TaskListComponent } from './task-list.component';

const TASKS: Task[] = [
  { id: 't1', title: 'One', completed: false, categoryId: 'c1', createdAt: 1 },
  { id: 't2', title: 'Two', completed: true, categoryId: null, createdAt: 2 },
];

describe('TaskListComponent', () => {
  it('renders an empty state when there are no tasks', () => {
    // Arrange
    const fixture = TestBed.createComponent(TaskListComponent);
    fixture.componentRef.setInput('tasks', []);
    fixture.componentRef.setInput('categories', []);

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.textContent).toContain('No hay tareas aquí');
  });

  it('renders one item per task with its category', () => {
    // Arrange
    const fixture = TestBed.createComponent(TaskListComponent);
    fixture.componentRef.setInput('tasks', TASKS);
    fixture.componentRef.setInput('categories', [{ id: 'c1', name: 'Work', color: '#4F46E5' }]);

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.querySelectorAll('app-task-item').length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Work');
  });

  it('forwards menuRequested with the task', () => {
    // Arrange
    const fixture = TestBed.createComponent(TaskListComponent);
    fixture.componentRef.setInput('tasks', [TASKS[0]]);
    fixture.componentRef.setInput('categories', []);
    fixture.detectChanges();
    const requested: unknown[] = [];
    fixture.componentInstance.menuRequested.subscribe((value) => requested.push(value));

    // Act
    fixture.nativeElement.querySelector('ion-button.menu-button').click();

    // Assert
    expect(requested).toEqual([TASKS[0]]);
  });
});
