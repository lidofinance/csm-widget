import buildInfo from 'build-info.json';
import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { getExternalLinks } from 'consts/external-links';
import { LogoLido, Stack } from 'shared/components';
import { FooterLink, FooterStyle, LinkDivider, Version } from './styles';

const getVersionInfo = () => {
  const { version, branch } = buildInfo;
  const repoBaseUrl = 'https://github.com/lidofinance/csm-widget';
  if (version === 'REPLACE_WITH_VERSION')
    return {
      label: 'dev',
      link: repoBaseUrl,
    };
  if (version === branch + ':-unknown')
    return {
      label: 'preview',
      link: `${repoBaseUrl}/tree/${branch}`,
    };
  if (version === 'staging' || version === 'dev') {
    return {
      label: version,
      link: `${repoBaseUrl}/tree/${branch}`,
    };
  }
  return {
    label: `v${version}`,
    link: `${repoBaseUrl}/releases/tag/${version}`,
  };
};

const { label, link } = getVersionInfo();
const { feedbackForm } = getExternalLinks();

export const Footer: FC = () => (
  <FooterStyle>
    <LogoLido />
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
    <Version href={link} matomoEvent={MATOMO_CLICK_EVENTS_TYPES.footerVersion}>
      {label}
    </Version>
  </FooterStyle>
);
