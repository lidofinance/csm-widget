import { useSDK } from '@lido-sdk/react';
import { getEtherscanTxLink } from '@lido-sdk/helpers';
import { MatomoLink } from '../matomo-link/matomo-link';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';

type TxLinkEtherscanProps = {
  text?: string;
  txHash?: string | null;
};

export const TxLinkEtherscan: FC<TxLinkEtherscanProps> = ({
  txHash,
  text = 'View on Etherscan',
}) => {
  const { chainId } = useSDK();

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
