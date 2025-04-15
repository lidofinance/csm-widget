import { getExternalLinks } from 'consts/external-links';
import { KEY_STATUS } from 'consts/key-status';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { MatomoLink } from '../matomo-link/matomo-link';

import { ReactComponent as BeaconchaLink } from 'assets/icons/beaconcha-link.svg';

type KeyLinkProps = {
  pubkey: string;
  statuses?: KEY_STATUS[];
};

const { beaconchain } = getExternalLinks();

const NON_DEPOSITED_STATUSES: KEY_STATUS[] = [
  KEY_STATUS.DEPOSITABLE,
  KEY_STATUS.DUPLICATED,
  KEY_STATUS.INVALID,
  KEY_STATUS.NON_QUEUED,
  KEY_STATUS.UNCHECKED,
];

export const BeaconchainPubkeyLink: FC<KeyLinkProps> = ({
  pubkey,
  statuses,
}) => {
  const href = beaconchain ? `${beaconchain}/validator/${pubkey}` : '';
  if (statuses?.every((status) => NON_DEPOSITED_STATUSES.includes(status)))
    return null;

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
