import { TestBed } from '@angular/core/testing';

import { SectionHeaderComponent } from './section-header.component';

describe('SectionHeaderComponent', () => {
  it('renders the title and the count', () => {
    // Arrange
    const fixture = TestBed.createComponent(SectionHeaderComponent);
    fixture.componentRef.setInput('title', 'Tasks');
    fixture.componentRef.setInput('count', 6);

    // Act
    fixture.detectChanges();

    // Assert
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Tasks');
    expect(text).toContain('6');
  });
});
