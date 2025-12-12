import { trackEvent } from '@lidofinance/analytics-matomo';
import {
  MATOMO_CLICK_EVENTS,
  MATOMO_CLICK_EVENTS_TYPES,
  createEvent,
} from 'consts/matomo-click-events';

export type WithMatomoEvent<P = unknown> = P & {
  matomoEvent?: MATOMO_CLICK_EVENTS_TYPES | undefined;
};

export const trackMatomoEvent = (eventType?: MATOMO_CLICK_EVENTS_TYPES) => {
  eventType && trackEvent(...MATOMO_CLICK_EVENTS[eventType]);
};

export const trackMatomoFaqEvent = (faqId?: string) => {
  faqId &&
    trackEvent(...createEvent(`Open faq item «${faqId}»`, `faq_item_open`));
};

export const trackMatomoError = (description: string, tag: string) => {
  trackEvent(...createEvent(`ERROR: ${description}`, `error_${tag}`));
};

export const trackMatomoTxEvent = (
  txName?: string,
  stage: 'prepare' | 'done' = 'done',
) => {
  txName &&
    trackEvent(
      ...createEvent(
        `Perform transaction «${txName}», ${stage}`,
        `perform_tx_${txName}_${stage}`,
      ),
    );
};
