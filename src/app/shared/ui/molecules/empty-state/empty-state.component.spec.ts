import { TestBed } from '@angular/core/testing';

import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  it('renders the title and message', () => {
    // Arrange
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('icon', 'checkbox-outline');
    fixture.componentRef.setInput('title', 'Nothing here');
    fixture.componentRef.setInput('message', 'Add something');

    // Act
    fixture.detectChanges();

    // Assert
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Nothing here');
    expect(text).toContain('Add something');
  });
});
