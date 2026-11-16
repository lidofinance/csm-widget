import { IconLink, TextLink } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useDappStatus } from 'modules/web3';
import { FC, ReactNode } from 'react';
import { getEtherscanTxLink, trackMatomoEvent } from 'utils';

type TxLinkEtherscanProps = {
  text?: ReactNode;
  txHash?: string | null;
};

export const TxLinkEtherscan: FC<TxLinkEtherscanProps> = ({
  txHash,
  text = 'View on Etherscan',
}) => {
  const { chainId } = useDappStatus();

  if (!txHash) return null;

  const href = getEtherscanTxLink(chainId, txHash);

  return (
    <TextLink
      external
      href={href}
      icon={<IconLink />}
      onClick={() =>
        trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.etherscanTxLink)
      }
    >
      {text}
    </TextLink>
  );
};
