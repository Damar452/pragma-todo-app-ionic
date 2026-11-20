import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type StatusTone = 'success' | 'primary' | 'neutral';

@Component({
  selector: 'app-status-pill',
  templateUrl: 'status-pill.component.html',
  styleUrl: 'status-pill.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '"pill--" + tone()' },
})
export class StatusPillComponent {
  readonly label = input.required<string>();
  readonly tone = input<StatusTone>('neutral');
}
