import type { Provider } from '@angular/core';

import { TaskRepository } from '@features/tasks/data/task.repository';
import { InMemoryTaskRepository } from '@features/tasks/data/testing/in-memory-task.repository';
import type { Task } from '@features/tasks/domain/task.model';
import { provideTasksState } from '@features/tasks/state/provide-tasks-state';

/**
 * Binds `TaskRepository` to an in-memory fake and the tasks state contract to its store for page specs (pages may not
 * import `data`). Returns the fake too, to seed failures or inspect what was persisted.
 */
export function provideInMemoryTasks(initial: readonly Task[] = []): {
  repository: InMemoryTaskRepository;
  providers: Provider[];
} {
  const repository = new InMemoryTaskRepository(initial);
  const providers: Provider[] = [
    { provide: TaskRepository, useValue: repository },
    ...provideTasksState(),
  ];
  return { repository, providers };
}
