import { trackEvent } from '@lidofinance/analytics-matomo';
import {
  MATOMO_CLICK_EVENTS,
  MATOMO_CLICK_EVENTS_TYPES,
  createEvent,
} from 'consts/matomo-click-events';
import { snakeCase } from 'lodash';

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

export const trackMatomoFormEvent = (
  formName?: string,
  stage: 'start' | 'success' = 'start',
) => {
  formName &&
    trackEvent(
      ...createEvent(
        `Submit form ${stage} for «${formName}»`,
        `submit_form_${snakeCase(formName)}_${stage}`,
      ),
    );
};

export const trackMatomoSiweEvent = (
  contextName: string,
  stage: 'start' | 'success' = 'start',
) => {
  trackEvent(
    ...createEvent(
      `SIWE sign in ${stage} for «${contextName}»`,
      `siwe_${snakeCase(contextName)}_${stage}`,
    ),
  );
};
