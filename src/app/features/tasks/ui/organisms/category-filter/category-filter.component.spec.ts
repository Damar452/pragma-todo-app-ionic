import { TestBed } from '@angular/core/testing';

import { CategoryFilterComponent } from './category-filter.component';

import type { TaskFilter } from '@features/tasks/domain/task-filter.model';

describe('CategoryFilterComponent', () => {
  function setup() {
    const fixture = TestBed.createComponent(CategoryFilterComponent);
    fixture.componentRef.setInput('categories', [{ id: 'c1', name: 'Work', color: '#4F46E5' }]);
    fixture.componentRef.setInput('filter', { kind: 'all' } satisfies TaskFilter);
    fixture.detectChanges();
    const emitted: TaskFilter[] = [];
    fixture.componentInstance.filterChange.subscribe((f) => emitted.push(f));
    const chips: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('ion-chip'));
    return { chips, emitted };
  }

  it('offers All, each category and Uncategorized', () => {
    // Arrange / Act
    const { chips } = setup();

    // Assert
    expect(chips.map((c) => c.textContent?.trim())).toEqual(['Todas', 'Work', 'Sin categoría']);
  });

  it('emits a category filter when a category chip is clicked', () => {
    // Arrange
    const { chips, emitted } = setup();

    // Act
    chips[1].click();

    // Assert
    expect(emitted).toEqual([{ kind: 'category', categoryId: 'c1' }]);
  });

  it('emits the uncategorized filter for the last chip', () => {
    // Arrange
    const { chips, emitted } = setup();

    // Act
    chips[2].click();

    // Assert
    expect(emitted).toEqual([{ kind: 'uncategorized' }]);
  });
});
