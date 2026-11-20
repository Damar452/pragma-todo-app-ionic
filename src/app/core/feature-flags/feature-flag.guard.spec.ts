import { TestBed } from '@angular/core/testing';
import {
  type PartialMatchRouteSnapshot,
  type Route,
  Router,
  type UrlSegment,
  UrlTree,
} from '@angular/router';

import { featureFlagGuard } from './feature-flag.guard';
import { FeatureFlag } from './feature-flags.enums';
import { FakeFeatureFlags, provideFakeFeatureFlags } from './testing/fake-feature-flags';

function setup(categoriesEnabled: boolean) {
  TestBed.configureTestingModule({ providers: [provideFakeFeatureFlags()] });
  TestBed.inject(FakeFeatureFlags).set(FeatureFlag.CategoriesEnabled, categoriesEnabled);
  const guard = featureFlagGuard(FeatureFlag.CategoriesEnabled);
  return {
    match: () =>
      TestBed.runInInjectionContext(() =>
        guard({} as Route, [] as UrlSegment[], {} as PartialMatchRouteSnapshot),
      ),
  };
}

describe('featureFlagGuard', () => {
  it('lets the route match when the flag is on', () => {
    // Arrange
    const { match } = setup(true);

    // Act
    const result = match();

    // Assert
    expect(result).toBe(true);
  });

  it('redirects to /tasks when the flag is off', () => {
    // Arrange
    const { match } = setup(false);

    // Act
    const result = match();

    // Assert
    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/tasks');
  });
});
