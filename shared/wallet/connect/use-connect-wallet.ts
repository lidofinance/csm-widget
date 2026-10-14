import { useCallback } from 'react';
import { useConnect, useDisconnect } from 'reef-knot/core-react';

import { useUserConfig } from 'config/user-config';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useDappStatus } from 'modules/web3';
import { trackMatomoEvent } from 'utils';

export const useConnectWallet = (
  matomoEvent: MATOMO_CLICK_EVENTS_TYPES = MATOMO_CLICK_EVENTS_TYPES.connectWallet,
) => {
  const { isSupportedChain, isWalletConnected } = useDappStatus();
  const { isWalletConnectionAllowed } = useUserConfig();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleClick = useCallback(() => {
    trackMatomoEvent(matomoEvent);
    if (!isWalletConnectionAllowed) return;

    if (isWalletConnected && !isSupportedChain) {
      disconnect?.();
    }
    void connect();
  }, [
    connect,
    disconnect,
    isSupportedChain,
    isWalletConnected,
    isWalletConnectionAllowed,
    matomoEvent,
  ]);

  return { handleClick, disabled: !isWalletConnectionAllowed };
};
