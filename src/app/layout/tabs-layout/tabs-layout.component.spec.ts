import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TabsLayoutComponent } from './tabs-layout.component';

describe('TabsLayoutComponent', () => {
  it('renders the tasks and categories tabs', () => {
    // Arrange
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(TabsLayoutComponent);

    // Act
    fixture.detectChanges();

    // Assert
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Tareas');
    expect(text).toContain('Categorías');
  });
});
