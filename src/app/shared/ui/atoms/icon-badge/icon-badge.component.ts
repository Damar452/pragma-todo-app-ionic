import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IonIcon } from '@ionic/angular';

/** The icon must be registered with `addIcons` by whoever uses this component. */
@Component({
  selector: 'app-icon-badge',
  templateUrl: 'icon-badge.component.html',
  styleUrl: 'icon-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon],
  host: {
    '[class]': '"badge--" + size()',
    '[style.--badge-color]': 'color()',
  },
})
export class IconBadgeComponent {
  readonly icon = input.required<string>();
  /** Hex color: used for the icon and, at low opacity, for the background. */
  readonly color = input.required<string>();
  readonly size = input<'sm' | 'md'>('md');
}
