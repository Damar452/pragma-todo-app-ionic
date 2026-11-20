import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { translateSignal } from '@jsverse/transloco';

import { ProgressRingComponent } from '../../atoms/progress-ring/progress-ring.component';
import {
  PROGRESS_MAX_RATIO,
  PROGRESS_MIN_RATIO,
} from '../../atoms/progress-ring/progress-ring.constants';

import {
  SUBTITLE_KEYS,
  SUMMARY_RING_COLOR,
  SUMMARY_RING_SIZE,
  SUMMARY_RING_STROKE_WIDTH,
  SUMMARY_RING_TRACK_COLOR,
} from './progress-summary.constants';
import { resolveHeadlineKey } from './progress-summary.headline';

import { clamp } from '@shared/utils/number/clamp';
import { toRatio } from '@shared/utils/number/to-ratio';

@Component({
  selector: 'app-progress-summary',
  templateUrl: 'progress-summary.component.html',
  styleUrl: 'progress-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressRingComponent],
})
export class ProgressSummaryComponent {
  readonly completed = input.required<number>();
  readonly total = input.required<number>();

  protected readonly ringSize = SUMMARY_RING_SIZE;
  protected readonly ringStrokeWidth = SUMMARY_RING_STROKE_WIDTH;
  protected readonly ringColor = SUMMARY_RING_COLOR;
  protected readonly ringTrackColor = SUMMARY_RING_TRACK_COLOR;

  protected readonly ratio = computed(() =>
    clamp(toRatio(this.completed(), this.total()), PROGRESS_MIN_RATIO, PROGRESS_MAX_RATIO),
  );

  private readonly headlineKey = computed(() =>
    resolveHeadlineKey({ total: this.total(), ratio: this.ratio() }),
  );

  private readonly subtitleKey = computed(() =>
    this.total() > 0 ? SUBTITLE_KEYS.CompletedOf : SUBTITLE_KEYS.AddFirst,
  );

  private readonly subtitleParams = computed(() => ({
    completed: this.completed(),
    total: this.total(),
  }));

  protected readonly headline = translateSignal(this.headlineKey);
  protected readonly subtitle = translateSignal(this.subtitleKey, this.subtitleParams);
}
