import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { TranslocoPipe } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { checkmark } from 'ionicons/icons';

import { ColorDotComponent } from '@shared/ui/atoms/color-dot/color-dot.component';

@Component({
  selector: 'app-color-picker',
  templateUrl: 'color-picker.component.html',
  styleUrl: 'color-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon, ColorDotComponent, TranslocoPipe],
})
export class ColorPickerComponent {
  readonly colors = input.required<readonly string[]>();
  readonly selected = input.required<string>();
  readonly selectedChange = output<string>();

  constructor() {
    addIcons({ checkmark });
  }
}
