import { TestBed } from '@angular/core/testing';

import { ColorDotComponent } from './color-dot.component';

describe('ColorDotComponent', () => {
  it('paints the dot with the given color and hides it from assistive tech', () => {
    // Arrange
    const fixture = TestBed.createComponent(ColorDotComponent);
    fixture.componentRef.setInput('color', '#ff0000');

    // Act
    fixture.detectChanges();

    // Assert
    const dot: HTMLElement = fixture.nativeElement.querySelector('.dot');
    expect(dot.style.backgroundColor).toBe('rgb(255, 0, 0)');
    expect(dot.getAttribute('aria-hidden')).toBe('true');
  });
});
