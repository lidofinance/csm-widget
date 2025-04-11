import { getExternalLinks } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { MatomoLink } from '../matomo-link/matomo-link';

import { ReactComponent as BeaconchaLink } from 'assets/icons/beaconcha-link.svg';

type KeyLinkProps = {
  pubkey: string;
};

const { beaconchain } = getExternalLinks();

export const BeaconchainPubkeyLink: FC<KeyLinkProps> = ({ pubkey }) => {
  const href = beaconchain ? `${beaconchain}/validator/${pubkey}` : '';

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
