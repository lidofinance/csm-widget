import { Button, ButtonProps } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren, useCallback } from 'react';
import { useConnect } from 'reef-knot/core-react';

import { useUserConfig } from 'config/user-config';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { trackMatomoEvent, WithMatomoEvent } from 'utils';

export const Connect: FC<PropsWithChildren<WithMatomoEvent<ButtonProps>>> = ({
  children,
  matomoEvent = MATOMO_CLICK_EVENTS_TYPES.connectWallet,
  onClick,
  ...rest
}) => {
  const { isWalletConnectionAllowed } = useUserConfig();
  const { connect } = useConnect();

  const handleClick = useCallback(() => {
    trackMatomoEvent(matomoEvent);
    if (!isWalletConnectionAllowed) return;
    void connect();
  }, [connect, isWalletConnectionAllowed, matomoEvent]);

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
