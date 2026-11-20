import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IonChip } from '@ionic/angular';

import { ColorDotComponent } from '../../atoms/color-dot/color-dot.component';

import type { ChipOption } from './chip-selector.models';

@Component({
  selector: 'app-chip-selector',
  templateUrl: 'chip-selector.component.html',
  styleUrl: 'chip-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonChip, ColorDotComponent],
})
export class ChipSelectorComponent {
  readonly options = input.required<readonly ChipOption[]>();
  readonly selectedId = input.required<string>();
  readonly selectedChange = output<string>();
}
