/** Sheet modal that fits its content (see "Sheet modals" in docs/ARCHITECTURE.md). */
export const FORM_MODAL_BREAKPOINTS: number[] = [0, 1];
export const FORM_MODAL_INITIAL_BREAKPOINT = 1;

/** Translation keys the page shows as feedback and in the delete confirmation. */
export const CATEGORY_FEEDBACK_KEYS = {
  created: 'categories.feedback.created',
  updated: 'categories.feedback.updated',
  deleted: 'categories.feedback.deleted',
  error: 'feedback.error',
} as const;

export const DELETE_CONFIRMATION_KEYS = {
  headerKey: 'categories.confirmDelete.header',
  messageKey: 'categories.confirmDelete.message',
  confirmKey: 'categories.confirmDelete.confirm',
  cancelKey: 'categories.confirmDelete.cancel',
} as const;
