import { Footer as LibFooter, TextLink } from '@lidofinance/lido-app-ui';
import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { useExternalLinks } from 'shared/hooks';
import { trackMatomoEvent } from 'utils';
import { Version } from './version';

// bare pages (maintenance/qa-config/test, 500 fallback) render outside Web3Provider; useExternalLinks needs wagmi context
const FeedbackFormLink: FC = () => {
  const { feedbackForm } = useExternalLinks();
  return (
    <TextLink
      variant="secondary"
      external
      href={feedbackForm}
      onClick={() =>
        trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.footerFeedbackForm)
      }
      data-testid="footerFeedbackFormLink"
    >
      Feedback form
    </TextLink>
  );
};

type Props = {
  dummy?: boolean | 'semi';
};

export const Footer: FC<Props> = ({ dummy }) => (
  <LibFooter aside={<Version />} data-testid="appFooter">
    <TextLink
      variant="secondary"
      external
      href="https://lido.fi/terms-of-use"
      onClick={() =>
        trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.footerTermsOfUse)
      }
      data-testid="footerTermsOfUseLink"
    >
      Terms of Use
    </TextLink>
    <TextLink
      variant="secondary"
      external
      href="https://lido.fi/privacy-notice"
      onClick={() =>
        trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.footerPrivacyNotice)
      }
      data-testid="footerPrivacyNoticeLink"
    >
      Privacy Notice
    </TextLink>
    {dummy !== true && <FeedbackFormLink />}
    <TextLink
      variant="secondary"
      external
      href="https://discord.com/invite/lido"
      onClick={() => trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.footerDiscord)}
      data-testid="footerDiscordLink"
    >
      Discord
    </TextLink>
  </LibFooter>
);
