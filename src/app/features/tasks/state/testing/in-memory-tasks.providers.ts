import type { Provider } from '@angular/core';

import { TaskRepository } from '@features/tasks/data/task.repository';
import { InMemoryTaskRepository } from '@features/tasks/data/testing/in-memory-task.repository';
import type { Task } from '@features/tasks/domain/task.model';

/**
 * Binds `TaskRepository` to an in-memory fake for page specs (pages may not
 * import `data`). Returns the fake too, to seed failures or inspect what was persisted.
 */
export function provideInMemoryTasks(initial: readonly Task[] = []): {
  repository: InMemoryTaskRepository;
  providers: Provider[];
} {
  const repository = new InMemoryTaskRepository(initial);
  const providers: Provider[] = [{ provide: TaskRepository, useValue: repository }];
  return { repository, providers };
}
