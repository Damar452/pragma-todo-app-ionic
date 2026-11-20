import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { StatusPillTone } from './status-pill.enums';

@Component({
  selector: 'app-status-pill',
  templateUrl: 'status-pill.component.html',
  styleUrl: 'status-pill.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '"pill--" + tone()' },
})
export class StatusPillComponent {
  readonly label = input.required<string>();
  readonly tone = input<StatusPillTone>(StatusPillTone.Neutral);
}
