import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IonIcon } from '@ionic/angular';

/** The icon must be registered with `addIcons` by whoever uses this component. */
@Component({
  selector: 'app-empty-state',
  templateUrl: 'empty-state.component.html',
  styleUrl: 'empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon],
})
export class EmptyStateComponent {
  readonly icon = input.required<string>();
  readonly title = input.required<string>();
  readonly message = input.required<string>();
}
