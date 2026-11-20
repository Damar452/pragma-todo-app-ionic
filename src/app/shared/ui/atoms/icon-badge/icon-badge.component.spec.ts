import { TestBed } from '@angular/core/testing';

import { IconBadgeComponent } from './icon-badge.component';

describe('IconBadgeComponent', () => {
  it('renders the icon hidden from assistive tech', () => {
    // Arrange
    const fixture = TestBed.createComponent(IconBadgeComponent);
    fixture.componentRef.setInput('icon', 'pricetag');
    fixture.componentRef.setInput('color', '#10B981');

    // Act
    fixture.detectChanges();

    // Assert
    const icon: HTMLElement & { name?: string } = fixture.nativeElement.querySelector('ion-icon');
    expect(icon.name).toBe('pricetag');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });

  it('exposes the color and size to the styles', () => {
    // Arrange
    const fixture = TestBed.createComponent(IconBadgeComponent);
    fixture.componentRef.setInput('icon', 'pricetag');
    fixture.componentRef.setInput('color', '#10B981');
    fixture.componentRef.setInput('size', 'sm');

    // Act
    fixture.detectChanges();

    // Assert
    const host: HTMLElement = fixture.nativeElement;
    expect(host.style.getPropertyValue('--badge-color')).toBe('#10B981');
    expect(host.classList.contains('badge--sm')).toBe(true);
  });
});
