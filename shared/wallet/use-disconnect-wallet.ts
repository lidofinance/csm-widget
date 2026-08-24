import { forgetCachedOperator } from 'modules/web3';
import { useCallback } from 'react';
import { useDisconnect } from 'reef-knot/core-react';

/** Disconnects and forgets the address' cached operator, so reconnecting re-prompts the selection */
export const useDisconnectWallet = () => {
  const { disconnect } = useDisconnect();

  return useCallback(() => {
    forgetCachedOperator();
    disconnect?.();
  }, [disconnect]);
};
