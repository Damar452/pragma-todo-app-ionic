import type { ItemAction } from './feedback.enums';
import type { ConfirmOptions, FeedbackParams, ItemActionOptions } from './feedback.models';

/**
 * Contract and DI token for user feedback (toasts and confirmations) behind a
 * small, translated API, so pages never touch overlay controllers or hard-code
 * copy. `provideFeedback()` binds the implementation.
 */
export abstract class FeedbackService {
  abstract toast(messageKey: string, params?: FeedbackParams): Promise<void>;

  /** Same as `toast`, styled as an error. */
  abstract toastError(messageKey: string, params?: FeedbackParams): Promise<void>;

  /** Shows a toast with an "Undo" button; resolves `true` only if the user tapped it. */
  abstract toastWithUndo(messageKey: string, params?: FeedbackParams): Promise<boolean>;

  /** Asks for confirmation; resolves `true` only if the user pressed the confirm button. */
  abstract confirm(options: ConfirmOptions): Promise<boolean>;

  /** Native action sheet for one item; resolves the chosen action, or `null` on cancel/backdrop. */
  abstract chooseItemAction(options: ItemActionOptions): Promise<ItemAction | null>;
}
