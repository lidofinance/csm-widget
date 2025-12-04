import { KEY_STATUS, KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { getExternalLinks } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { hasInterception } from 'utils';
import { MatomoLink } from '../matomo-link/matomo-link';

import { ReactComponent as BeaconchaLink } from 'assets/icons/beaconcha-link.svg';

const { beaconchain } = getExternalLinks();

const NON_DEPOSITED_STATUSES: KEY_STATUS[] = [
  KEY_STATUS.DEPOSITABLE,
  KEY_STATUS.DUPLICATED,
  KEY_STATUS.INVALID,
  KEY_STATUS.NON_QUEUED,
  KEY_STATUS.UNCHECKED,
];

export const BeaconchainPubkeyLink: FC<
  Pick<KeyWithStatus, 'pubkey' | 'statuses'>
> = ({ pubkey, statuses }) => {
  const href = beaconchain ? `${beaconchain}/validator/${pubkey}` : '';
  const skip = hasInterception(statuses, NON_DEPOSITED_STATUSES);

  if (skip) return null;

  return (
    <>
      {href && (
        <MatomoLink
          href={href}
          title="View on beaconcha.in"
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.beaconchainPubkeyLink}
        >
          <BeaconchaLink />
        </MatomoLink>
      )}
    </>
  );
};
