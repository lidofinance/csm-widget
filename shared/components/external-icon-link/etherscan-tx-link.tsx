import { IconLink } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useDappStatus } from 'modules/web3';
import { ComponentProps, FC } from 'react';
import { MatomoLink } from '../matomo-link/matomo-link';
import { getEtherscanTxLink } from 'utils';

type Props = ComponentProps<typeof MatomoLink> & {
  txHash?: string | null;
};

export const EtherscanTxLink: FC<Props> = ({ txHash, ...rest }) => {
  const { chainId } = useDappStatus();

  if (!txHash) return null;

  return (
    <MatomoLink
      {...rest}
      href={getEtherscanTxLink(chainId ?? 1, txHash)}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.etherscanTxLink}
      aria-label="Distribution transaction on Etherscan"
      title="View on etherscan"
    >
      <IconLink />
    </MatomoLink>
  );
};
