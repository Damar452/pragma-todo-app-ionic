import { TestBed } from '@angular/core/testing';

import { ChipSelectorComponent } from './chip-selector.component';

describe('ChipSelectorComponent', () => {
  it('emits the id of the clicked option', () => {
    // Arrange
    const fixture = TestBed.createComponent(ChipSelectorComponent);
    fixture.componentRef.setInput('options', [
      { id: 'a', label: 'Alpha' },
      { id: 'b', label: 'Beta' },
    ]);
    fixture.componentRef.setInput('selectedId', 'a');
    fixture.detectChanges();
    const emitted: string[] = [];
    fixture.componentInstance.selectedChange.subscribe((id) => emitted.push(id));

    // Act
    const chips: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('ion-chip'));
    chips[1].click();

    // Assert
    expect(emitted).toEqual(['b']);
  });

  it('marks only the selected option as pressed', () => {
    // Arrange
    const fixture = TestBed.createComponent(ChipSelectorComponent);
    fixture.componentRef.setInput('options', [
      { id: 'a', label: 'Alpha' },
      { id: 'b', label: 'Beta' },
    ]);
    fixture.componentRef.setInput('selectedId', 'b');

    // Act
    fixture.detectChanges();

    // Assert
    const pressed = Array.from(fixture.nativeElement.querySelectorAll('ion-chip')).map((chip) =>
      (chip as HTMLElement).getAttribute('aria-pressed'),
    );
    expect(pressed).toEqual(['false', 'true']);
  });
});
