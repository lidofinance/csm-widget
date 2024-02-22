import { Zero } from '@ethersproject/constants';
import { useMemo } from 'react';
import { useWeb3 } from 'reef-knot/web3-react';

import { useAwaiter } from 'shared/hooks/use-awaiter';

import type {
  SubmitKeysFormNetworkData,
  SubmitKeysFormValidationContext,
} from './types';

export const useSubmitKeysFormValidationContext = (
  networkData: SubmitKeysFormNetworkData,
): Promise<SubmitKeysFormValidationContext> => {
  const { active } = useWeb3();
  const { etherBalance, isMultisig, gasCost } = networkData;
  const validationContextAwaited = useMemo(() => {
    if (!active || (etherBalance && gasCost && isMultisig)) {
      return {
        isWalletActive: active,
        // condition above guaranties stubs will only be passed when active = false
        etherBalance: etherBalance ?? Zero,
        gasCost: gasCost ?? Zero,
        isMultisig: isMultisig ?? false,
      };
    }
    return undefined;
  }, [active, etherBalance, gasCost, isMultisig]);

  return useAwaiter(validationContextAwaited).awaiter;
};
