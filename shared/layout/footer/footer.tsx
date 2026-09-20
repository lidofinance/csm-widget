import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { LogoLidoLink, Stack } from 'shared/components';
import { useExternalLinks } from 'shared/hooks';
import { FooterLink, FooterStyle, LinkDivider } from './styles';
import { Version } from './version';

// dummy===true pages (404/500/qa-config) render outside Web3Provider entirely; useExternalLinks needs wagmi context
const FeedbackFormLink: FC = () => {
  const { feedbackForm } = useExternalLinks();
  return (
    <>
      <LinkDivider />
      <FooterLink
        href={feedbackForm}
        matomoEvent={MATOMO_CLICK_EVENTS_TYPES.footerFeedbackForm}
        data-testid="footerFeedbackFormLink"
      >
        Feedback form
      </FooterLink>
    </>
  );
};

type Props = {
  dummy?: boolean | 'semi';
};

export const Footer: FC<Props> = ({ dummy }) => {
  return (
    <FooterStyle data-testid="appFooter">
      <LogoLidoLink />
      <Stack gap="none">
        <FooterLink
          href="https://lido.fi/terms-of-use"
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.footerTermsOfUse}
          data-testid="footerTermsOfUseLink"
        >
          Terms of Use
        </FooterLink>
        <LinkDivider />
        <FooterLink
          href="https://lido.fi/privacy-notice"
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.footerPrivacyNotice}
          data-testid="footerPrivacyNoticeLink"
        >
          Privacy Notice
        </FooterLink>
        {dummy !== true && <FeedbackFormLink />}
        <LinkDivider />
        <FooterLink
          href="https://discord.com/invite/lido"
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.footerDiscord}
          data-testid="footerDiscordLink"
        >
          Discord
        </FooterLink>
      </Stack>
      <Version />
    </FooterStyle>
  );
};
