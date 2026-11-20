import type { Provider } from '@angular/core';

import { SignalTasksStore } from './signal-tasks.store';
import { TasksStore } from './tasks.store';

/**
 * Binds the tasks state contract to its signal-based implementation.
 * `useExisting` keeps one instance reachable through both the contract and the concrete class.
 */
export function provideTasksState(): Provider[] {
  return [SignalTasksStore, { provide: TasksStore, useExisting: SignalTasksStore }];
}
