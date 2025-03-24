import { getEtherscanAddressLink } from '@lido-sdk/helpers';
import { External } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { useAccount } from 'shared/hooks';
import { MatomoLink } from '../matomo-link/matomo-link';
import { CHAINS } from '@lido-sdk/constants';

type Props = {
  address: string;
};

const getExplorerAddressLink = (chainId: number, address: string) => {
  if (chainId === CHAINS.Hoodi) {
    return `https://hoodi.cloud.blockscout.com/address/${address}`;
  }
  return getEtherscanAddressLink(chainId, address);
};

export const EtherscanAddressLink: FC<Props> = ({ address }) => {
  const { chainId } = useAccount();

  if (!address) return null;

  return (
    <MatomoLink
      href={getExplorerAddressLink(chainId ?? 0, address)}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.etherscanAddressLink}
      title="View on etherscan"
    >
      <External />
    </MatomoLink>
  );
};
