import { Notification } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useChainName } from 'shared/hooks';

export const AlertUnsupportedChain: FC = () => {
  const chainName = useChainName(true);

  return (
    <Notification fluid title="Unsupported chain">
      Please switch to {chainName} in your wallet
    </Notification>
  );
};
