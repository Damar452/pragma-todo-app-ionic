import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-color-dot',
  templateUrl: 'color-dot.component.html',
  styleUrl: 'color-dot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorDotComponent {
  readonly color = input.required<string>();
  readonly size = input<'sm' | 'md' | 'lg'>('md');
}
