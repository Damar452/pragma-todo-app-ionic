import type { NameTakenPredicate } from './category-form.models';

export const CATEGORY_NAME_MAX_LENGTH = 30;

/** Initial value of the name field (create mode). */
export const CATEGORY_FORM_EMPTY_NAME = '';

/** Error key set on the name control when another category already uses the name. */
export const NAME_TAKEN_ERROR = 'nameTaken';

/** Default predicate: nothing is taken (the host did not provide one). */
export const NAME_NEVER_TAKEN: NameTakenPredicate = () => false;
