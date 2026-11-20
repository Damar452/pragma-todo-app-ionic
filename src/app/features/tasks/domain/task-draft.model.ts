/** Data collected by the task form, before an id or timestamps exist. */
export interface TaskDraft {
  readonly title: string;
  readonly categoryId: string | null;
}
