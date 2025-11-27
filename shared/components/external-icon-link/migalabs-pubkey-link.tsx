import { getExternalLinks } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { MatomoLink } from '../matomo-link/matomo-link';

import { ReactComponent as MigalabsLink } from 'assets/icons/migalabs-link.svg';
import { KeyWithStatus } from '@lidofinance/lido-csm-sdk';

const { migalabs } = getExternalLinks();

export const MigalabsPubkeyLink: FC<Pick<KeyWithStatus, 'validatorIndex'>> = ({
  validatorIndex,
}) => {
  const href =
    migalabs && validatorIndex
      ? `${migalabs}/validators/${validatorIndex}`
      : '';

  return (
    <>
      {href && (
        <MatomoLink
          href={href}
          title="View on MigaLabs"
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.migalabsPubkeyLink}
        >
          <MigalabsLink />
        </MatomoLink>
      )}
    </>
  );
};
