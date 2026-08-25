import { useEffect } from 'react';
import { useDappStatus } from '../hooks';
import { useSmSDK } from '../web3-provider';
import { clearCachedOperatorId } from './use-cached-id';

let forget: (() => void) | undefined;

/**
 * Forgets the connected address' cached operator selection. Call it from a deliberate
 * disconnect; no-op when no NodeOperatorProvider is mounted (mock stands).
 */
export const forgetCachedOperator = () => forget?.();

// Registration, not an `address` defined→undefined watcher: address also drops on an
// unsupported chain and on the empty accounts beat wallets emit while switching account,
// and inferring a disconnect from those silently deleted the selection.
export const useRegisterForgetCachedOperator = () => {
  const { address } = useDappStatus();
  const {
    core: { moduleId },
  } = useSmSDK();

  useEffect(() => {
    if (!address) return;

    const clear = () => clearCachedOperatorId(moduleId, address);
    forget = clear;

    return () => {
      if (forget === clear) forget = undefined;
    };
  }, [address, moduleId]);
};
