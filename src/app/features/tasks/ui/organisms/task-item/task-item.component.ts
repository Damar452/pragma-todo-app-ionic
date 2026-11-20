import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  viewChild,
} from '@angular/core';
import {
  IonButton,
  IonCheckbox,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
} from '@ionic/angular';
import { TranslocoPipe } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import {
  checkmarkDoneOutline,
  createOutline,
  ellipsisVertical,
  trashOutline,
} from 'ionicons/icons';

import type { Category } from '@features/categories/domain/category.model';
import type { Task } from '@features/tasks/domain/task.model';
import { StatusPillComponent } from '@shared/ui/atoms/status-pill/status-pill.component';
import { StatusPillTone } from '@shared/ui/atoms/status-pill/status-pill.enums';
import { ColorTagComponent } from '@shared/ui/molecules/color-tag/color-tag.component';

@Component({
  selector: 'app-task-item',
  templateUrl: 'task-item.component.html',
  styleUrl: 'task-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonItem,
    IonCheckbox,
    IonButton,
    IonIcon,
    ColorTagComponent,
    StatusPillComponent,
    TranslocoPipe,
  ],
})
export class TaskItemComponent {
  readonly task = input.required<Task>();
  readonly category = input<Category | null>(null);
  /** Hides the category tag (feature switched off) without touching the task's data. */
  readonly showCategory = input(true);

  protected readonly tone = computed(() =>
    this.task().completed ? StatusPillTone.Success : StatusPillTone.Primary,
  );

  readonly toggleComplete = output<void>();
  readonly edit = output<void>();
  readonly remove = output<void>();
  /** The ⋮ button was tapped; the page decides what to offer. */
  readonly menuRequested = output<void>();

  private readonly sliding = viewChild(IonItemSliding);

  constructor() {
    addIcons({ checkmarkDoneOutline, createOutline, ellipsisVertical, trashOutline });
  }

  protected onToggle(): void {
    this.toggleComplete.emit();
    this.closeOptions();
  }

  protected onEdit(): void {
    this.edit.emit();
    this.closeOptions();
  }

  /** Opens the menu without letting the tap reach the card (which would edit). */
  protected onMenu(event: Event): void {
    event.stopPropagation();
    this.menuRequested.emit();
  }

  protected onRemove(): void {
    this.remove.emit();
    this.closeOptions();
  }

  /** Slides the row back to rest after one of its swipe actions ran. */
  private closeOptions(): void {
    void this.sliding()?.close();
  }
}
