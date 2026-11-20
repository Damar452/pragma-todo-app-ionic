import { TestBed } from '@angular/core/testing';

import { ProgressRingComponent } from './progress-ring.component';

function setup(value: number) {
  const fixture = TestBed.createComponent(ProgressRingComponent);
  fixture.componentRef.setInput('value', value);
  fixture.componentRef.setInput('label', 'Progreso');
  fixture.detectChanges();
  const host: HTMLElement = fixture.nativeElement;
  return { fixture, host };
}

describe('ProgressRingComponent', () => {
  it('exposes the rounded percentage as a progressbar', () => {
    // Arrange / Act
    const { host } = setup(0.854);

    // Assert
    expect(host.getAttribute('role')).toBe('progressbar');
    expect(host.getAttribute('aria-valuenow')).toBe('85');
    expect(host.textContent).toContain('85%');
  });

  it('clamps values above 1 to 100', () => {
    // Arrange / Act
    const { host } = setup(1.7);

    // Assert
    expect(host.getAttribute('aria-valuenow')).toBe('100');
  });

  it('clamps negative values to 0', () => {
    // Arrange / Act
    const { host } = setup(-0.4);

    // Assert
    expect(host.getAttribute('aria-valuenow')).toBe('0');
  });

  it('hides the label when showLabel is false', () => {
    // Arrange
    const { fixture, host } = setup(0.5);

    // Act
    fixture.componentRef.setInput('showLabel', false);
    fixture.detectChanges();

    // Assert
    expect(host.querySelector('.label')).toBeNull();
  });

  it('offsets the stroke by the remaining fraction of the circumference', () => {
    // Arrange / Act
    const { fixture, host } = setup(0.5);
    fixture.componentRef.setInput('size', 50);
    fixture.componentRef.setInput('strokeWidth', 10);
    fixture.detectChanges();

    // Assert
    const circle = host.querySelector('.value') as SVGCircleElement;
    const circumference = 2 * Math.PI * 20;
    expect(Number(circle.getAttribute('stroke-dashoffset'))).toBeCloseTo(circumference / 2, 5);
  });
});
