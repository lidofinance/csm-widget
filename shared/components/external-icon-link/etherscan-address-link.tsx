import { getEtherscanAddressLink } from '@lido-sdk/helpers';
import { External } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { ComponentProps, FC } from 'react';
import { useAccount } from 'shared/hooks';
import { MatomoLink } from '../matomo-link/matomo-link';

type Props = ComponentProps<typeof MatomoLink> & {
  address: string;
};

export const EtherscanAddressLink: FC<Props> = ({ address, ...rest }) => {
  const { chainId } = useAccount();

  if (!address) return null;

  return (
    <MatomoLink
      {...rest}
      href={getEtherscanAddressLink(chainId ?? 1, address)}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.etherscanAddressLink}
      title="View on etherscan"
    >
      <External />
    </MatomoLink>
  );
};
