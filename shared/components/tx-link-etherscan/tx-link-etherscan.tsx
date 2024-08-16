import { useSDK } from '@lido-sdk/react';
import { getEtherscanTxLink } from '@lido-sdk/helpers';
import { MatomoLink } from '../matomo-link/matomo-link';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

type TxLinkEtherscanProps = {
  text?: string;
  txHash?: string | null;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export const TxLinkEtherscan = (props: TxLinkEtherscanProps) => {
  const { txHash, text = 'View on Etherscan', onClick } = props;
  const { chainId } = useSDK();

  if (!txHash) return null;

  return (
    <MatomoLink
      onClick={onClick}
      href={getEtherscanTxLink(chainId, txHash)}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.etherscanTxLink}
    >
      {text}
    </MatomoLink>
  );
};
