import { TestBed } from '@angular/core/testing';

import { TaskListPage } from './task-list.page';

describe('TaskListPage', () => {
  it('should create', () => {
    // Arrange
    const fixture = TestBed.createComponent(TaskListPage);

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance).toBeTruthy();
  });
});
