import buildInfo from 'build-info.json';
import { FC } from 'react';

import { getExternalLinks } from 'consts/external-links';
import { LogoLido, Stack } from 'shared/components';
import {
  FooterDivider,
  FooterLink,
  FooterStyle,
  LinkDivider,
  Version,
} from './styles';

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
    // link: `${repoBaseUrl}/releases/tag/${version}`,  // TODO: uncomment after make this repo public
  };
};

const { label, link } = getVersionInfo();
const { feedbackForm } = getExternalLinks();

// matomoEvent={MATOMO_CLICK_EVENTS_TYPES.feedbackFormLink}

// TODO: matomo events
export const Footer: FC = () => {
  return (
    <FooterStyle size="full" forwardedAs="footer">
      <LogoLido />
      <Stack gap="none">
        <FooterLink href="https://lido.fi/terms-of-use">
          Terms of Use
        </FooterLink>
        <LinkDivider />
        <FooterLink href="https://lido.fi/privacy-notice">
          Privacy Notice
        </FooterLink>
        <LinkDivider />
        <FooterLink href={feedbackForm}>Feedback form</FooterLink>
      </Stack>
      <Version href={link}>{label}</Version>
      <FooterDivider />
    </FooterStyle>
  );
};
