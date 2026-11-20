import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Section title with a count badge, e.g. "Tasks (6)". */
@Component({
  selector: 'app-section-header',
  templateUrl: 'section-header.component.html',
  styleUrl: 'section-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeaderComponent {
  readonly title = input.required<string>();
  readonly count = input.required<number>();
}
