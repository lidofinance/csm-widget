import { getEtherscanAddressLink } from '@lido-sdk/helpers';
import { External } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { useAccount } from 'shared/hooks';
import { MatomoLink } from '../matomo-link/matomo-link';

type Props = {
  address: string;
};

export const EtherscanAddressLink: FC<Props> = ({ address }) => {
  const { chainId } = useAccount();
  const href = getEtherscanAddressLink(chainId ?? 0, address);

  return (
    <>
      {href && (
        <MatomoLink
          href={href}
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.etherscanAddressLink}
          title="View on etherscan"
        >
          <External />
        </MatomoLink>
      )}
    </>
  );
};
