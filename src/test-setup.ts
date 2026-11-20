import { TestBed } from '@angular/core/testing';

import { provideTranslocoTesting } from './testing/transloco-testing';

// Polyfills for running unit tests under jsdom (the default Vitest environment).
// Ionic components such as ion-menu and ion-split-pane query `window.matchMedia`,
// which jsdom does not implement.
if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// Every spec gets the real Spanish catalog, so components render the copy users see.
beforeEach(() => {
  TestBed.configureTestingModule({ providers: [provideTranslocoTesting()] });
});
