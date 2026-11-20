import { TestBed } from '@angular/core/testing';

import { CategoryManagerPage } from './category-manager.page';

describe('CategoryManagerPage', () => {
  it('should create', () => {
    // Arrange
    const fixture = TestBed.createComponent(CategoryManagerPage);

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.componentInstance).toBeTruthy();
  });
});
