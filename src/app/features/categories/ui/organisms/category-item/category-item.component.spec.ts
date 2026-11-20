import { TestBed } from '@angular/core/testing';

import { CategoryItemComponent } from './category-item.component';

function setup(stats?: { total: number; completed: number }) {
  const fixture = TestBed.createComponent(CategoryItemComponent);
  fixture.componentRef.setInput('category', { id: 'c1', name: 'Work', color: '#4F46E5' });
  if (stats) {
    fixture.componentRef.setInput('stats', stats);
  }
  fixture.detectChanges();
  return fixture;
}

describe('CategoryItemComponent', () => {
  it('renders the name and task count', () => {
    // Arrange / Act
    const fixture = setup({ total: 4, completed: 1 });

    // Assert
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Work');
    expect(text).toContain('4 tareas');
  });

  it('uses the singular for a single task', () => {
    // Arrange / Act
    const fixture = setup({ total: 1, completed: 0 });

    // Assert
    expect(fixture.nativeElement.textContent).toContain('1 tarea');
    expect(fixture.nativeElement.textContent).not.toContain('1 tareas');
  });

  it.each([
    [0, 'Sin tareas'],
    [1, '1 tarea'],
    [2, '2 tareas'],
    [11, '11 tareas'],
  ])('pluralizes the task count for %i tasks', (total, expected) => {
    // Arrange / Act
    const fixture = setup({ total, completed: 0 });

    // Assert
    const count: HTMLElement = fixture.nativeElement.querySelector('.count');
    expect(count.textContent?.trim()).toBe(expected);
  });

  it('shows the completed share in the progress ring', () => {
    // Arrange / Act
    const fixture = setup({ total: 4, completed: 1 });

    // Assert
    const ring: HTMLElement = fixture.nativeElement.querySelector('app-progress-ring');
    expect(ring.getAttribute('aria-valuenow')).toBe('25');
  });

  it('shows an empty ring when the category has no tasks', () => {
    // Arrange / Act
    const fixture = setup();

    // Assert
    const ring: HTMLElement = fixture.nativeElement.querySelector('app-progress-ring');
    expect(ring.getAttribute('aria-valuenow')).toBe('0');
    expect(fixture.nativeElement.textContent).toContain('Sin tareas');
  });

  it('emits edit when the edit option is clicked', () => {
    // Arrange
    const fixture = setup();
    let edited = 0;
    fixture.componentInstance.edit.subscribe(() => edited++);

    // Act
    fixture.nativeElement.querySelector('ion-item-option[aria-label="Editar"]').click();

    // Assert
    expect(edited).toBe(1);
  });

  it('emits menuRequested, and not edit, when the ⋮ button is clicked', () => {
    // Arrange
    const fixture = setup();
    let menus = 0;
    let edits = 0;
    fixture.componentInstance.menuRequested.subscribe(() => menus++);
    fixture.componentInstance.edit.subscribe(() => edits++);

    // Act
    fixture.nativeElement.querySelector('ion-button.menu-button').click();

    // Assert
    expect(menus).toBe(1);
    expect(edits).toBe(0);
  });

  it('labels the ⋮ button with the category name', () => {
    // Arrange / Act
    const fixture = setup();

    // Assert
    const button: HTMLElement = fixture.nativeElement.querySelector('ion-button.menu-button');
    expect(button.getAttribute('aria-label')).toBe('Más opciones para Work');
  });

  it('emits edit when the card body is tapped', () => {
    // Arrange
    const fixture = setup();
    let edits = 0;
    fixture.componentInstance.edit.subscribe(() => edits++);

    // Act
    fixture.nativeElement.querySelector('ion-item').click();

    // Assert
    expect(edits).toBe(1);
  });
});
