import { TestBed } from '@angular/core/testing';

import { ProgressSummaryComponent } from './progress-summary.component';

function render(completed: number, total: number) {
  const fixture = TestBed.createComponent(ProgressSummaryComponent);
  fixture.componentRef.setInput('completed', completed);
  fixture.componentRef.setInput('total', total);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('ProgressSummaryComponent', () => {
  it('shows completed out of total', () => {
    // Arrange / Act
    const host = render(3, 7);

    // Assert
    expect(host.textContent).toContain('3 de 7 tareas completadas');
  });

  it('uses the singular when there is a single task', () => {
    // Arrange / Act
    const host = render(1, 1);

    // Assert
    expect(host.textContent).toContain('1 de 1 tarea completada');
  });

  it('invites the user to add a task when there are none', () => {
    // Arrange / Act
    const host = render(0, 0);

    // Assert
    expect(host.textContent).toContain('Planifica tu día');
    expect(host.textContent).toContain('Agrega tu primera tarea');
  });

  it.each([
    [0, 4, '¡Empecemos!'],
    [1, 4, '¡Sigue así!'],
    [2, 4, '¡Ya casi terminas!'],
    [3, 4, '¡Ya casi terminas!'],
    [4, 4, '¡Todo listo por hoy!'],
  ])('shows the headline for %i of %i completed', (completed, total, headline) => {
    // Arrange / Act
    const host = render(completed, total);

    // Assert
    expect(host.querySelector('.headline')?.textContent).toBe(headline);
  });

  it('feeds the progress ring with the completion ratio', () => {
    // Arrange / Act
    const host = render(1, 4);

    // Assert
    const ring = host.querySelector('app-progress-ring') as HTMLElement;
    expect(ring.getAttribute('aria-valuenow')).toBe('25');
  });
});
