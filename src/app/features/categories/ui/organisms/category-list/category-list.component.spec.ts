import { TestBed } from '@angular/core/testing';

import { CategoryListComponent } from './category-list.component';

describe('CategoryListComponent', () => {
  it('renders an empty state when there are no categories', () => {
    // Arrange
    const fixture = TestBed.createComponent(CategoryListComponent);
    fixture.componentRef.setInput('categories', []);

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.textContent).toContain('Aún no tienes categorías');
  });

  it('renders the section header and each category with its task stats', () => {
    // Arrange
    const fixture = TestBed.createComponent(CategoryListComponent);
    fixture.componentRef.setInput('categories', [{ id: 'c1', name: 'Work', color: '#4F46E5' }]);
    fixture.componentRef.setInput('statsByCategory', new Map([['c1', { total: 3, completed: 1 }]]));

    // Act
    fixture.detectChanges();

    // Assert
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Grupos');
    expect(text).toContain('Work');
    expect(text).toContain('3 tareas');
  });

  it('forwards menuRequested with the category', () => {
    // Arrange
    const category = { id: 'c1', name: 'Work', color: '#4F46E5' };
    const fixture = TestBed.createComponent(CategoryListComponent);
    fixture.componentRef.setInput('categories', [category]);
    fixture.detectChanges();
    const requested: unknown[] = [];
    fixture.componentInstance.menuRequested.subscribe((value) => requested.push(value));

    // Act
    fixture.nativeElement.querySelector('ion-button.menu-button').click();

    // Assert
    expect(requested).toEqual([category]);
  });
});
