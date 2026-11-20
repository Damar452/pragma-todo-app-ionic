import { TestBed } from '@angular/core/testing';

import { StatusPillComponent } from './status-pill.component';

describe('StatusPillComponent', () => {
  it('renders the label', () => {
    // Arrange
    const fixture = TestBed.createComponent(StatusPillComponent);
    fixture.componentRef.setInput('label', 'Done');

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.textContent).toContain('Done');
  });

  it('applies the tone class', () => {
    // Arrange
    const fixture = TestBed.createComponent(StatusPillComponent);
    fixture.componentRef.setInput('label', 'Done');
    fixture.componentRef.setInput('tone', 'success');

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.classList.contains('pill--success')).toBe(true);
  });
});
