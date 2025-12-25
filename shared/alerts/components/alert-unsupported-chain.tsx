import { FC } from 'react';
import { useChainName } from 'shared/hooks';
import { Alert } from './alert';

export const AlertUnsupportedChain: FC = () => {
  const chainName = useChainName(true);

  return (
    <Alert title="Unsupported chain">
      <p>Please switch to {chainName} in your wallet.</p>
    </Alert>
  );
};
