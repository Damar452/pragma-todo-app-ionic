import { TestBed } from '@angular/core/testing';

import { ListPageTemplateComponent } from './list-page-template.component';

describe('ListPageTemplateComponent', () => {
  it('renders the page title', () => {
    // Arrange
    const fixture = TestBed.createComponent(ListPageTemplateComponent);
    fixture.componentRef.setInput('title', 'Tasks');

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Tasks');
  });

  it('renders the subtitle under the title when provided', () => {
    // Arrange
    const fixture = TestBed.createComponent(ListPageTemplateComponent);
    fixture.componentRef.setInput('title', 'Today');
    fixture.componentRef.setInput('subtitle', 'Thursday, November 20');

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.querySelector('.subtitle').textContent).toContain(
      'Thursday, November 20',
    );
  });

  it('omits the subtitle when not provided', () => {
    // Arrange
    const fixture = TestBed.createComponent(ListPageTemplateComponent);
    fixture.componentRef.setInput('title', 'Tasks');

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.querySelector('.subtitle')).toBeNull();
  });
});
