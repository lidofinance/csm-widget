import { Button } from '@lidofinance/lido-app-ui';
import { FC } from 'react';

import { useConnectWallet } from './use-connect-wallet';

export const ConnectAppButton: FC = () => {
  const { handleClick, disabled } = useConnectWallet();

  return (
    <Button
      variant="primary"
      size="small"
      disabled={disabled}
      onClick={handleClick}
      data-testid="connectBtn"
    >
      Connect wallet
    </Button>
  );
};
