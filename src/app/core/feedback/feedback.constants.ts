import { FeedbackRole, ItemAction } from './feedback.enums';

export const TOAST_DURATION_MS = 2500;
/** Longer, so the user has time to reach the "Undo" button. */
export const UNDO_TOAST_DURATION_MS = 5000;
export const TOAST_POSITION = 'bottom';

/** `id` of the tab bar; toasts anchor above it instead of covering the tabs. */
export const TOAST_ANCHOR_ID = 'app-tab-bar';

export const TOAST_ERROR_COLOR = 'danger';
export const TOAST_CSS_CLASS = 'app-toast';

export const UNDO_LABEL_KEY = 'feedback.undo';
export const ALERT_CSS_CLASS = 'app-alert';

export const ACTION_SHEET_CSS_CLASS = 'app-action-sheet';
export const CANCEL_LABEL_KEY = 'feedback.itemActions.cancel';

/** Buttons of the item action sheet, in display order (cancel goes last). */
export const ITEM_ACTION_BUTTONS = [
  { action: ItemAction.Edit, labelKey: 'feedback.itemActions.edit', icon: 'create-outline' },
  {
    action: ItemAction.Delete,
    labelKey: 'feedback.itemActions.delete',
    icon: 'trash-outline',
    role: FeedbackRole.Destructive,
  },
] as const;
