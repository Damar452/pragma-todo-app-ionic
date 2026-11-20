import { ChangeDetectionStrategy, Component, effect, inject, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { TranslocoPipe } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { checkboxOutline, pricetagsOutline } from 'ionicons/icons';

import { CATEGORIES_URL_PREFIX, TASKS_URL } from './tabs-layout.constants';

import { FeatureFlagPort } from '@core/feature-flags/feature-flag.port';
import { FeatureFlag } from '@core/feature-flags/feature-flags.enums';

@Component({
  selector: 'app-tabs-layout',
  templateUrl: 'tabs-layout.component.html',
  styleUrl: 'tabs-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, TranslocoPipe],
})
export class TabsLayoutComponent {
  private readonly router = inject(Router);

  protected readonly categoriesEnabled = inject(FeatureFlagPort).isEnabled(
    FeatureFlag.CategoriesEnabled,
  );

  constructor() {
    addIcons({ checkboxOutline, pricetagsOutline });
    // The flag can flip while the user is looking at the categories screen: leave it once.
    effect(() => {
      if (
        !this.categoriesEnabled() &&
        untracked(() => this.router.url.startsWith(CATEGORIES_URL_PREFIX))
      ) {
        void this.router.navigateByUrl(TASKS_URL);
      }
    });
  }
}
