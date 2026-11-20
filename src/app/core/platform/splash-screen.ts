interface CordovaSplashScreen {
  hide(): void;
}

interface CordovaNavigator extends Navigator {
  splashscreen?: CordovaSplashScreen;
}

/**
 * Hides the native Cordova splash screen. The splash is configured with
 * AutoHideSplashScreen=false so it stays up until the app is actually ready,
 * instead of a fixed delay. No-op in the browser.
 */
export function hideSplashScreen(): void {
  (navigator as CordovaNavigator).splashscreen?.hide();
}
