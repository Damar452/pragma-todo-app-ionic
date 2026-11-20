export interface Category {
  readonly id: string;
  readonly name: string;
  /** Hex color (e.g. `#4F46E5`) used to tag the category's tasks. */
  readonly color: string;
}
