import { TestBed } from '@angular/core/testing';

import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
  it('emits the chosen color', () => {
    // Arrange
    const fixture = TestBed.createComponent(ColorPickerComponent);
    fixture.componentRef.setInput('colors', ['#111111', '#222222']);
    fixture.componentRef.setInput('selected', '#111111');
    fixture.detectChanges();
    const emitted: string[] = [];
    fixture.componentInstance.selectedChange.subscribe((c) => emitted.push(c));

    // Act
    const buttons: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    buttons[1].click();

    // Assert
    expect(emitted).toEqual(['#222222']);
  });
});
