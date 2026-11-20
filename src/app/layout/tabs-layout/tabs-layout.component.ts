import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { TranslocoPipe } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { checkboxOutline, pricetagsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs-layout',
  templateUrl: 'tabs-layout.component.html',
  styleUrl: 'tabs-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, TranslocoPipe],
})
export class TabsLayoutComponent {
  /** Will be wired to the `categories_enabled` feature flag. */
  protected readonly categoriesEnabled = signal(true);

  constructor() {
    addIcons({ checkboxOutline, pricetagsOutline });
  }
}
