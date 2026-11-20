import type { AbstractControl, ValidationErrors } from '@angular/forms';

/** Fails (`required`) for empty or whitespace-only string values. */
export function notBlank(control: AbstractControl<string>): ValidationErrors | null {
  return control.value.trim() ? null : { required: true };
}
