/** Interpolation values for a translation key (e.g. `{ name, count }`). */
export type FeedbackParams = Record<string, unknown>;

export interface ConfirmOptions {
  readonly headerKey: string;
  readonly messageKey: string;
  readonly params?: FeedbackParams;
  readonly confirmKey: string;
  readonly cancelKey: string;
  /** Styles the confirm button as dangerous (red). */
  readonly destructive?: boolean;
}

export interface ItemActionOptions {
  /** Already-translated title of the sheet (the item's name). */
  readonly header: string;
}
