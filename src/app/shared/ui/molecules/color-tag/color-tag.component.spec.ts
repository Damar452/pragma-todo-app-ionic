import { TestBed } from '@angular/core/testing';

import { ColorTagComponent } from './color-tag.component';

describe('ColorTagComponent', () => {
  it('renders the label', () => {
    // Arrange
    const fixture = TestBed.createComponent(ColorTagComponent);
    fixture.componentRef.setInput('color', '#4F46E5');
    fixture.componentRef.setInput('label', 'Work');

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.textContent).toContain('Work');
  });
});
