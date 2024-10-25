import { trackEvent } from '@lidofinance/analytics-matomo';
import {
  MATOMO_CLICK_EVENTS_TYPES,
  MATOMO_CLICK_EVENTS,
  MATOMO_APP_NAME,
  prefixed,
} from 'consts/matomo-click-events';

export type WithMatomoEvent<P = unknown> = P & {
  matomoEvent?: MATOMO_CLICK_EVENTS_TYPES | undefined;
};

export const trackMatomoEvent = (eventType?: MATOMO_CLICK_EVENTS_TYPES) => {
  eventType && trackEvent(...MATOMO_CLICK_EVENTS[eventType]);
};

export const trackMatomoFaqEvent = (faqId?: string) => {
  faqId &&
    trackEvent(
      MATOMO_APP_NAME,
      `Open faq item «${faqId}»`,
      prefixed`faq_item_open`,
    );
};

export const trackMatomoError = (description: string, tag: string) => {
  trackEvent(MATOMO_APP_NAME, `ERROR: ${description}`, prefixed`error_${tag}`);
};

export const trackMatomoTxEvent = (
  txName?: string,
  stage: 'prepare' | 'done' = 'done',
) => {
  txName &&
    trackEvent(
      MATOMO_APP_NAME,
      `Perform transaction «${txName}», ${stage}`,
      prefixed`perform_tx_${stage}`,
    );
};

export const trackMatomoHowLearnCsm = (answer: string) => {
  trackEvent(
    MATOMO_APP_NAME,
    `How did I learn about CSM: «${answer}»`,
    prefixed`_how_learn_csm`,
  );
};
