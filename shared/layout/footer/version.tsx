import buildInfo from 'build-info.json';
import { Tag } from '@lidofinance/lido-app-ui';
import { FC } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { trackMatomoEvent } from 'utils';

const getVersionInfo = () => {
  const { version, branch, commit } = buildInfo;
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
      title: `Commit: ${commit}`,
    };
  if (version === 'staging' || version === 'dev')
    return {
      label: version,
      link: `${repoBaseUrl}/tree/${branch}`,
      title: `Commit: ${commit}`,
    };
  if (version === `${branch}:${commit}`)
    return {
      label: branch,
      link: `${repoBaseUrl}/commit/${commit}`,
      title: `Commit: ${commit}`,
    };
  return {
    label: `v${version}`,
    link: `${repoBaseUrl}/releases/tag/${version}`,
    title: `Commit: ${commit}`,
  };
};

const { label, link, title } = getVersionInfo();

export const Version: FC = () => (
  <a
    href={link}
    title={title}
    target="_blank"
    rel="noopener noreferrer"
    style={{ textDecoration: 'none' }}
    onClick={() => trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.footerVersion)}
    data-testid="footerVersionLink"
  >
    <Tag variant="neutral">{label}</Tag>
  </a>
);
