import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ColorDotComponent } from '@shared/ui/atoms/color-dot/color-dot.component';

@Component({
  selector: 'app-color-tag',
  templateUrl: 'color-tag.component.html',
  styleUrl: 'color-tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ColorDotComponent],
})
export class ColorTagComponent {
  readonly color = input.required<string>();
  readonly label = input.required<string>();
}
