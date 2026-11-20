import { Injectable, inject } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { TranslocoService } from '@jsverse/transloco';

import {
  ACTION_SHEET_CSS_CLASS,
  ALERT_CSS_CLASS,
  CANCEL_LABEL_KEY,
  ITEM_ACTION_BUTTONS,
  TOAST_ANCHOR_ID,
  TOAST_CSS_CLASS,
  TOAST_DURATION_MS,
  TOAST_ERROR_COLOR,
  TOAST_POSITION,
  UNDO_LABEL_KEY,
  UNDO_TOAST_DURATION_MS,
} from './feedback.constants';
import { FeedbackRole, ItemAction } from './feedback.enums';
import type { ConfirmOptions, FeedbackParams, ItemActionOptions } from './feedback.models';

const ITEM_ACTIONS: ReadonlySet<ItemAction> = new Set(Object.values(ItemAction));

/**
 * User feedback (toasts and confirmations) behind a small, translated API, so
 * pages never touch Ionic overlay controllers or hard-code copy.
 */
@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private readonly toastController = inject(ToastController);
  private readonly alertController = inject(AlertController);
  private readonly actionSheetController = inject(ActionSheetController);
  private readonly transloco = inject(TranslocoService);

  private current: HTMLIonToastElement | null = null;

  async toast(messageKey: string, params?: FeedbackParams): Promise<void> {
    const toast = await this.present({
      message: this.transloco.translate(messageKey, params),
      duration: TOAST_DURATION_MS,
    });
    await toast.onDidDismiss();
  }

  /** Same as `toast`, styled as an error. */
  async toastError(messageKey: string, params?: FeedbackParams): Promise<void> {
    const toast = await this.present({
      message: this.transloco.translate(messageKey, params),
      duration: TOAST_DURATION_MS,
      color: TOAST_ERROR_COLOR,
    });
    await toast.onDidDismiss();
  }

  /** Shows a toast with an "Undo" button; resolves `true` only if the user tapped it. */
  async toastWithUndo(messageKey: string, params?: FeedbackParams): Promise<boolean> {
    const toast = await this.present({
      message: this.transloco.translate(messageKey, params),
      duration: UNDO_TOAST_DURATION_MS,
      buttons: [{ text: this.transloco.translate(UNDO_LABEL_KEY), role: FeedbackRole.Undo }],
    });
    const { role } = await toast.onDidDismiss();
    return role === FeedbackRole.Undo;
  }

  /** Asks for confirmation; resolves `true` only if the user pressed the confirm button. */
  async confirm(options: ConfirmOptions): Promise<boolean> {
    const confirmRole = options.destructive ? FeedbackRole.Destructive : FeedbackRole.Confirm;
    const alert = await this.alertController.create({
      header: this.transloco.translate(options.headerKey, options.params),
      message: this.transloco.translate(options.messageKey, options.params),
      cssClass: ALERT_CSS_CLASS,
      buttons: [
        { text: this.transloco.translate(options.cancelKey), role: FeedbackRole.Cancel },
        { text: this.transloco.translate(options.confirmKey), role: confirmRole },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === confirmRole;
  }

  /** Native action sheet for one item; resolves the chosen action, or `null` on cancel/backdrop. */
  async chooseItemAction(options: ItemActionOptions): Promise<ItemAction | null> {
    const sheet = await this.actionSheetController.create({
      header: options.header,
      cssClass: ACTION_SHEET_CSS_CLASS,
      buttons: [
        ...ITEM_ACTION_BUTTONS.map((button) => ({
          text: this.transloco.translate(button.labelKey),
          icon: button.icon,
          role: 'role' in button ? button.role : undefined,
          data: button.action,
        })),
        { text: this.transloco.translate(CANCEL_LABEL_KEY), role: FeedbackRole.Cancel },
      ],
    });
    await sheet.present();
    const { data } = await sheet.onDidDismiss<ItemAction>();
    return ITEM_ACTIONS.has(data as ItemAction) ? (data as ItemAction) : null;
  }

  /** Only one toast at a time: a new one replaces the visible one. */
  private async present(options: {
    message: string;
    duration: number;
    color?: string;
    buttons?: { text: string; role: string }[];
  }): Promise<HTMLIonToastElement> {
    await this.current?.dismiss();
    const toast = await this.toastController.create({
      ...options,
      position: TOAST_POSITION,
      positionAnchor: document.getElementById(TOAST_ANCHOR_ID) ?? undefined,
      cssClass: TOAST_CSS_CLASS,
    });
    this.current = toast;
    await toast.present();
    return toast;
  }
}
