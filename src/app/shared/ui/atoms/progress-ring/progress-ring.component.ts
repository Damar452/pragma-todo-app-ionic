import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const LABEL_FONT_RATIO = 0.26;

/** Circular progress indicator. `value` is a ratio from 0 to 1 (values outside are clamped). */
@Component({
  selector: 'app-progress-ring',
  templateUrl: 'progress-ring.component.html',
  styleUrl: 'progress-ring.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'progressbar',
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    '[attr.aria-valuenow]': 'percent()',
    '[attr.aria-label]': 'label()',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
  },
})
export class ProgressRingComponent {
  readonly value = input(0);
  readonly size = input(48);
  readonly strokeWidth = input(5);
  readonly color = input('var(--ion-color-primary)');
  readonly trackColor = input('rgba(128, 128, 128, 0.2)');
  readonly showLabel = input(true);
  /** Accessible name announced with the progress value. */
  readonly label = input.required<string>();

  protected readonly clamped = computed(() => Math.min(Math.max(this.value(), 0), 1));
  protected readonly percent = computed(() => Math.round(this.clamped() * 100));
  protected readonly radius = computed(() => (this.size() - this.strokeWidth()) / 2);
  protected readonly circumference = computed(() => 2 * Math.PI * this.radius());
  protected readonly dashOffset = computed(() => this.circumference() * (1 - this.clamped()));
  protected readonly center = computed(() => this.size() / 2);
  protected readonly fontSize = computed(() => Math.round(this.size() * LABEL_FONT_RATIO));
}
