import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { TranslocoPipe } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { checkboxOutline, pricetagsOutline } from 'ionicons/icons';

import { FEATURE_FLAG_DEFAULTS } from '@core/feature-flags/feature-flags';

@Component({
  selector: 'app-tabs-layout',
  templateUrl: 'tabs-layout.component.html',
  styleUrl: 'tabs-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, TranslocoPipe],
})
export class TabsLayoutComponent {
  /** Will be wired to the `categories_enabled` feature flag. */
  protected readonly categoriesEnabled = signal<boolean>(FEATURE_FLAG_DEFAULTS.categories_enabled);

  constructor() {
    addIcons({ checkboxOutline, pricetagsOutline });
  }
}
