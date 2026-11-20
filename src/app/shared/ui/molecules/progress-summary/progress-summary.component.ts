import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { translateSignal } from '@jsverse/transloco';

import { ProgressRingComponent } from '../../atoms/progress-ring/progress-ring.component';

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

  protected readonly ratio = computed(() =>
    this.total() > 0 ? Math.min(this.completed() / this.total(), 1) : 0,
  );

  private readonly headlineKey = computed(() => {
    const ratio = this.ratio();
    if (this.total() === 0) {
      return 'shared.progress.headline.plan';
    }
    if (ratio === 0) {
      return 'shared.progress.headline.start';
    }
    if (ratio < 0.5) {
      return 'shared.progress.headline.keepGoing';
    }
    return ratio < 1 ? 'shared.progress.headline.almostDone' : 'shared.progress.headline.allDone';
  });

  private readonly subtitleKey = computed(() =>
    this.total() > 0 ? 'shared.progress.completedOf' : 'shared.progress.addFirst',
  );

  private readonly subtitleParams = computed(() => ({
    completed: this.completed(),
    total: this.total(),
  }));

  protected readonly headline = translateSignal(this.headlineKey);
  protected readonly subtitle = translateSignal(this.subtitleKey, this.subtitleParams);
}
