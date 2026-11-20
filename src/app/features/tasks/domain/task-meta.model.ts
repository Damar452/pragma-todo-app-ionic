/** Values the domain cannot invent by itself (it stays pure): supplied by the caller. */
export interface TaskMeta {
  readonly id: string;
  /** Creation time as epoch milliseconds. */
  readonly now: number;
}
