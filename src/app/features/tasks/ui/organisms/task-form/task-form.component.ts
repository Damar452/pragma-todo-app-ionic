import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonInput, IonSelect, IonSelectOption } from '@ionic/angular';
import { TranslocoPipe } from '@jsverse/transloco';

import { TASK_FORM_EMPTY_TITLE, TASK_TITLE_MAX_LENGTH } from './task-form.constants';

import type { Category } from '@features/categories/domain/category.model';
import type { TaskDraft } from '@features/tasks/domain/task-draft.model';
import type { Task } from '@features/tasks/domain/task.model';
import { notBlank } from '@shared/utils/not-blank.validator';

@Component({
  selector: 'app-task-form',
  templateUrl: 'task-form.component.html',
  styleUrl: 'task-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, IonInput, IonSelect, IonSelectOption, IonButton, TranslocoPipe],
})
export class TaskFormComponent {
  private readonly fb = inject(FormBuilder).nonNullable;

  /** `null` means create mode; a task prefills the form for editing. */
  readonly task = input<Task | null>(null);
  readonly categories = input.required<readonly Category[]>();
  readonly showCategory = input(true);

  readonly save = output<TaskDraft>();
  readonly cancelled = output<void>();

  protected readonly maxLength = TASK_TITLE_MAX_LENGTH;

  protected readonly form = this.fb.group({
    title: this.fb.control(TASK_FORM_EMPTY_TITLE, [
      notBlank,
      Validators.maxLength(TASK_TITLE_MAX_LENGTH),
    ]),
    categoryId: this.fb.control<string | null>(null),
  });

  constructor() {
    effect(() => {
      const task = this.task();
      this.form.reset({
        title: task?.title ?? TASK_FORM_EMPTY_TITLE,
        categoryId: task?.categoryId ?? null,
      });
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      return;
    }
    const { title, categoryId } = this.form.getRawValue();
    this.save.emit({ title: title.trim(), categoryId });
  }
}
