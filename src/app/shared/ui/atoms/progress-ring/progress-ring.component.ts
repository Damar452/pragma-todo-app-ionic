import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import {
  FULL_TURN_RADIANS,
  LABEL_FONT_RATIO,
  PROGRESS_MAX_RATIO,
  PROGRESS_MIN_RATIO,
  PROGRESS_RING_DEFAULT_COLOR,
  PROGRESS_RING_DEFAULT_SIZE,
  PROGRESS_RING_DEFAULT_STROKE_WIDTH,
  PROGRESS_RING_DEFAULT_TRACK_COLOR,
} from './progress-ring.constants';

import { clamp } from '@shared/utils/number/clamp';
import { toPercent } from '@shared/utils/number/to-percent';

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
  readonly value = input(PROGRESS_MIN_RATIO);
  readonly size = input(PROGRESS_RING_DEFAULT_SIZE);
  readonly strokeWidth = input(PROGRESS_RING_DEFAULT_STROKE_WIDTH);
  readonly color = input(PROGRESS_RING_DEFAULT_COLOR);
  readonly trackColor = input(PROGRESS_RING_DEFAULT_TRACK_COLOR);
  readonly showLabel = input(true);
  /** Accessible name announced with the progress value. */
  readonly label = input.required<string>();

  protected readonly clamped = computed(() =>
    clamp(this.value(), PROGRESS_MIN_RATIO, PROGRESS_MAX_RATIO),
  );
  protected readonly percent = computed(() => toPercent(this.clamped()));
  protected readonly center = computed(() => this.size() / 2);
  protected readonly radius = computed(() => (this.size() - this.strokeWidth()) / 2);
  protected readonly circumference = computed(() => FULL_TURN_RADIANS * this.radius());
  protected readonly dashOffset = computed(
    () => this.circumference() * (PROGRESS_MAX_RATIO - this.clamped()),
  );
  protected readonly fontSize = computed(() => Math.round(this.size() * LABEL_FONT_RATIO));
}
