import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ColorDotSize } from './color-dot.enums';

@Component({
  selector: 'app-color-dot',
  templateUrl: 'color-dot.component.html',
  styleUrl: 'color-dot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorDotComponent {
  readonly color = input.required<string>();
  readonly size = input<ColorDotSize>(ColorDotSize.Md);
}
