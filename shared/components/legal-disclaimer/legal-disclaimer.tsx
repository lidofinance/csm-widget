import { FC } from 'react';
import { LegalDisclaimerBlock } from './styles';
import { MatomoLink } from '../matomo-link';

export const LegalDisclaimer: FC = () => (
  <LegalDisclaimerBlock data-testid="legal-disclaimer">
    Your privacy matters. We use cookieless analytics and collect only
    anonymized data for improvements. Cookies are used for functionality only.
    For more info read{' '}
    <MatomoLink href="https://lido.fi/privacy-notice">
      Privacy Notice
    </MatomoLink>
    .
  </LegalDisclaimerBlock>
);
