import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonInput } from '@ionic/angular';
import { TranslocoPipe } from '@jsverse/transloco';

import type { CategoryDraft } from '../../../domain/category-draft.model';
import { DEFAULT_CATEGORY_COLOR } from '../../../domain/category-palette';
import type { Category } from '../../../domain/category.model';

import { ColorPickerComponent } from '@shared/ui/molecules/color-picker/color-picker.component';
import { notBlank } from '@shared/utils/not-blank.validator';

export const CATEGORY_NAME_MAX_LENGTH = 30;

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

  readonly save = output<CategoryDraft>();
  readonly cancelled = output<void>();

  protected readonly maxLength = CATEGORY_NAME_MAX_LENGTH;

  protected readonly form = this.fb.group({
    name: this.fb.control('', [notBlank, Validators.maxLength(CATEGORY_NAME_MAX_LENGTH)]),
    color: this.fb.control(DEFAULT_CATEGORY_COLOR),
  });

  protected readonly color = toSignal(this.form.controls.color.valueChanges, {
    initialValue: this.form.controls.color.value,
  });

  constructor() {
    effect(() => {
      const category = this.category();
      this.form.reset({
        name: category?.name ?? '',
        color: category?.color ?? this.colors()[0] ?? DEFAULT_CATEGORY_COLOR,
      });
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
