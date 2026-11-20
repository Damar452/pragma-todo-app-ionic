import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular';

import { hideSplashScreen } from '@core/platform/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private readonly platform = inject(Platform);

  constructor() {
    void this.platform.ready().then(hideSplashScreen);
  }
}
