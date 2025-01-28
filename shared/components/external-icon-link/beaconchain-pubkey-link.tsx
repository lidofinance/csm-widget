import { External } from '@lidofinance/lido-ui';
import { getExternalLinks } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { useAccount } from 'shared/hooks';
import { MatomoLink } from '../matomo-link/matomo-link';

type KeyLinkProps = {
  pubkey: string;
};

export const BeaconchainPubkeyLink: FC<KeyLinkProps> = ({ pubkey }) => {
  const { chainId } = useAccount();
  const { beaconchain } = getExternalLinks(chainId);
  const href = beaconchain ? `${beaconchain}/validator/${pubkey}` : '';

  return (
    <>
      {href && (
        <MatomoLink
          $secondary
          href={href}
          title="View on beaconcha.in"
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.etherscanAddressLink}
        >
          <External />
        </MatomoLink>
      )}
    </>
  );
};
