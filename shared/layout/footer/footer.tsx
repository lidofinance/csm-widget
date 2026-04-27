import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { getExternalLinks } from 'consts/external-links';
import { LogoLidoLink, Stack } from 'shared/components';
import { FooterLink, FooterStyle, LinkDivider } from './styles';
import { Version } from './version';

const { feedbackForm } = getExternalLinks();

export const Footer: FC = () => (
  <FooterStyle>
    <LogoLidoLink />
    <Stack gap="none">
      <FooterLink
        href="https://lido.fi/terms-of-use"
        matomoEvent={MATOMO_CLICK_EVENTS_TYPES.footerTermsOfUse}
      >
        Terms of Use
      </FooterLink>
      <LinkDivider />
      <FooterLink
        href="https://lido.fi/privacy-notice"
        matomoEvent={MATOMO_CLICK_EVENTS_TYPES.footerPrivacyNotice}
      >
        Privacy Notice
      </FooterLink>
      <LinkDivider />
      <FooterLink
        href={feedbackForm}
        matomoEvent={MATOMO_CLICK_EVENTS_TYPES.footerFeedbackForm}
      >
        Feedback form
      </FooterLink>
      <LinkDivider />
      <FooterLink
        href="https://discord.com/invite/lido"
        matomoEvent={MATOMO_CLICK_EVENTS_TYPES.footerDiscord}
      >
        Discord
      </FooterLink>
    </Stack>
    <Version />
  </FooterStyle>
);
