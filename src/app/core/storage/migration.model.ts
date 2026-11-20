import type { KeyValueStorage } from './key-value-storage';

/** One step of the stored data's schema history. */
export interface Migration {
  /** Schema version the data is in after `migrate` ran. Strictly increasing across migrations. */
  readonly version: number;
  migrate(storage: KeyValueStorage): Promise<void>;
}
