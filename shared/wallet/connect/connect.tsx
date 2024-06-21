import { FC, PropsWithChildren, useCallback } from 'react';
import { useConnect } from 'reef-knot/core-react';
import { Button, ButtonProps } from '@lidofinance/lido-ui';
import { wrapWithEventTrack } from '@lidofinance/analytics-matomo';

import { MATOMO_CLICK_EVENTS } from 'consts/matomo-click-events';
import { useUserConfig } from 'config/user-config';

export const Connect: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  onClick,
  ...rest
}) => {
  const { isWalletConnectionAllowed } = useUserConfig();
  const { connect } = useConnect();

  const handleClick = wrapWithEventTrack(
    MATOMO_CLICK_EVENTS.connectWallet,
    useCallback(() => {
      if (!isWalletConnectionAllowed) return;
      void connect();
    }, [isWalletConnectionAllowed, connect]),
  );

  return (
    <Button
      disabled={!isWalletConnectionAllowed}
      onClick={handleClick}
      data-testid="connectBtn"
      {...rest}
    >
      {children ?? 'Connect wallet'}
    </Button>
  );
};
