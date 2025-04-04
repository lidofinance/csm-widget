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

  if (!address) return null;

  return (
    <MatomoLink
      href={getEtherscanAddressLink(chainId ?? 0, address)}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.etherscanAddressLink}
      title="View on etherscan"
    >
      <External />
    </MatomoLink>
  );
};
