import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { useChainName } from 'shared/hooks';
import { AlertRed } from './styles';

export const AlertUnsupportedChain: FC = () => {
  const chainName = useChainName(true);

  return (
    <AlertRed>
      <Text size="xs" weight="bold">
        Unsupported chain
      </Text>
      <p>Please switch to {chainName} in your wallet.</p>
    </AlertRed>
  );
};
