import type { Task } from '@features/tasks/domain/task.model';

/**
 * Persistence contract for tasks. The store depends on this abstraction, so
 * tests can use an in-memory fake and the storage engine can change freely.
 * Abstract class (not interface) so it doubles as the Angular DI token.
 */
export abstract class TaskRepository {
  abstract getAll(): Promise<readonly Task[]>;
  abstract saveAll(tasks: readonly Task[]): Promise<void>;
}
