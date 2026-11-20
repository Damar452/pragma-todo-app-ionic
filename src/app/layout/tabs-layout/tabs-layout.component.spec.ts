import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { TabsLayoutComponent } from './tabs-layout.component';

import { FeatureFlag } from '@core/feature-flags/feature-flags.enums';
import {
  FakeFeatureFlags,
  provideFakeFeatureFlags,
} from '@core/feature-flags/testing/fake-feature-flags';

const ROUTES = [
  { path: 'tasks', children: [] },
  { path: 'categories', children: [] },
];

function setup(categoriesEnabled = true) {
  TestBed.configureTestingModule({
    providers: [
      provideRouter(ROUTES),
      ...provideFakeFeatureFlags({ [FeatureFlag.CategoriesEnabled]: categoriesEnabled }),
    ],
  });
  const fixture = TestBed.createComponent(TabsLayoutComponent);
  fixture.detectChanges();
  return {
    fixture,
    router: TestBed.inject(Router),
    flags: TestBed.inject(FakeFeatureFlags),
    text: (): string => fixture.nativeElement.textContent,
  };
}

describe('TabsLayoutComponent', () => {
  it('renders the tasks and categories tabs', () => {
    // Arrange / Act
    const { text } = setup();

    // Assert
    expect(text()).toContain('Tareas');
    expect(text()).toContain('Categorías');
  });

  it('hides the categories tab when the flag is off', () => {
    // Arrange / Act
    const { text } = setup(false);

    // Assert
    expect(text()).toContain('Tareas');
    expect(text()).not.toContain('Categorías');
  });

  it('leaves the categories screen for tasks when the flag turns off', async () => {
    // Arrange
    const { fixture, router, flags } = setup();
    await router.navigateByUrl('/categories');

    // Act
    flags.set(FeatureFlag.CategoriesEnabled, false);
    fixture.detectChanges();
    await vi.waitFor(() => expect(router.url).toBe('/tasks'));

    // Assert
    expect(router.url).toBe('/tasks');
  });

  it('stays where it is when the flag turns off elsewhere', async () => {
    // Arrange
    const { fixture, router, flags } = setup();
    await router.navigateByUrl('/tasks');

    // Act
    flags.set(FeatureFlag.CategoriesEnabled, false);
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    expect(router.url).toBe('/tasks');
  });
});
