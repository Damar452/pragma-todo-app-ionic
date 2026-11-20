import type { Provider } from '@angular/core';

import { TaskLocalRepository } from './task-local.repository';
import { TaskRepository } from './task.repository';

/** Binds the task persistence contract to its local-storage implementation. */
export function provideTasksData(): Provider[] {
  return [{ provide: TaskRepository, useClass: TaskLocalRepository }];
}
