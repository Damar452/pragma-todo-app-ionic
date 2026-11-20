import { TestBed } from '@angular/core/testing';

import type { CategoryDraft } from '../../../domain/category-draft.model';

import { CategoryFormComponent } from './category-form.component';

function setup() {
  const fixture = TestBed.createComponent(CategoryFormComponent);
  fixture.componentRef.setInput('colors', ['#111111', '#222222']);
  fixture.detectChanges();
  const emitted: CategoryDraft[] = [];
  fixture.componentInstance.save.subscribe((draft) => emitted.push(draft));
  const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
  return { fixture, form, emitted };
}

describe('CategoryFormComponent', () => {
  it('does not emit save when the name is empty', () => {
    // Arrange
    const { form, emitted } = setup();

    // Act
    form.dispatchEvent(new Event('submit'));

    // Assert
    expect(emitted).toEqual([]);
  });

  it('emits the prefilled name with the chosen color', () => {
    // Arrange
    const { fixture, form, emitted } = setup();
    fixture.componentRef.setInput('category', { id: 'c1', name: ' Work ', color: '#111111' });
    fixture.detectChanges();
    const swatches: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button.swatch'),
    );

    // Act
    swatches[1].click();
    form.dispatchEvent(new Event('submit'));

    // Assert
    expect(emitted).toEqual([{ name: 'Work', color: '#222222' }]);
  });
});
