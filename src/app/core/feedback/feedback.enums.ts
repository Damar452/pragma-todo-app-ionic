/** Roles of toast/alert buttons; the role is what comes back when the overlay is dismissed. */
export const FeedbackRole = {
  Cancel: 'cancel',
  Undo: 'undo',
  Confirm: 'confirm',
  Destructive: 'destructive',
} as const;

export type FeedbackRole = (typeof FeedbackRole)[keyof typeof FeedbackRole];

/** What the user picked in the item action sheet. */
export const ItemAction = {
  Edit: 'edit',
  Delete: 'delete',
} as const;

export type ItemAction = (typeof ItemAction)[keyof typeof ItemAction];
