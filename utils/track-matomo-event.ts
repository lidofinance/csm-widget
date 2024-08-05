import { trackEvent } from '@lidofinance/analytics-matomo';
import {
  MATOMO_CLICK_EVENTS_TYPES,
  MATOMO_CLICK_EVENTS,
} from 'consts/matomo-click-events';

export type WithMatomoEvent<P = unknown> = P & {
  matomoEvent?: MATOMO_CLICK_EVENTS_TYPES | undefined;
};

export const trackMatomoEvent = (eventType?: MATOMO_CLICK_EVENTS_TYPES) => {
  eventType && trackEvent(...MATOMO_CLICK_EVENTS[eventType]);
};
