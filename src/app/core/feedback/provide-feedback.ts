import type { Provider } from '@angular/core';

import { FeedbackService } from './feedback.service';
import { IonicFeedbackService } from './ionic-feedback.service';

/** Binds the feedback contract to its Ionic implementation. */
export function provideFeedback(): Provider[] {
  return [{ provide: FeedbackService, useClass: IonicFeedbackService }];
}
