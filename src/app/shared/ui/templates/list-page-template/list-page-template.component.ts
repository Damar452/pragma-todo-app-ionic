import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IonContent, IonFab, IonHeader, IonToolbar } from '@ionic/angular';

/**
 * Slots: `[slot-toolbar]` (below the title block), default (main content) and
 * `[slot-fab]` (rendered inside a bottom-end `ion-fab`).
 */
@Component({
  selector: 'app-list-page-template',
  templateUrl: 'list-page-template.component.html',
  styleUrl: 'list-page-template.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonToolbar, IonContent, IonFab],
})
export class ListPageTemplateComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}
