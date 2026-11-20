import { Injectable, type Provider } from '@angular/core';

import type { ItemAction } from '../feedback.enums';
import type { ConfirmOptions, FeedbackParams, ItemActionOptions } from '../feedback.models';
import { FeedbackService } from '../feedback.service';

/** Fake `FeedbackService` for page specs: records calls and answers with scripted outcomes. */
@Injectable()
export class FakeFeedbackService extends FeedbackService {
  readonly toasts: { key: string; params?: FeedbackParams }[] = [];
  readonly errors: { key: string; params?: FeedbackParams }[] = [];
  readonly undoToasts: { key: string; params?: FeedbackParams }[] = [];
  readonly confirmations: ConfirmOptions[] = [];

  readonly itemActionSheets: ItemActionOptions[] = [];

  /** What `toastWithUndo` resolves with (did the user tap "Undo"?). */
  undoAnswer = false;
  /** What `confirm` resolves with. */
  confirmAnswer = true;
  /** What `chooseItemAction` resolves with (`null` = cancelled). */
  itemActionAnswer: ItemAction | null = null;

  override toast(key: string, params?: FeedbackParams): Promise<void> {
    this.toasts.push({ key, params });
    return Promise.resolve();
  }

  override toastError(key: string, params?: FeedbackParams): Promise<void> {
    this.errors.push({ key, params });
    return Promise.resolve();
  }

  override toastWithUndo(key: string, params?: FeedbackParams): Promise<boolean> {
    this.undoToasts.push({ key, params });
    return Promise.resolve(this.undoAnswer);
  }

  override confirm(options: ConfirmOptions): Promise<boolean> {
    this.confirmations.push(options);
    return Promise.resolve(this.confirmAnswer);
  }
  override chooseItemAction(options: ItemActionOptions): Promise<ItemAction | null> {
    this.itemActionSheets.push(options);
    return Promise.resolve(this.itemActionAnswer);
  }
}

/** Registers the fake under the real token; `TestBed.inject(FakeFeedbackService)` gives the same instance. */
export function provideFakeFeedback(): Provider[] {
  return [FakeFeedbackService, { provide: FeedbackService, useExisting: FakeFeedbackService }];
}
