import { getEtherscanTxLink } from '@lido-sdk/helpers';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useDappStatus } from 'modules/web3';
import { FC } from 'react';
import { MatomoLink } from '../matomo-link/matomo-link';

type TxLinkEtherscanProps = {
  text?: string;
  txHash?: string | null;
};

export const TxLinkEtherscan: FC<TxLinkEtherscanProps> = ({
  txHash,
  text = 'View on Etherscan',
}) => {
  const { chainId } = useDappStatus();

  if (!txHash) return null;

  return (
    <MatomoLink
      href={getEtherscanTxLink(chainId, txHash)}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.etherscanTxLink}
    >
      {text}
    </MatomoLink>
  );
};
