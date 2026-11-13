import { Disclaimer, TextLink } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { trackMatomoEvent } from 'utils';

export const LegalDisclaimer: FC = () => (
  <Disclaimer data-testid="legalDisclaimer">
    Your privacy matters. We use cookieless analytics and collect only
    anonymized data for improvements. Cookies are used for functionality only.
    For more info read{' '}
    <TextLink
      href="https://lido.fi/privacy-notice"
      external
      onClick={() =>
        trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.legalPrivacyNoticeLink)
      }
      data-testid="legalPrivacyNoticeLink"
    >
      Privacy Notice
    </TextLink>
    .
  </Disclaimer>
);
