import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonInput } from '@ionic/angular';
import { TranslocoPipe } from '@jsverse/transloco';

import {
  CATEGORY_FORM_EMPTY_NAME,
  CATEGORY_NAME_MAX_LENGTH,
  NAME_NEVER_TAKEN,
  NAME_TAKEN_ERROR,
} from './category-form.constants';
import type { NameTakenPredicate } from './category-form.models';
import { nameAvailable } from './category-form.validators';

import type { CategoryDraft } from '@features/categories/domain/category-draft.model';
import { DEFAULT_CATEGORY_COLOR } from '@features/categories/domain/category-palette';
import type { Category } from '@features/categories/domain/category.model';
import { ColorPickerComponent } from '@shared/ui/molecules/color-picker/color-picker.component';
import { notBlank } from '@shared/utils/not-blank.validator';

@Component({
  selector: 'app-category-form',
  templateUrl: 'category-form.component.html',
  styleUrl: 'category-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, IonInput, IonButton, ColorPickerComponent, TranslocoPipe],
})
export class CategoryFormComponent {
  private readonly fb = inject(FormBuilder).nonNullable;

  /** `null` means create mode; a category prefills the form for editing. */
  readonly category = input<Category | null>(null);
  readonly colors = input.required<readonly string[]>();
  /** Lets the form flag a name another category already uses (the host knows which one is being edited). */
  readonly isNameTaken = input<NameTakenPredicate>(NAME_NEVER_TAKEN);

  readonly save = output<CategoryDraft>();
  readonly cancelled = output<void>();

  protected readonly maxLength = CATEGORY_NAME_MAX_LENGTH;
  protected readonly nameTakenError = NAME_TAKEN_ERROR;

  protected readonly form = this.fb.group({
    name: this.fb.control(CATEGORY_FORM_EMPTY_NAME, [
      notBlank,
      Validators.maxLength(CATEGORY_NAME_MAX_LENGTH),
      nameAvailable(() => this.isNameTaken()),
    ]),
    color: this.fb.control(DEFAULT_CATEGORY_COLOR),
  });

  protected readonly color = toSignal(this.form.controls.color.valueChanges, {
    initialValue: this.form.controls.color.value,
  });

  constructor() {
    effect(() => {
      const category = this.category();
      this.form.reset({
        name: category?.name ?? CATEGORY_FORM_EMPTY_NAME,
        color: category?.color ?? this.colors()[0] ?? DEFAULT_CATEGORY_COLOR,
      });
    });

    // The predicate changes with the category being edited: re-run the name validators.
    effect(() => {
      this.isNameTaken();
      this.form.controls.name.updateValueAndValidity();
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      return;
    }
    const { name, color } = this.form.getRawValue();
    this.save.emit({ name: name.trim(), color });
  }
}
