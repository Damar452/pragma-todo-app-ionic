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

  describe('duplicate name', () => {
    it('shows an inline error and does not emit when the name is taken', () => {
      // Arrange
      const { fixture, form, emitted } = setup();
      fixture.componentRef.setInput('isNameTaken', (name: string) => name === 'Casa');
      fixture.detectChanges();
      const input: HTMLIonInputElement = fixture.nativeElement.querySelector('ion-input');

      // Act: type the name the way the user does, through the input's event
      input.value = 'Casa';
      input.dispatchEvent(new CustomEvent('ionInput'));
      fixture.detectChanges();
      form.dispatchEvent(new Event('submit'));

      // Assert
      expect(input.errorText).toBe('Ya existe una categoría con ese nombre');
      expect(emitted).toEqual([]);
    });

    it('emits once the name is available', () => {
      // Arrange
      const { fixture, form, emitted } = setup();
      fixture.componentRef.setInput('isNameTaken', (name: string) => name === 'Casa');
      fixture.detectChanges();

      // Act
      fixture.componentInstance['form'].controls.name.setValue('Trabajo');
      form.dispatchEvent(new Event('submit'));

      // Assert
      expect(emitted).toEqual([{ name: 'Trabajo', color: '#111111' }]);
    });

    it('revalidates when the predicate changes', () => {
      // Arrange
      const { fixture } = setup();
      const name = fixture.componentInstance['form'].controls.name;
      name.setValue('Casa');
      fixture.componentRef.setInput('isNameTaken', (value: string) => value === 'Casa');

      // Act
      fixture.detectChanges();

      // Assert
      expect(name.hasError('nameTaken')).toBe(true);
    });
  });
});
