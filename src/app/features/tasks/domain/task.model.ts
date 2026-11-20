export interface Task {
  readonly id: string;
  readonly title: string;
  readonly completed: boolean;
  /** `null` means "uncategorized" (also the result of deleting its category). */
  readonly categoryId: string | null;
  /** Creation time as epoch milliseconds; used for stable ordering. */
  readonly createdAt: number;
}
