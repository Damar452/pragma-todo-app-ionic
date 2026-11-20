import type { ValidatorFn } from '@angular/forms';

import { NAME_TAKEN_ERROR } from './category-form.constants';
import type { NameTakenPredicate } from './category-form.models';

/** Fails with `nameTaken` when the (current) predicate says another category has this name. */
export function nameAvailable(isTaken: () => NameTakenPredicate): ValidatorFn {
  return (control) =>
    isTaken()(String(control.value ?? '')) ? { [NAME_TAKEN_ERROR]: true } : null;
}
