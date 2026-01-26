import { FC } from 'react';
import { WrappedStats } from '../data';
import { SlideDaysActive } from './slide-days-active';
import { SlideFinal } from './slide-final';
import { SlideIcs } from './slide-ics';
import { SlideIntro } from './slide-intro';
import { SlideKeysUploaded } from './slide-keys-uploaded';
import { SlideOutro } from './slide-outro';
import { SlidePerformance } from './slide-performance';
import { SlideQueue } from './slide-queue';
import { SlideRewards } from './slide-rewards';
import { SlideStrikes } from './slide-strikes';
import { SlideTop } from './slide-top';

export type SlideComponent = FC & {
  shouldRender?: (data: WrappedStats) => boolean;
};

export const SLIDES: SlideComponent[] = [
  SlideIntro as SlideComponent,
  SlideDaysActive as SlideComponent,
  SlideKeysUploaded as SlideComponent,
  SlideRewards as SlideComponent,
  SlidePerformance as SlideComponent,
  SlideQueue as SlideComponent,
  SlideStrikes as SlideComponent,
  SlideIcs as SlideComponent,
  SlideTop as SlideComponent,
  SlideFinal as SlideComponent,
  SlideOutro as SlideComponent,
];
