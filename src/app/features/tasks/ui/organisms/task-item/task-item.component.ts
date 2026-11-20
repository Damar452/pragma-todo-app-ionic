import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  IonCheckbox,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
} from '@ionic/angular';
import { TranslocoPipe } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { checkmarkDoneOutline, createOutline, trashOutline } from 'ionicons/icons';

import type { Task } from '../../../domain/task.model';

import type { Category } from '@features/categories/domain/category.model';
import { StatusPillComponent } from '@shared/ui/atoms/status-pill/status-pill.component';
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
    IonIcon,
    ColorTagComponent,
    StatusPillComponent,
    TranslocoPipe,
  ],
})
export class TaskItemComponent {
  readonly task = input.required<Task>();
  readonly category = input<Category | null>(null);

  readonly toggleComplete = output<void>();
  readonly edit = output<void>();
  readonly remove = output<void>();

  constructor() {
    addIcons({ checkmarkDoneOutline, createOutline, trashOutline });
  }
}
