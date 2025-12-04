import { KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { ReactComponent as BeaconchaLink } from 'assets/icons/beaconcha-link.svg';
import { getExternalLinks } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { MatomoLink } from '../matomo-link/matomo-link';

const { beaconchain } = getExternalLinks();

export const BeaconchainPubkeyLink: FC<Pick<KeyWithStatus, 'pubkey'>> = ({
  pubkey,
}) => {
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
